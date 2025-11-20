import React, { useState } from 'react';
import { createReminder } from '../services/supabase';

const CATEGORIES = [
  { value: 'water', label: '植物の水やり 🪴' },
  { value: 'medicine', label: '薬 💊' },
  { value: 'shopping', label: '買い物 🛍️' },
  { value: 'walk', label: '散歩 🚶‍♀️' },
  { value: 'sleep', label: '寝る時間 😴' },
  { value: 'umbrella', label: '傘 ☔' },
  { value: 'focus', label: '思考タイム / 勉強 🧠' },
  { value: 'custom', label: 'その他 📝' },
];

export function ReminderForm({ userId, onReminderCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('water');
  const [dueTime, setDueTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const reminder = {
        user_id: userId,
        title: title,
        category: category,
        due_time: new Date(dueTime).toISOString(),
      };

      await createReminder(reminder);
      
      setTitle('');
      setDueTime('');
      onReminderCreated(); // 親コンポーネントに通知
      alert('リマインダーを登録したよ！🫶');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ff69b4', borderRadius: '8px', backgroundColor: '#fff', margin: '20px 0' }}>
      <h3>新しいリマインダーを登録するよ！✨</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type='text'
          placeholder='リマインダーの内容 (例: 観葉植物に水やり)'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input
          type='datetime-local'
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {error && <p style={{ color: 'red', fontSize: '12px' }}>エラー: {error}</p>}
        <button type='submit' disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#ff69b4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? '登録中...' : 'リマインダー登録！🧸'}
        </button>
      </form>
    </div>
  );
}

