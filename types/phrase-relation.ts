import type { Phrase } from "./phrase";

/** PhraseRelation type — matches Prisma `type` field comment. */
export type PhraseRelationType =
  | "related"
  | "synonym"
  | "same_topic"
  | "commonly_paired";

/** Matches Prisma PhraseRelation model. */
export interface PhraseRelation {
  id: string;
  fromPhraseId: string;
  toPhraseId: string;
  type: PhraseRelationType | string;
  strength: number;
  fromPhrase?: Phrase;
  toPhrase?: Phrase;
}
