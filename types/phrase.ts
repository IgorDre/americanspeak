import type { Category } from "./category";
import type { PhraseRelation } from "./phrase-relation";
import { Frequency, Register } from "./enums";

/** Phrase content type — matches Prisma `type` field comment. */
export type PhraseType =
  | "phrase"
  | "idiom"
  | "phrasal_verb"
  | "expression"
  | "word";

/** Matches Prisma Phrase model. */
export interface Phrase {
  id: string;
  term: string;
  type: PhraseType | string;
  definition: string;
  example1: string;
  example2: string | null;
  example3: string | null;
  pronunciation: string;
  register: Register;
  frequency: Frequency;
  difficulty: number;
  tags: string[];
  situations: string[];
  categoryId: string;
  createdAt: Date | string;
  category?: Category;
  relationsFrom?: PhraseRelation[];
  relationsTo?: PhraseRelation[];
  emotionalTone?: string;
  socialContext?: string;
  visualScene?: string;
  naturalSpeedNotes?: string;
}
