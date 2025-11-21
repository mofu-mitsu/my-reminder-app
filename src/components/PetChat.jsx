import React, { useState } from 'react';
import { generatePetReply } from '../services/aiClient';

const MAX_HISTORY = 8;

export function PetChat({ pet, ownerName }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `${pet?.name ?? 'ペット'}だよ！${ownerName || 'ご主人さま'}、お話ししよ〜🧸`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!pet) {
    return (
      <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '12px' }}>
        <p>ペットを読み込み中…</p>
      </div>
    );
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const reply = await generatePetReply({
        pet,
        ownerName,
        conversation: nextMessages.slice(-MAX_HISTORY),
      });
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #d0e8ff',
      backgroundColor: '#f0f7ff',
      textAlign: 'left',
    }}>
      <h3>ペットと会話 💬</h3>
      <div style={{
        maxHeight: '260px',
        overflowY: 'auto',
        margin: '12px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#ffcef2' : '#ffffff',
              color: '#333',
              padding: '10px 14px',
              borderRadius: '14px',
              maxWidth: '80%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='今日あったことを話しかけてみてね'
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #bbb',
          }}
        />
        <button
          type='submit'
          disabled={loading}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#2196f3',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {loading ? '考え中…' : '送信'}
        </button>
      </form>
      {error && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '8px' }}>{error}</p>}
    </div>
  );
}

