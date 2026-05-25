import type { QueueEntry } from "@/types";

// ─── Storage keys ────────────────────────────────────────────────────────────

const KEYS = {
  saved:   "as_favorites",
  queue:   "as_queue",
  streak:  "as_streak",
  learned: "as_learned",
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private browsing — fail silently
  }
}

// ─── Saved phrases ───────────────────────────────────────────────────────────

export function getSavedPhraseIds(): string[] {
  return load<string[]>(KEYS.saved, []);
}

/** Toggles the phrase and returns `true` if it is now saved. */
export function toggleSavedPhrase(id: string): boolean {
  const saved = getSavedPhraseIds();
  const idx = saved.indexOf(id);
  const nowSaved = idx === -1;
  if (nowSaved) {
    persist(KEYS.saved, [...saved, id]);
  } else {
    persist(KEYS.saved, saved.filter((s) => s !== id));
  }
  return nowSaved;
}

export function isPhraseSaved(id: string): boolean {
  return getSavedPhraseIds().includes(id);
}

// ─── Study queue ─────────────────────────────────────────────────────────────

export function getQueue(): Record<string, QueueEntry> {
  return load<Record<string, QueueEntry>>(KEYS.queue, {});
}

/** Adds a phrase to the queue as a brand-new FSRS card (state = 0 = New). */
export function addToQueue(phraseId: string): void {
  const queue = getQueue();
  if (phraseId in queue) return;
  const now = new Date().toISOString();
  const entry: QueueEntry = {
    phraseId,
    addedAt: now,
    state: 0,
    due: now,
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    lastReview: null,
  };
  persist(KEYS.queue, { ...queue, [phraseId]: entry });
}

export function removeFromQueue(phraseId: string): void {
  const queue = getQueue();
  const updated = { ...queue };
  delete updated[phraseId];
  persist(KEYS.queue, updated);
}

export function isInQueue(phraseId: string): boolean {
  return phraseId in getQueue();
}

/** Merges partial updates into an existing queue entry. No-op if entry doesn't exist. */
export function updateQueueEntry(
  phraseId: string,
  updates: Partial<Omit<QueueEntry, "phraseId" | "addedAt">>,
): void {
  const queue = getQueue();
  const existing = queue[phraseId];
  if (!existing) return;
  persist(KEYS.queue, { ...queue, [phraseId]: { ...existing, ...updates } });
}

// ─── Streak ───────────────────────────────────────────────────────────────────

interface StreakData {
  count: number;
  lastDate: string;
}

function getStreakData(): StreakData {
  return load<StreakData>(KEYS.streak, { count: 0, lastDate: "" });
}

/**
 * Bumps the streak if today hasn't been counted yet.
 * Resets to 1 if last activity wasn't yesterday.
 * Returns the current streak count.
 */
export function updateStreak(): number {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();
  const data      = getStreakData();
  if (data.lastDate === today) return data.count;
  const count = data.lastDate === yesterday ? data.count + 1 : 1;
  persist(KEYS.streak, { count, lastDate: today });
  return count;
}

// ─── Learned count ───────────────────────────────────────────────────────────

export function getLearnedCount(): number {
  return load<number>(KEYS.learned, 0);
}

export function incrementLearned(): void {
  persist(KEYS.learned, getLearnedCount() + 1);
}

// ─── Combined stats ──────────────────────────────────────────────────────────

export interface AppStats {
  learned:   number;
  streak:    number;
  queueSize: number;
}

export function getStats(): AppStats {
  return {
    learned:   getLearnedCount(),
    streak:    getStreakData().count,
    queueSize: Object.keys(getQueue()).length,
  };
}
