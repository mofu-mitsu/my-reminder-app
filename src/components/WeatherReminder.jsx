import React, { useState } from 'react';
import { createReminder } from '../services/supabase';
import { getUmbrellaSuggestion } from '../services/weather';

async function resolveCoords() {
  if ('geolocation' in navigator) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
        () => resolve(undefined),
        { timeout: 4000 },
      );
    });
  }
  return undefined;
}

export function WeatherReminder({ userId, onReminderCreated }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckWeather = async () => {
    if (!userId) {
      setStatus('ログインが必要だよ！');
      return;
    }

    setLoading(true);
    setStatus('天気をチェック中…☁️');

    try {
      const coords = await resolveCoords();
      const suggestion = await getUmbrellaSuggestion(coords);

      if (!suggestion.shouldRemind) {
        setStatus(`今日は降水確率${suggestion.maxProbability}%で傘はいらなそう！`);
        return;
      }

      const reminder = {
        user_id: userId,
        title: '傘を持っていこう！',
        category: 'umbrella',
        due_time: suggestion.dueDate.toISOString(),
      };

      await createReminder(reminder);
      onReminderCreated?.();

      setStatus(`降水確率${suggestion.maxProbability}%！傘リマインダー作成したよ☔`);
    } catch (err) {
      setStatus(`天気取得でエラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '16px',
      border: '1px solid #8ecae6',
      borderRadius: '10px',
      backgroundColor: '#e0f7ff',
      margin: '20px 0',
    }}>
      <h3>天気連動リマインダー ☁️</h3>
      <p style={{ marginTop: 0, fontSize: '0.9em' }}>
        位置情報を許可すると、その場所の降水確率を見て傘リマインダーを提案するよ。
      </p>
      <button
        onClick={handleCheckWeather}
        disabled={loading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#219ebc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'チェック中…' : '今日の天気をチェック'}
      </button>
      {status && <p style={{ marginTop: '10px', fontSize: '0.85em' }}>{status}</p>}
    </div>
  );
}

