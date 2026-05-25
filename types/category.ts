import type { Phrase } from "./phrase";

/** Matches Prisma Category model. */
export interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  sortOrder: number;
  phrases?: Phrase[];
}
