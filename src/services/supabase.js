import { createClient } from '@supabase/supabase-js';

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

