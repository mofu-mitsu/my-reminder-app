import React, { useState } from 'react';
import { signIn, signUp } from '../services/supabase';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        // サインアップ後、Supabaseから確認メールが送られる
        await signUp(email, password);
        alert('サインアップが完了しました！メールを確認してください。');
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      // Supabaseのエラーメッセージはユーザーフレンドリーではない場合があるので、ここで調整しても良い
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2>{isSignUp ? 'サインアップ' : 'ログイン'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>メールアドレス:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>パスワード:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        {error && <p style={{ color: 'red', fontSize: '12px' }}>エラー: {error}</p>}
        <button type='submit' style={{ padding: '10px 15px', backgroundColor: '#ff69b4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          {isSignUp ? 'サインアップ' : 'ログイン'}
        </button>
      </form>
      <button
        type='button'
        onClick={() => setIsSignUp(prev => !prev)}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#ff69b4', cursor: 'pointer', textDecoration: 'underline' }}
      >
        {isSignUp ? 'アカウントをお持ちの方はこちら' : 'アカウントを作成する'}
      </button>
    </div>
  );
}

