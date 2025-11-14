import React from 'react';
import { useAuth } from './hooks/useAuth';
import { usePet } from './hooks/usePet'; // 新しいフックをインポート
import { LoginForm } from './components/LoginForm';
import { PetDisplay } from './components/PetDisplay'; // PetDisplayをインポート
import { signOut } from './services/supabase';

function App() {
  const { session, user, loading } = useAuth();
  const { pet, loading: petLoading, error: petError } = usePet(user?.id); // ユーザーIDを渡す

  if (loading) {
    return <div>ロード中...🧸</div>;
  }

    return <LoginForm />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>リマインダーアプリへようこそ！🫶</h1>
      <p>ログインユーザー: {session.user.email}</p>
      
      {petLoading ? (
        <p>ペットを読み込み中...🐱</p>
      ) : petError ? (
        <p style={{ color: 'red' }}>ペットの読み込みエラー: {petError}</p>
      ) : (
        <PetDisplay pet={pet} />
      )}

      <button onClick={signOut} style={{ padding: '10px 15px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
        ログアウト
      </button>
      {/* ここにリマインダーやその他のコンポーネントを配置するよ！ */}
    </div>
  );
}

export default App;

