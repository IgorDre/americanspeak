import type { QueueEntry } from "@/types";

export type RatingKey = "again" | "good" | "easy";

const MS = {
  minute: 60_000,
  day:    86_400_000,
} as const;

/**
 * Temporary FSRS-compatible scheduling (no ts-fsrs yet).
 *
 * Again → due + 5 min,  state = 1 (Learning),  lapses + 1
 * Good  → due + 3 days, state = 2 (Review),     reps   + 1
 * Easy  → due + 7 days, state = 2 (Review),     reps   + 1
 */
export function applyRating(entry: QueueEntry, rating: RatingKey): QueueEntry {
  const now        = new Date();
  const lastReview = now.toISOString();

  switch (rating) {
    case "again":
      return {
        ...entry,
        lastReview,
        state:         1,
        due:           new Date(now.getTime() + 5 * MS.minute).toISOString(),
        lapses:        entry.lapses + 1,
        scheduledDays: 0,
      };
    case "good":
      return {
        ...entry,
        lastReview,
        state:         2,
        due:           new Date(now.getTime() + 3 * MS.day).toISOString(),
        reps:          entry.reps + 1,
        scheduledDays: 3,
      };
    case "easy":
      return {
        ...entry,
        lastReview,
        state:         2,
        due:           new Date(now.getTime() + 7 * MS.day).toISOString(),
        reps:          entry.reps + 1,
        scheduledDays: 7,
      };
  }
}
