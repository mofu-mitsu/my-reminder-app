import React from 'react';
import { useAuth } from './hooks/useAuth';
import { usePet } from './hooks/usePet';
import { useReminders } from './hooks/useReminders.jsx';
import { useOwnerName } from './hooks/useOwnerName';
import { calculateMBTIScore } from './utils/mbtiCalculator';
import { LoginForm } from './components/LoginForm.jsx';
import { PetDisplay } from './components/PetDisplay.jsx';
import { ReminderForm } from './components/ReminderForm.jsx';
import { WeatherReminder } from './components/WeatherReminder.jsx';
import { LearningLogPanel } from './components/LearningLogPanel.jsx';
import { PetChat } from './components/PetChat.jsx';
import { OwnerSettings } from './components/OwnerSettings.jsx';
import { signOut, completeReminder, rewardPetForReminder } from './services/supabase';

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

const tabs = [
  { id: 'pet', label: 'ペット' },
  { id: 'reminders', label: 'リマインダー' },
  { id: 'learning', label: '学習' },
  { id: 'chat', label: '会話' },
];

const LEARNING_COST = 3;

function App() {
  const { session, user, loading } = useAuth();
  const { pet, loading: petLoading, error: petError, refreshPet } = usePet(user?.id);
  const { reminders, loading: remindersLoading, error: remindersError, fetchReminders } = useReminders(user?.id);
  const { ownerName, updateOwnerName } = useOwnerName();
  const [activeTab, setActiveTab] = React.useState('pet');

  const petForChat = React.useMemo(() => {
    if (!pet) return null;
    const { mbti } = calculateMBTIScore(pet.mbti_params);
    return { ...pet, mbti };
  }, [pet]);

  if (loading) {
    return <div>ロード中...🧸</div>;
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>AIペットリマインダー 🧸</h1>
          <p className="app-subtitle">ログイン中: {session.user.email}</p>
        </div>
        <button onClick={signOut} className="ghost-btn">ログアウト</button>
      </header>

      <nav className="app-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="app-content">
        {activeTab === 'pet' && (
          <>
            {petLoading ? (
              <p>ペットを読み込み中...🐱</p>
            ) : petError ? (
              <p style={{ color: 'red' }}>ペットの読み込みエラー: {petError}</p>
            ) : (
              <>
                <PetDisplay pet={pet} ownerName={ownerName} />
                <OwnerSettings ownerName={ownerName} onSave={updateOwnerName} />
              </>
            )}
          </>
        )}

        {activeTab === 'reminders' && (
          <>
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
          </>
        )}

        {activeTab === 'learning' && (
          <>
            {pet ? (
              <LearningLogPanel pet={pet} onUpdated={refreshPet} learningCost={LEARNING_COST} />
            ) : (
              <p>ペット情報を読み込み中…</p>
            )}
          </>
        )}

        {activeTab === 'chat' && (
          <>
            {petForChat ? (
              <PetChat pet={petForChat} ownerName={ownerName} />
            ) : (
              <p>ペットを読み込み中…</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
