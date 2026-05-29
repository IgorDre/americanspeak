'use client';
import { useState, useEffect, useCallback } from 'react';

export type PhraseStatusType = 'new' | 'learning' | 'skipped' | 'hidden';

export type PhraseState = {
  status: PhraseStatusType;
  learnCount: number;       // how many times Learn was pressed
  updatedAt: number;        // timestamp of last action
  skippedUntil?: number;    // timestamp when phrase returns to feed (Skip = now + 30 days)
};

type StatesMap = Record<string, PhraseState>;

const STORAGE_KEY = 'amerispeak_states';
const SKIP_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function loadStates(): StatesMap {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveStates(states: StatesMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

export function usePhraseStates() {
  const [states, setStates] = useState<StatesMap>({});

  useEffect(() => {
    setStates(loadStates());
  }, []);

  const getState = useCallback((id: string): PhraseState => {
    return states[id] ?? { status: 'new', learnCount: 0, updatedAt: 0 };
  }, [states]);

  const learn = useCallback((id: string) => {
    setStates(prev => {
      const current = prev[id] ?? { status: 'new', learnCount: 0, updatedAt: 0 };
      const next: StatesMap = {
        ...prev,
        [id]: {
          status: 'learning',
          learnCount: current.learnCount + 1,
          updatedAt: Date.now(),
        },
      };
      saveStates(next);
      return next;
    });
  }, []);

  const skip = useCallback((id: string) => {
    setStates(prev => {
      const next: StatesMap = {
        ...prev,
        [id]: {
          status: 'skipped',
          learnCount: prev[id]?.learnCount ?? 0,
          updatedAt: Date.now(),
          skippedUntil: Date.now() + SKIP_DURATION_MS,
        },
      };
      saveStates(next);
      return next;
    });
  }, []);

  const hide = useCallback((id: string) => {
    setStates(prev => {
      const next: StatesMap = {
        ...prev,
        [id]: {
          status: 'hidden',
          learnCount: prev[id]?.learnCount ?? 0,
          updatedAt: Date.now(),
        },
      };
      saveStates(next);
      return next;
    });
  }, []);

  const restore = useCallback((id: string) => {
    setStates(prev => {
      const next: StatesMap = {
        ...prev,
        [id]: {
          status: 'new',
          learnCount: 0,
          updatedAt: Date.now(),
        },
      };
      saveStates(next);
      return next;
    });
  }, []);

  // Returns true if phrase should appear in Discover feed
  const isVisibleInFeed = useCallback((id: string): boolean => {
    const s = states[id];
    if (!s) return true;                           // new — always show
    if (s.status === 'hidden') return false;       // hidden — never show
    if (s.status === 'skipped') {
      return Date.now() > (s.skippedUntil ?? 0);  // skipped — show after 30d
    }
    return true;                                   // learning — always show (with badge)
  }, [states]);

  return { states, getState, learn, skip, hide, restore, isVisibleInFeed };
}
