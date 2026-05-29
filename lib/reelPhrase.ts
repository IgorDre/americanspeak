/**
 * Adapter: maps the app's existing `Phrase` data onto a cinematic Reel view-model.
 *
 * No new phrase data is introduced — this derives the accent word, scenario
 * context, colored tone pills, category label, and a stable "likes" count from
 * the fields already present on `Phrase` + `MOCK_CATEGORIES`.
 */

import { MOCK_CATEGORIES } from "@/data";
import { Register } from "@/types/enums";
import type { Phrase } from "@/types";

export type ReelTagColor = "amber" | "red" | "green" | "blue" | "purple";

export interface ReelTag {
  label: string;
  color: ReelTagColor;
}

export interface ReelPhrase {
  id: string;
  text: string;
  accentWord: string;
  phonetic: string;
  context: string;
  category: string;
  tags: ReelTag[];
  likes: number;
  /** Deterministic gradient seed used to render the cinematic background. */
  hue: number;
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "it", "it's", "im", "i'm", "i", "you", "your", "you're",
  "for", "to", "of", "on", "in", "at", "and", "but", "or", "so", "no", "not",
  "me", "my", "we", "be", "do", "got", "that", "this", "with", "as", "even",
  "okay", "ok", "just", "how's", "long",
]);

const TONE_COLOR: Record<string, ReelTagColor> = {
  excited: "red",
  warm: "green",
  knowing: "blue",
  frustrated: "red",
  sarcastic: "purple",
  awkward: "blue",
};

const REGISTER_TAG: Record<Register, ReelTag> = {
  [Register.CASUAL]: { label: "Casual", color: "amber" },
  [Register.NEUTRAL]: { label: "Neutral", color: "blue" },
  [Register.FORMAL]: { label: "Professional", color: "blue" },
};

function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}

/** Pick the most "meaningful" word in the phrase to highlight in the accent color. */
function pickAccentWord(term: string): string {
  const words = term.split(/\s+/).filter(Boolean);
  if (words.length === 0) return term;

  const candidates = words.filter((word) => {
    const clean = word.toLowerCase().replace(/[^a-z']/g, "");
    return clean.length > 0 && !STOPWORDS.has(clean);
  });

  const pool = candidates.length > 0 ? candidates : words;
  return pool.reduce((longest, word) =>
    word.replace(/[^a-zA-Z']/g, "").length > longest.replace(/[^a-zA-Z']/g, "").length
      ? word
      : longest,
  );
}

/** Stable hash so likes/hue stay constant across renders for the same phrase. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildContext(phrase: Phrase): string {
  if (phrase.visualScene && phrase.visualScene.trim().length > 0) {
    const scene = capitalize(phrase.visualScene.trim());
    return scene.endsWith(".") ? scene : `${scene}.`;
  }
  return phrase.definition;
}

function buildCategoryLabel(phrase: Phrase): string {
  const category = MOCK_CATEGORIES.find((cat) => cat.id === phrase.categoryId);
  if (!category) return "Everyday";
  if (phrase.socialContext) {
    return `${category.name} · ${capitalize(phrase.socialContext)}`;
  }
  return category.name;
}

function buildTags(phrase: Phrase): ReelTag[] {
  const tags: ReelTag[] = [];

  const registerTag = REGISTER_TAG[phrase.register as Register];
  if (registerTag) tags.push(registerTag);

  if (phrase.emotionalTone) {
    tags.push({
      label: capitalize(phrase.emotionalTone),
      color: TONE_COLOR[phrase.emotionalTone] ?? "purple",
    });
  }

  if (phrase.socialContext) {
    tags.push({ label: capitalize(phrase.socialContext), color: "green" });
  } else if (phrase.tags[0]) {
    tags.push({ label: capitalize(phrase.tags[0]), color: "green" });
  }

  // De-dupe by label, cap at 3 for a clean cinematic row.
  const seen = new Set<string>();
  return tags
    .filter((tag) => {
      const key = tag.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
}

export function toReelPhrase(phrase: Phrase): ReelPhrase {
  const hash = hashString(phrase.id);
  return {
    id: phrase.id,
    text: phrase.term,
    accentWord: pickAccentWord(phrase.term),
    phonetic: phrase.pronunciation,
    context: buildContext(phrase),
    category: buildCategoryLabel(phrase),
    tags: buildTags(phrase),
    likes: 800 + (hash % 8200),
    hue: hash % 360,
  };
}
