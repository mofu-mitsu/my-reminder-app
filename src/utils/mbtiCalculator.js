const DEFAULT_TRAITS = {
  Te: 0,
  Ti: 0,
  Fe: 0,
  Fi: 0,
  Se: 0,
  Si: 0,
  Ne: 0,
  Ni: 0,
};

const CATEGORY_TRAIT_DELTAS = {
  water: { Si: 2, Te: 1 },
  medicine: { Si: 1, Te: 2 },
  shopping: { Se: 1, Fe: 1, Te: 1 },
  walk: { Se: 2, Fe: 1 },
  sleep: { Si: 2, Ni: 1 },
  umbrella: { Ni: 2, Si: 1 },
  custom: { Ne: 1, Fi: 1 },
};

const MAX_TRAIT = 100;
const MIN_TRAIT = -100;

export function normalizeTraits(rawTraits = {}) {
  const merged = { ...DEFAULT_TRAITS, ...rawTraits };
  return Object.entries(merged).reduce((acc, [key, value]) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    acc[key] = Math.max(MIN_TRAIT, Math.min(MAX_TRAIT, safeValue));
    return acc;
  }, {});
}

export function calculateMBTIScore(traits = {}) {
  const normalized = normalizeTraits(traits);

  const letters = [
    normalized.Se + normalized.Ne >= normalized.Si + normalized.Ni ? 'E' : 'I',
    normalized.Si + normalized.Se >= normalized.Ni + normalized.Ne ? 'S' : 'N',
    normalized.Te + normalized.Fe >= normalized.Ti + normalized.Fi ? 'T' : 'F',
    normalized.J !== undefined
      ? normalized.J >= 0
        ? 'J'
        : 'P'
      : normalized.Te + normalized.Ti >= normalized.Ne + normalized.Se
      ? 'J'
      : 'P',
  ];

  return {
    mbti: letters.join(''),
    traits: normalized,
  };
}

export function getCategoryTraitDelta(category) {
  return CATEGORY_TRAIT_DELTAS[category] ?? CATEGORY_TRAIT_DELTAS.custom;
}

export function applyTraitDelta(traits = {}, delta = {}) {
  const base = normalizeTraits(traits);
  const updated = { ...base };
  Object.entries(delta).forEach(([key, value]) => {
    if (!(key in DEFAULT_TRAITS)) return;
    const increment = Number(value) || 0;
    updated[key] = Math.max(
      MIN_TRAIT,
      Math.min(MAX_TRAIT, (updated[key] ?? 0) + increment),
    );
  });
  return updated;
}

