'use client';
import { useState, useEffect, useCallback } from 'react';
import { getStats, updateStreak } from '@/lib/storage';

/**
 * Live daily-streak counter backed by the shared `as_streak` localStorage entry.
 *
 * `streak` reads the current count on mount; `increment` bumps the streak for
 * today (idempotent per day — see `updateStreak`) and reflects the new value.
 */
export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStats().streak);
  }, []);

  const increment = useCallback(() => {
    setStreak(updateStreak());
  }, []);

  return { streak, increment };
}
