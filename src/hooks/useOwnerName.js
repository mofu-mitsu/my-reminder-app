import { useState, useCallback } from 'react';

const STORAGE_KEY = 'petOwnerName';

function readInitialName() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STORAGE_KEY) ?? '';
}

export function useOwnerName() {
  const [ownerName, setOwnerName] = useState(readInitialName);

  const updateOwnerName = useCallback((nextName) => {
    const value = nextName?.trim() ?? '';
    setOwnerName(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  }, []);

  return { ownerName, updateOwnerName };
}

