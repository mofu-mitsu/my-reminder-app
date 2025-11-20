import { createClient } from '@supabase/supabase-js';
import { getCategoryTraitDelta, applyTraitDelta } from '../utils/mbtiCalculator';

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
    accessories: [],
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

