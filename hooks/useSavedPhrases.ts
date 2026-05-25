"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getSavedPhraseIds,
  toggleSavedPhrase,
  isPhraseSaved,
} from "@/lib/storage";

export interface UseSavedPhrasesReturn {
  savedIds:    string[];
  loading:     boolean;
  toggle:      (id: string) => boolean;
  isSaved:     (id: string) => boolean;
}

export function useSavedPhrases(): UseSavedPhrasesReturn {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setSavedIds(getSavedPhraseIds());
    setLoading(false);
  }, []);

  const toggle = useCallback((id: string): boolean => {
    const nowSaved = toggleSavedPhrase(id);
    setSavedIds(getSavedPhraseIds());
    return nowSaved;
  }, []);

  const isSaved = useCallback(
    (id: string): boolean => {
      if (loading) return false;
      return isPhraseSaved(id);
    },
    [loading],
  );

  return { savedIds, loading, toggle, isSaved };
}
