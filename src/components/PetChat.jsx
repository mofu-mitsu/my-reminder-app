import React, { useEffect, useMemo, useState } from 'react';
import { generatePetReply } from '../services/aiClient';
import { PetAvatar } from './PetAvatar.jsx';
import { getPetCosmeticsFromPet } from '../utils/petShopState';

const MAX_HISTORY = 8;

export function PetChat({ pet, ownerName, userId }) {
  const chatStorageKey = useMemo(
    () => `petChatHistory:${userId ?? 'guest'}:${pet?.id ?? 'none'}`,
    [userId, pet?.id],
  );
  const { backgroundGradient, accessoryEmoji } = getPetCosmeticsFromPet(pet);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `${pet?.name ?? 'ペット'}だよ！${ownerName || 'ご主人さま'}、お話ししよ〜🧸`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!pet?.id) return;
    const raw = localStorage.getItem(chatStorageKey);
    if (!raw) {
      setMessages([
        {
          role: 'assistant',
          content: `${pet?.name ?? 'ペット'}だよ！${ownerName || 'ご主人さま'}、お話ししよ〜🧸`,
        },
      ]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      localStorage.removeItem(chatStorageKey);
    }
  }, [chatStorageKey, pet?.id, pet?.name, ownerName]);

  useEffect(() => {
    if (!pet?.id || !Array.isArray(messages) || messages.length === 0) return;
    localStorage.setItem(chatStorageKey, JSON.stringify(messages));
  }, [chatStorageKey, messages, pet?.id]);

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
    <div className="pet-chat-card">
      <section className="pet-chat-sidebar">
        <PetAvatar
          type={pet.type}
          mbti={pet.mbti}
          compact
          backgroundGradient={backgroundGradient}
          accessoryEmoji={accessoryEmoji}
        />
        <p style={{ margin: '8px 0 4px', fontWeight: 'bold' }}>{pet.name}</p>
        <p style={{ margin: 0, fontSize: '0.8em', color: '#666' }}>
          {ownerName ? `${ownerName} のおともだち` : 'ご主人さま大好き'}
        </p>
      </section>
      <section className="pet-chat-main">
        <h3 style={{ marginTop: 0 }}>ペットと会話 💬</h3>
        <div className="pet-chat-messages">
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
        <form onSubmit={handleSend} className="pet-chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="今日あったことを話しかけてみてね"
            className="pet-chat-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="pet-chat-send"
          >
            {loading ? '考え中…' : '送信'}
          </button>
        </form>
        {error && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '8px' }}>{error}</p>}
      </section>
    </div>
  );
}
