import { useState, useEffect } from 'react';
import { getReminders, supabase } from '../services/supabase';

export function useReminders(userId) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReminders = async () => {
    if (!userId) {
      setReminders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getReminders(userId);
      setReminders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
    
    // リアルタイムリスナーを設定（Supabaseの変更を監視）
    const channel = supabase
      .channel('reminders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reminders' }, (payload) => {
        // 変更があったらリマインダーを再取得
        fetchReminders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { reminders, loading, error, fetchReminders };
}