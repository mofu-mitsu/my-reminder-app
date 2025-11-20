import React from 'react';

const MBTI_COLOR_PRESETS = {
  ENFP: { primary: '#ffa8d0', accent: '#ffdce8' },
  ENFJ: { primary: '#ff8fab', accent: '#ffd3e0' },
  ENTJ: { primary: '#7fd1ff', accent: '#c8ecff' },
  INFP: { primary: '#c7b9ff', accent: '#e8e0ff' },
  INFJ: { primary: '#b6c9ff', accent: '#dfe7ff' },
  INTJ: { primary: '#9ad1d4', accent: '#c6eff2' },
  ISTJ: { primary: '#f5c77f', accent: '#ffe5ba' },
  ISFP: { primary: '#f7a072', accent: '#ffd4bb' },
};

function getColorForMbti(mbti = 'INFP') {
  const key = (mbti || 'INFP').toUpperCase();
  if (MBTI_COLOR_PRESETS[key]) return MBTI_COLOR_PRESETS[key];

  const palette = {
    E: '#ffb4c0',
    I: '#c7d0ff',
    N: '#c8f6ff',
    S: '#ffe7a1',
    T: '#9fd3c7',
    F: '#ffcfdf',
    J: '#c3f584',
    P: '#ffdd94',
  };

  const primary = palette[key[0]] || '#dfe7fd';
  const accent = palette[key[1]] || '#f8effd';
  return { primary, accent };
}

function getStage(growthPoints = 0) {
  if (growthPoints >= 60) return 'adult';
  if (growthPoints >= 25) return 'teen';
  return 'baby';
}

function StageBadge({ stage }) {
  const label = stage === 'adult' ? '大人' : stage === 'teen' ? '子ども' : '赤ちゃん';
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '999px',
      backgroundColor: '#fff',
      border: '1px solid #ff69b4',
      fontSize: '0.75em',
      marginBottom: '6px',
    }}>
      {label}ステージ
    </span>
  );
}

export function PetAvatar({ type = 'dog', growthPoints = 0, mbti = 'INFP' }) {
  const colors = getColorForMbti(mbti);
  const stage = getStage(growthPoints);
  const faceRadius = stage === 'adult' ? 60 : stage === 'teen' ? 50 : 42;
  const svgSize = 180;

  const commonEyes = (
    <>
      <circle cx="70" cy="85" r="6" fill="#333" />
      <circle cx="110" cy="85" r="6" fill="#333" />
    </>
  );

  const blush = (
    <>
      <ellipse cx="50" cy="105" rx="10" ry="6" fill="#ffb4c0" opacity="0.5" />
      <ellipse cx="130" cy="105" rx="10" ry="6" fill="#ffb4c0" opacity="0.5" />
    </>
  );

  const mouth = <path d="M70 120 Q90 140 110 120" stroke="#663300" strokeWidth="4" fill="none" strokeLinecap="round" />;

  const typeSpecificParts = {
    dog: (
      <>
        <path d="M40 40 Q30 80 60 70" fill={colors.accent} />
        <path d="M120 70 Q150 80 140 40" fill={colors.accent} />
        <circle cx="90" cy="110" r="10" fill="#333" />
      </>
    ),
    cat: (
      <>
        <path d="M50 35 L65 70 L35 70 Z" fill={colors.accent} />
        <path d="M125 35 L140 70 L110 70 Z" fill={colors.accent} />
        <path d="M90 110 L60 118" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <path d="M90 110 L120 118" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    bird: (
      <>
        <ellipse cx="90" cy="120" rx="30" ry="20" fill={colors.primary} />
        <polygon points="90,90 105,105 75,105" fill="#ffbf69" />
        <path d="M60 130 Q40 120 45 150" stroke={colors.accent} strokeWidth="6" strokeLinecap="round" />
        <path d="M120 130 Q140 120 135 150" stroke={colors.accent} strokeWidth="6" strokeLinecap="round" />
      </>
    ),
  };

  const accessory = (
    <rect x="85" y="50" width="10" height="30" fill="#fff" stroke="#ff69b4" strokeWidth="3" rx="5" />
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <StageBadge stage={stage} />
      <div
        style={{
          width: '220px',
          height: '220px',
          margin: '0 auto',
          background: 'linear-gradient(180deg, #ffffff 0%, #ffeef6 100%)',
          borderRadius: '24px',
          border: '2px solid #ffd0e4',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg width={svgSize} height={svgSize} viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={faceRadius} fill={colors.primary} stroke="#6e5c62" strokeWidth="3" />
          {typeSpecificParts[type] || typeSpecificParts.dog}
          {commonEyes}
          {blush}
          {mouth}
          {mbti?.includes('F') && accessory}
        </svg>
      </div>
      <p style={{ marginTop: '8px', fontSize: '0.85em', color: '#666' }}>
        MBTIカラー: <span style={{ color: colors.primary }}>{mbti}</span>
      </p>
    </div>
  );
}

