import React, { useState } from 'react';
import { updatePetName } from '../services/supabase';

export function PetDisplay({ pet }) {
  if (!pet) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
        <p>ペットが見つかりません...🥹</p>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(pet.name);
  const [updateError, setUpdateError] = useState(null);

  const handleNameChange = async () => {
    if (newName.trim() === '' || newName === pet.name) {
      setIsEditing(false);
      return;
    }

    setUpdateError(null);
    try {
      const updatedPet = await updatePetName(pet.id, newName.trim());
      pet.name = updatedPet.name; 
      setIsEditing(false);
    } catch (error) {
      setUpdateError('名前の変更に失敗しました: ' + error.message);
    }
  };

  const calculateMBTI = (params) => {
    return 'INFP (仮)';
  };

  const mbti = calculateMBTI(pet.mbti_params);

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
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleNameChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameChange();
            }}
            style={{ fontSize: '1.5em', padding: '5px', width: '150px', borderRadius: '5px', border: '1px solid #ff69b4' }}
            autoFocus
          />
          <button onClick={handleNameChange} style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#ff69b4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>決定</button>
        </div>
      ) : (
        <h2 onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
          🧸 {pet.name} 🧸 <span style={{ fontSize: '0.6em', color: '#888' }}>[名前変更]</span>
        </h2>
      )}

      {updateError && <p style={{ color: 'red', fontSize: '0.8em' }}>{updateError}</p>}

      <p style={{ fontSize: '1.2em', color: '#ff69b4' }}>
        {pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐦'} {pet.type}
      </p>
      <p>成長ポイント: {pet.growth_points}</p>
      <p>性格 (MBTI): {mbti}</p>
      <p style={{ fontSize: '0.8em', color: '#888' }}>
        （リマインダーを達成すると、成長ポイントが増えて性格が変わっていくよ！✨）
      </p>
    </div>
  );
}