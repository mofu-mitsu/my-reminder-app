import React, { useState, useMemo } from 'react';
import { appendLearningLog } from '../services/supabase';

const toneOptions = [
  { value: 'praise', label: '褒める' },
  { value: 'gentle', label: 'やさしく励ます' },
  { value: 'energetic', label: '元気いっぱい' },
  { value: 'calm', label: '落ち着いたアドバイス' },
];

const toneLabelMap = toneOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export function LearningLogPanel({ pet, onUpdated, learningCost = 0 }) {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('praise');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const recentLogs = useMemo(() => {
    const logs = Array.isArray(pet?.learning_logs) ? pet.learning_logs : [];
    return [...logs].slice(-5).reverse();
  }, [pet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pet?.id) return;
    if (!message.trim()) {
      setStatus('文章を入力してね！');
      return;
    }
    if ((pet.growth_points ?? 0) < learningCost) {
      setStatus(`成長ポイントが足りないよ！（必要: ${learningCost}）`);
      return;
    }

    setLoading(true);
    setStatus('AIに覚えさせてるよ…🧠');

    try {
      await appendLearningLog(pet.id, {
        text: message.trim(),
        tone,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      }, { cost: learningCost });

      setMessage('');
      setTags('');
      setStatus('覚えたよ！✨');
      onUpdated?.();
    } catch (err) {
      setStatus(`保存に失敗しちゃった…: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginTop: '20px',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #d1c4e9',
      backgroundColor: '#f7f3ff',
      textAlign: 'left',
    }}>
      <h3>AI学習ログ 🧠</h3>
      <p style={{ marginTop: 0, fontSize: '0.9em', color: '#666' }}>
        ペットに覚えてほしい言葉や口癖を追加すると、AI会話に反映されるよ！
      </p>
      {learningCost > 0 && (
        <p style={{ marginTop: '-4px', fontSize: '0.8em', color: '#9c27b0' }}>
          1フレーズ覚えるのに {learningCost} pt 消費（現在: {pet?.growth_points ?? 0} pt）
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder='例: 「寝る前に水飲もうね」って言うと嬉しそうに褒めてほしい！'
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 160px' }}>
            トーン
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              {toneOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label style={{ flex: '2 1 200px' }}>
            タグ（カンマ区切り）
            <input
              type='text'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder='寝る前, 水分補給'
              style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </label>
        </div>
        <button
          type='submit'
          disabled={loading}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#9c27b0',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {loading ? '保存中…' : '覚えてもらう ✨'}
        </button>
      </form>
      {status && <p style={{ fontSize: '0.85em', marginTop: '8px' }}>{status}</p>}

      <div style={{ marginTop: '18px' }}>
        <h4 style={{ marginBottom: '8px' }}>最近覚えたこと</h4>
        {recentLogs.length === 0 ? (
          <p style={{ fontSize: '0.85em', color: '#777' }}>まだ何も覚えていないよ！</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentLogs.map(log => (
              <li key={log.id} style={{
                padding: '10px 12px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e0d7ff',
              }}>
                <p style={{ margin: 0 }}>{log.text}</p>
                <div style={{ marginTop: '6px', fontSize: '0.75em', color: '#666', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span>トーン: {toneLabelMap[log.tone] || log.tone || '未設定'}</span>
                  {log.tags?.length > 0 && <span>タグ: {log.tags.join(', ')}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

