import React, { useState, useEffect } from 'react';

export function OwnerSettings({ ownerName, onSave }) {
  const [value, setValue] = useState(ownerName ?? '');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setValue(ownerName ?? '');
  }, [ownerName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setStatus('なまえを入力してね！');
      return;
    }
    onSave?.(trimmed);
    setStatus('保存したよ🧸');
  };

  return (
    <div style={{
      marginTop: '16px',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #ffd0e4',
      backgroundColor: '#fff8fb',
      textAlign: 'left',
    }}>
      <h3>飼い主さんの呼び名</h3>
      <p style={{ marginTop: 0, fontSize: '0.85em', color: '#666' }}>
        ペットが呼びかける名前を設定してね！
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='例: みつき'
          style={{
            flex: '1 1 180px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ffc1de',
          }}
        />
        <button
          type='submit'
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#ff69b4',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          保存
        </button>
      </form>
      {status && <p style={{ marginTop: '6px', fontSize: '0.8em' }}>{status}</p>}
    </div>
  );
}

