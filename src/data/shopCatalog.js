/**
 * ショップ商品（成長ポイントで購入）
 * - 画像は後から差し替え可能。今は絵文字で表現。
 * - category: 'background' | 'accessory'
 */

export const SHOP_ITEMS = [
  {
    id: 'bg_default',
    category: 'background',
    name: 'ふわふわホワイト',
    description: '最初から使えるやさしい背景',
    price: 0,
    emoji: '🤍',
    gradient: 'linear-gradient(180deg, #ffffff 0%, #fff7fb 100%)',
  },
  {
    id: 'bg_sky',
    category: 'background',
    name: 'お空カラー',
    description: 'さわやかな水色グラデ',
    price: 8,
    emoji: '☁️',
    gradient: 'linear-gradient(180deg, #e0f4ff 0%, #ffffff 55%, #f5fbff 100%)',
  },
  {
    id: 'bg_sunset',
    category: 'background',
    name: '夕焼け',
    description: 'オレンジピンクの夕暮れ',
    price: 10,
    emoji: '🌇',
    gradient: 'linear-gradient(180deg, #ffe0c2 0%, #ffd6e8 45%, #fff0f5 100%)',
  },
  {
    id: 'bg_night',
    category: 'background',
    name: 'お星さま',
    description: '落ち着いた夜空',
    price: 12,
    emoji: '🌙',
    gradient: 'linear-gradient(180deg, #2d1f4e 0%, #4a3d6e 50%, #6b5b8c 100%)',
  },
  {
    id: 'bg_meadow',
    category: 'background',
    name: '草原',
    description: 'きみどりの気持ちいい背景',
    price: 10,
    emoji: '🌿',
    gradient: 'linear-gradient(180deg, #e8f5e0 0%, #f5fff0 100%)',
  },
  {
    id: 'acc_ribbon',
    category: 'accessory',
    name: 'リボン',
    description: '頭上にふわっとリボン',
    price: 5,
    emoji: '🎀',
  },
  {
    id: 'acc_star',
    category: 'accessory',
    name: 'きらきら星',
    description: 'キラッとアクセント',
    price: 6,
    emoji: '⭐',
  },
  {
    id: 'acc_flower',
    category: 'accessory',
    name: 'お花',
    description: '春っぽいワンポイント',
    price: 5,
    emoji: '🌸',
  },
  {
    id: 'acc_heart',
    category: 'accessory',
    name: 'ハート',
    description: 'ラブ注入',
    price: 4,
    emoji: '💕',
  },
  {
    id: 'acc_crown',
    category: 'accessory',
    name: 'ミニ王冠',
    description: 'ちょっと高貴に',
    price: 15,
    emoji: '👑',
  },
];

export function getShopItem(id) {
  return SHOP_ITEMS.find((item) => item.id === id);
}
