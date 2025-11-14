import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { signOut } from './services/supabase';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>ロード中...🧸</div>;
  }

    return <LoginForm />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>リマインダーアプリへようこそ！🫶</h1>
      <p>ログインユーザー: {session.user.email}</p>
      <button onClick={signOut} style={{ padding: '10px 15px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        ログアウト
      </button>
      {/* ここにリマインダーやペットのコンポーネントを配置するよ！ */}
    </div>
  );
}

export default App;

