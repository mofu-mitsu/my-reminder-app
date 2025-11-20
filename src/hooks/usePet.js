import { useState, useEffect } from 'react';
import { getPet, createInitialPet } from '../services/supabase';

export function usePet(userId) {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (!userId) {
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
    };

    fetchPet();
  }, [userId]);

  return { pet, loading, error };
}