import { getShopItem } from '../data/shopCatalog';

const DEFAULT_STATE = {
  owned: ['bg_default'],
  background: 'bg_default',
  equippedAccessory: null,
};

/**
 * Supabase の pets.accessories を正規化
 * - 旧形式: [] または ID の配列のみ
 * - 新形式: { owned, background, equippedAccessory }
 */
export function normalizeShopState(raw) {
  if (raw == null) {
    return { ...DEFAULT_STATE };
  }

  if (Array.isArray(raw)) {
    const owned = raw.length > 0 ? [...new Set([...raw, 'bg_default'])] : ['bg_default'];
    return {
      owned,
      background: 'bg_default',
      equippedAccessory: null,
    };
  }

  if (typeof raw === 'object') {
    const owned = Array.isArray(raw.owned) && raw.owned.length > 0
      ? [...new Set([...raw.owned, 'bg_default'])]
      : ['bg_default'];
    return {
      owned,
      background: raw.background && typeof raw.background === 'string' ? raw.background : 'bg_default',
      equippedAccessory: raw.equippedAccessory ?? null,
    };
  }

  return { ...DEFAULT_STATE };
}

/**
 * アバター表示用: 背景グラデと装備中アクセの絵文字
 */
export function getPetCosmeticsFromPet(pet) {
  const state = normalizeShopState(pet?.accessories);
  const bgItem = getShopItem(state.background);
  const accItem = state.equippedAccessory ? getShopItem(state.equippedAccessory) : null;

  return {
    backgroundGradient: bgItem?.gradient
      ?? 'linear-gradient(180deg, #ffffff 0%, #fff7fb 100%)',
    accessoryEmoji: accItem?.category === 'accessory' ? accItem.emoji : null,
    shopState: state,
  };
}
