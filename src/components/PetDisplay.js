import React from 'react';

export function PetDisplay({ pet }) {
    return <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <p>ペットが見つかりません...🥹</p>
    </div>;
  }

  // ペットのMBTIを計算する（簡易版）
  const calculateMBTI = (params) => {
    // 心理機能の合計値で簡易的にMBTIを判定するロジックをここに実装
    // 今回は初期表示なので、名前とタイプだけ表示するよ！
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
      <h2>🧸 {pet.name} 🧸</h2>
      <p style={{ fontSize: '1.2em', color: '#ff69b4' }}>
        {pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐦'} {pet.type}
      </p>
      <p>成長ポイント: **{pet.growth_points}**</p>
      <p>性格 (MBTI): **{mbti}**</p>
      <p style={{ fontSize: '0.8em', color: '#888' }}>
        （リマインダーを達成すると、成長ポイントが増えて性格が変わっていくよ！✨）
      </p>
    </div>
  );
}

