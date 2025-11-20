import { useState, useEffect, useCallback } from 'react';
import { getPet, createInitialPet } from '../services/supabase';

export function usePet(userId) {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPet = useCallback(async () => {
    if (!userId) {
      setPet(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let petData = await getPet(userId);
      
      // If no pet exists, create an initial one
      if (!petData) {
        petData = await createInitialPet(userId);
      }
      
      setPet(petData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);

  return { pet, loading, error, refreshPet: fetchPet };
}