import { useState, useEffect } from 'react';
import { getPet, createInitialPet } from '../services/supabase';

export function usePet(userId) {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      setPet(null);
      setLoading(false);
      return;
    }

    const fetchPet = async () => {
      setLoading(true);
      setError(null);
      try {
        let currentPet = await getPet(userId);
        
          // ペットがいなければ初期ペットを作成
          currentPet = await createInitialPet(userId);
        }
        
        setPet(currentPet);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [userId]);

  return { pet, loading, error };
}

