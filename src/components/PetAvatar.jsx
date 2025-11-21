import React, { useEffect, useMemo, useState } from 'react';
import dogNormal from '../assets/pets/dog-normal.svg';
import dogBlink from '../assets/pets/dog-blink.svg';
import catNormal from '../assets/pets/cat-normal.svg';
import catBlink from '../assets/pets/cat-blink.svg';
import birdNormal from '../assets/pets/bird-normal.svg';
import birdBlink from '../assets/pets/bird-blink.svg';

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

const SPRITES = {
  dog: { normal: dogNormal, blink: dogBlink },
  cat: { normal: catNormal, blink: catBlink },
  bird: { normal: birdNormal, blink: birdBlink },
};

export function PetAvatar({ type = 'dog', mbti = 'INFP' }) {
  const colors = getColorForMbti(mbti);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const sprite = useMemo(() => {
    const group = SPRITES[type] ?? SPRITES.dog;
    return group[isBlinking ? 'blink' : 'normal'];
  }, [type, isBlinking]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: '240px',
          height: '240px',
          margin: '0 auto',
          borderRadius: '28px',
          border: '2px solid #ffd0e4',
          background: `linear-gradient(180deg, ${colors.accent} 0%, #fff 100%)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '85%',
            height: '85%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: colors.primary,
              WebkitMaskImage: `url(${sprite})`,
              maskImage: `url(${sprite})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
          <img
            src={sprite}
            alt={`${type} avatar`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </div>
      </div>
      <p style={{ marginTop: '8px', fontSize: '0.85em', color: '#666' }}>
        MBTIカラー: <span style={{ color: colors.primary }}>{mbti}</span>
      </p>
    </div>
  );
}

