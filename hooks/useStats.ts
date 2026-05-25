"use client";

import { useCallback, useEffect, useState } from "react";
import { getStats, type AppStats } from "@/lib/storage";

export interface UseStatsReturn {
  stats:   AppStats;
  loading: boolean;
  refresh: () => void;
}

const DEFAULT_STATS: AppStats = { learned: 0, streak: 0, queueSize: 0 };

export function useStats(): UseStatsReturn {
  const [stats,   setStats]   = useState<AppStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback((): void => {
    setStats(getStats());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  return { stats, loading, refresh };
}
