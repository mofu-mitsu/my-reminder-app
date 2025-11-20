import React from 'react';
import { useAuth } from './hooks/useAuth';
import { usePet } from './hooks/usePet';
import { useReminders } from './hooks/useReminders.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import { PetDisplay } from './components/PetDisplay.jsx';
import { ReminderForm } from './components/ReminderForm.jsx';
import { WeatherReminder } from './components/WeatherReminder.jsx';
import { signOut } from './services/supabase';

import { completeReminder, rewardPetForReminder } from './services/supabase';

function ReminderList({ reminders, loading, error, petId, onRefresh, onPetUpdate }) {
  const [completingId, setCompletingId] = React.useState(null);
  const [actionError, setActionError] = React.useState(null);

  if (loading) return <p>リマインダーを読み込み中...📝</p>;
  if (error) return <p style={{ color: 'red' }}>リマインダーの読み込みエラー: {error}</p>;
  if (reminders.length === 0) return <p>まだリマインダーがないよ！登録してみよう！</p>;

  const handleComplete = async (reminder) => {
    if (reminder.achieved) return;
    if (!petId) {
      setActionError('ペットがまだ準備できてないみたい…少し待ってね！');
      return;
    }

    setCompletingId(reminder.id);
    setActionError(null);

    try {
      await completeReminder(reminder.id);
      await rewardPetForReminder(petId, reminder.category);
      await Promise.all([onRefresh?.(), onPetUpdate?.()]);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div style={{ textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
      <h3>登録済みのリマインダー</h3>
      {reminders.map(r => (
        <div key={r.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <strong>{r.title}</strong> ({r.category})
            <p style={{ margin: '0', fontSize: '0.8em', color: '#888' }}>
              {new Date(r.due_time).toLocaleString()}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ color: r.achieved ? 'green' : 'orange' }}>
              {r.achieved ? '達成済' : '未達成'}
            </span>
            {!r.achieved && (
              <button
                onClick={() => handleComplete(r)}
                disabled={completingId === r.id}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ff69b4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.8em',
                }}
              >
                {completingId === r.id ? '更新中...' : '達成した！'}
              </button>
            )}
          </div>
        </div>
      ))}
      {actionError && <p style={{ color: 'red', fontSize: '0.8em' }}>{actionError}</p>}
    </div>
  );
}

function App() {
  const { session, user, loading } = useAuth();
  const { pet, loading: petLoading, error: petError, refreshPet } = usePet(user?.id);
  const { reminders, loading: remindersLoading, error: remindersError, fetchReminders } = useReminders(user?.id);

  if (loading) {
    return <div>ロード中...🧸</div>;
  }

  if (!session) {
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

      <ReminderForm userId={user.id} onReminderCreated={fetchReminders} />
      <WeatherReminder userId={user.id} onReminderCreated={fetchReminders} />
      
      <ReminderList
        reminders={reminders}
        loading={remindersLoading}
        error={remindersError}
        petId={pet?.id}
        onRefresh={fetchReminders}
        onPetUpdate={refreshPet}
      />

      <button onClick={signOut} style={{ padding: '10px 15px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
        ログアウト
      </button>
    </div>
  );
}

export default App;
