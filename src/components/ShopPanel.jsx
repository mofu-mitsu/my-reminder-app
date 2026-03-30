import React, { useMemo, useState } from 'react';
import { SHOP_ITEMS } from '../data/shopCatalog';
import {
  purchaseShopItem,
  equipShopBackground,
  equipShopAccessory,
} from '../services/supabase';
import { normalizeShopState } from '../utils/petShopState';

export function ShopPanel({ pet, onUpdated }) {
  const [busyId, setBusyId] = useState('');
  const [status, setStatus] = useState('');

  const shopState = useMemo(
    () => normalizeShopState(pet?.accessories),
    [pet?.accessories],
  );
  const points = pet?.growth_points ?? 0;
  const backgrounds = SHOP_ITEMS.filter((item) => item.category === 'background');
  const accessories = SHOP_ITEMS.filter((item) => item.category === 'accessory');

  if (!pet) {
    return <p>ペット情報を読み込み中…</p>;
  }

  const handleBuy = async (itemId) => {
    setBusyId(itemId);
    setStatus('');
    try {
      await purchaseShopItem(pet.id, itemId);
      await onUpdated?.();
      setStatus('購入できたよ！');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusyId('');
    }
  };

  const handleEquipBackground = async (itemId) => {
    setBusyId(itemId);
    setStatus('');
    try {
      await equipShopBackground(pet.id, itemId);
      await onUpdated?.();
      setStatus('背景を変更したよ！');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusyId('');
    }
  };

  const handleEquipAccessory = async (itemId) => {
    setBusyId(itemId || 'unequip');
    setStatus('');
    try {
      await equipShopAccessory(pet.id, itemId);
      await onUpdated?.();
      setStatus(itemId ? 'アクセサリー装備！' : 'アクセサリーを外したよ');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="shop-panel">
      <h3>ショップ 🛍️</h3>
      <p className="shop-point">所持ポイント: {points}pt</p>

      <section>
        <h4>背景</h4>
        <div className="shop-grid">
          {backgrounds.map((item) => {
            const owned = shopState.owned.includes(item.id);
            const equipped = shopState.background === item.id;
            return (
              <article key={item.id} className="shop-card">
                <div className="shop-thumb">{item.emoji}</div>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <small>{item.price}pt</small>
                {!owned ? (
                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={busyId === item.id}
                    className="shop-btn"
                  >
                    購入
                  </button>
                ) : (
                  <button
                    onClick={() => handleEquipBackground(item.id)}
                    disabled={busyId === item.id || equipped}
                    className="shop-btn"
                  >
                    {equipped ? '装備中' : '背景に設定'}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h4>アクセサリー</h4>
        <div className="shop-grid">
          {accessories.map((item) => {
            const owned = shopState.owned.includes(item.id);
            const equipped = shopState.equippedAccessory === item.id;
            return (
              <article key={item.id} className="shop-card">
                <div className="shop-thumb">{item.emoji}</div>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <small>{item.price}pt</small>
                {!owned ? (
                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={busyId === item.id}
                    className="shop-btn"
                  >
                    購入
                  </button>
                ) : (
                  <button
                    onClick={() => handleEquipAccessory(item.id)}
                    disabled={busyId === item.id || equipped}
                    className="shop-btn"
                  >
                    {equipped ? '装備中' : '装備する'}
                  </button>
                )}
              </article>
            );
          })}
        </div>
        <button
          onClick={() => handleEquipAccessory(null)}
          disabled={busyId === 'unequip' || !shopState.equippedAccessory}
          className="shop-btn shop-btn-secondary"
        >
          アクセを外す
        </button>
      </section>

      {status && <p className="shop-status">{status}</p>}
    </div>
  );
}
