import { createClient } from '@supabase/supabase-js';
import { getCategoryTraitDelta, applyTraitDelta } from '../utils/mbtiCalculator';
import { getShopItem } from '../data/shopCatalog';
import { normalizeShopState } from '../utils/petShopState';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// メールアドレスとパスワードでサインアップ
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data;
}

// メールアドレスとパスワードでサインイン
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data;
}

// サインアウト
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 現在のセッションを取得
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ユーザーのペットを取得
export async function getPet(userId) {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
    throw error;
  }
  return data;
}

// 初期ペットを作成
export async function createInitialPet(userId) {
  const initialPet = {
    user_id: userId,
    type: 'dog', // 初期は犬に設定
    name: 'たまご', // 初期名は「たまご」
    mbti_params: { Te: 0, Fi: 0, Ni: 0, Se: 0, Fe: 0, Ti: 0, Ne: 0, Si: 0 },
    growth_points: 0,
    learning_logs: [],
    accessories: {
      owned: ['bg_default'],
      background: 'bg_default',
      equippedAccessory: null,
    },
  };

  const { data, error } = await supabase
    .from('pets')
    .insert([initialPet])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ペットの名前を変更
export async function updatePetName(petId, newName) {
  const { data, error } = await supabase
    .from('pets')
    .update({ name: newName })
    .eq('id', petId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// リマインダーを登録
export async function createReminder(reminder) {
  const { data, error } = await supabase
    .from('reminders')
    .insert([reminder])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ユーザーのリマインダーを取得
export async function getReminders(userId) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('due_time', { ascending: true });

  if (error) throw error;
  return data;
}

export async function completeReminder(reminderId) {
  const { data, error } = await supabase
    .from('reminders')
    .update({ achieved: true })
    .eq('id', reminderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rewardPetForReminder(petId, category) {
  const { data: currentPet, error: fetchError } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single();

  if (fetchError) throw fetchError;

  const delta = getCategoryTraitDelta(category);
  const updatedTraits = applyTraitDelta(currentPet.mbti_params, delta);
  const newGrowth = (currentPet.growth_points ?? 0) + 1;

  const { data, error } = await supabase
    .from('pets')
    .update({
      mbti_params: updatedTraits,
      growth_points: newGrowth,
      updated_at: new Date().toISOString(),
    })
    .eq('id', petId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

const generateLogId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

export async function appendLearningLog(petId, entry, options = {}) {
  const { cost = 0 } = options;
  const { data: pet, error: fetchError } = await supabase
    .from('pets')
    .select('learning_logs, growth_points')
    .eq('id', petId)
    .single();

  if (fetchError) throw fetchError;

  const logs = Array.isArray(pet.learning_logs) ? pet.learning_logs : [];
  const currentPoints = pet.growth_points ?? 0;
  if (currentPoints < cost) {
    throw new Error('成長ポイントが足りないよ！');
  }

  const logEntry = {
    id: generateLogId(),
    created_at: new Date().toISOString(),
    ...entry,
  };

  const { data, error } = await supabase
    .from('pets')
    .update({
      learning_logs: [...logs, logEntry],
      growth_points: currentPoints - cost,
    })
    .eq('id', petId)
    .select('learning_logs, growth_points')
    .single();

  if (error) throw error;
  return data.learning_logs;
}

export async function purchaseShopItem(petId, itemId) {
  const item = getShopItem(itemId);
  if (!item) throw new Error('商品が見つかりません');

  const { data: pet, error: fetchError } = await supabase
    .from('pets')
    .select('growth_points, accessories')
    .eq('id', petId)
    .single();

  if (fetchError) throw fetchError;

  const state = normalizeShopState(pet.accessories);
  if (state.owned.includes(itemId)) {
    throw new Error('もう持ってるよ');
  }

  const pts = pet.growth_points ?? 0;
  if (pts < item.price) {
    throw new Error('成長ポイントが足りないよ');
  }

  const newState = {
    ...state,
    owned: [...new Set([...state.owned, itemId])],
  };

  const { data, error } = await supabase
    .from('pets')
    .update({
      growth_points: pts - item.price,
      accessories: newState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', petId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function equipShopBackground(petId, backgroundId) {
  const item = getShopItem(backgroundId);
  if (!item || item.category !== 'background') {
    throw new Error('背景が見つかりません');
  }

  const { data: pet, error: fetchError } = await supabase
    .from('pets')
    .select('accessories')
    .eq('id', petId)
    .single();

  if (fetchError) throw fetchError;

  const state = normalizeShopState(pet.accessories);
  if (!state.owned.includes(backgroundId)) {
    throw new Error('まだこの背景は持ってないよ');
  }

  const newState = { ...state, background: backgroundId };

  const { data, error } = await supabase
    .from('pets')
    .update({
      accessories: newState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', petId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function equipShopAccessory(petId, accessoryId) {
  const { data: pet, error: fetchError } = await supabase
    .from('pets')
    .select('accessories')
    .eq('id', petId)
    .single();

  if (fetchError) throw fetchError;

  const state = normalizeShopState(pet.accessories);

  if (accessoryId === null || accessoryId === '') {
    const newState = { ...state, equippedAccessory: null };
    const { data, error } = await supabase
      .from('pets')
      .update({ accessories: newState, updated_at: new Date().toISOString() })
      .eq('id', petId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const item = getShopItem(accessoryId);
  if (!item || item.category !== 'accessory') {
    throw new Error('アクセサリーが見つかりません');
  }
  if (!state.owned.includes(accessoryId)) {
    throw new Error('まだこのアクセは持ってないよ');
  }

  const newState = { ...state, equippedAccessory: accessoryId };

  const { data, error } = await supabase
    .from('pets')
    .update({
      accessories: newState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', petId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

