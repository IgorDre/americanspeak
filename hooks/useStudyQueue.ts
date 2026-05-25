"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getQueue,
  addToQueue,
  removeFromQueue,
  isInQueue,
  updateQueueEntry,
} from "@/lib/storage";
import type { QueueEntry } from "@/types";

export interface UseStudyQueueReturn {
  queue:    Record<string, QueueEntry>;
  loading:  boolean;
  add:      (phraseId: string) => void;
  remove:   (phraseId: string) => void;
  update:   (phraseId: string, updates: Partial<Omit<QueueEntry, "phraseId" | "addedAt">>) => void;
  inQueue:  (phraseId: string) => boolean;
  size:     number;
}

export function useStudyQueue(): UseStudyQueueReturn {
  const [queue,   setQueue]   = useState<Record<string, QueueEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQueue(getQueue());
    setLoading(false);
  }, []);

  const add = useCallback((phraseId: string): void => {
    addToQueue(phraseId);
    setQueue(getQueue());
  }, []);

  const remove = useCallback((phraseId: string): void => {
    removeFromQueue(phraseId);
    setQueue(getQueue());
  }, []);

  const update = useCallback(
    (phraseId: string, updates: Partial<Omit<QueueEntry, "phraseId" | "addedAt">>): void => {
      updateQueueEntry(phraseId, updates);
      setQueue(getQueue());
    },
    [],
  );

  const inQueue = useCallback(
    (phraseId: string): boolean => {
      if (loading) return false;
      return isInQueue(phraseId);
    },
    [loading],
  );

  return {
    queue,
    loading,
    add,
    remove,
    update,
    inQueue,
    size: Object.keys(queue).length,
  };
}
