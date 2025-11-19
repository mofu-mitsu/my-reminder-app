import React, { useState } from 'react';
import { updatePetName } from '../services/supabase';

export function PetDisplay({ pet }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(pet?.name ?? '');
  const [updateError, setUpdateError] = useState(null);

  // ペットが null / undefined の場合の早期リターン
  if (!pet) {
    return (
      <div style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}>
        <p>ペットが見つからないよ…🥹</p>
      </div>
    );
  }

  // 名前変更処理
  const handleNameChange = async () => {
    if (!newName.trim() || newName === pet.name) {
      setIsEditing(false);
      return;
    }

    try {
      setUpdateError(null);
      const updatedPet = await updatePetName(pet.id, newName.trim());
      pet.name = updatedPet.name;
      setIsEditing(false);
    } catch (err) {
      setUpdateError('名前変更でエラー出ちゃった…: ' + err.message);
    }
  };

  const calculateMBTI = () => {
    return 'INFP (仮)';
  };

  const mbti = calculateMBTI();

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #ff69b4',
      borderRadius: '15px',
      backgroundColor: '#fff0f5',
      margin: '20px 0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>

      {isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleNameChange}
            onKeyDown={(e) => e.key === 'Enter' && handleNameChange()}
            style={{
              fontSize: '1.5em',
              padding: '5px',
              width: '150px',
              borderRadius: '5px',
              border: '1px solid #ff69b4'
            }}
            autoFocus
          />
          <button
            onClick={handleNameChange}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#ff69b4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            決定
          </button>
        </div>
      ) : (
        <h2 onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
          🧸 {pet.name} 🧸
          <span style={{ fontSize: '0.6em', color: '#888' }}>[名前変更]</span>
        </h2>
      )}

      {updateError && (
        <p style={{ color: 'red', fontSize: '0.8em' }}>{updateError}</p>
      )}

      <p style={{ fontSize: '1.2em', color: '#ff69b4' }}>
        {pet.type === 'dog'
          ? '🐶'
          : pet.type === 'cat'
          ? '🐱'
          : '🐦'}{' '}
        {pet.type}
      </p>

      <p>成長ポイント: {pet.growth_points}</p>
      <p>性格(MBTI): {mbti}</p>
    </div>
  );
}