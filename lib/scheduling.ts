import { fsrs, generatorParameters, Rating, type Card } from "ts-fsrs";
import type { QueueEntry } from "@/types";

export type RatingKey = "again" | "good" | "easy";

const f = fsrs(generatorParameters({ enable_fuzz: true }));

const RATING_MAP = {
  again: Rating.Again,
  good:  Rating.Good,
  easy:  Rating.Easy,
} as const satisfies Record<RatingKey, Rating>;

/** Convert a stored QueueEntry back into a ts-fsrs Card. */
function entryToCard(entry: QueueEntry): Card {
  return {
    due:            new Date(entry.due),
    stability:      entry.stability,
    difficulty:     entry.difficulty,
    elapsed_days:   entry.elapsedDays,
    scheduled_days: entry.scheduledDays,
    learning_steps: 0,
    reps:           entry.reps,
    lapses:         entry.lapses,
    state:          entry.state as Card["state"],
    last_review:    entry.lastReview ? new Date(entry.lastReview) : undefined,
  };
}

/** Merge the scheduled ts-fsrs Card back into a QueueEntry. */
function cardToEntry(card: Card, base: QueueEntry): QueueEntry {
  return {
    ...base,
    state:         card.state,
    due:           card.due.toISOString(),
    stability:     card.stability,
    difficulty:    card.difficulty,
    reps:          card.reps,
    lapses:        card.lapses,
    elapsedDays:   card.elapsed_days,
    scheduledDays: card.scheduled_days,
    lastReview:    card.last_review ? card.last_review.toISOString() : null,
  };
}

/**
 * Apply an FSRS rating to a queue entry and return the updated entry.
 *
 * again → Rating.Again  (state=Learning, short interval)
 * good  → Rating.Good   (standard FSRS interval)
 * easy  → Rating.Easy   (larger FSRS interval)
 */
export function applyRating(entry: QueueEntry, rating: RatingKey): QueueEntry {
  const card      = entryToCard(entry);
  const preview   = f.repeat(card, new Date());
  const scheduled = preview[RATING_MAP[rating]].card;
  return cardToEntry(scheduled, entry);
}
