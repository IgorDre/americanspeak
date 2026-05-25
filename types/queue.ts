/** User-facing phrase learning state (localStorage summary). */
export type PhraseState = "new" | "learning" | "review" | "mastered";

/**
 * Learning queue entry — localStorage SRS state.
 * FSRS state: 0=New, 1=Learning, 2=Review, 3=Relearning
 */
export interface QueueEntry {
  phraseId: string;
  addedAt: string;
  state: number;
  due: string;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  elapsedDays: number;
  scheduledDays: number;
  lastReview: string | null;
}
