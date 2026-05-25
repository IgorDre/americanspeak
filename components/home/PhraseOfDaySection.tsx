import { SectionLabel } from "@/components/home/SectionLabel";
import { PhraseCard } from "@/components/phrase";
import type { Phrase } from "@/types";

export interface PhraseOfDaySectionProps {
  phrase: Phrase;
  isQueued?: boolean;
  isSaved?: boolean;
  onAddToQueue?: (phraseId: string) => void;
  onRemoveFromQueue?: (phraseId: string) => void;
  onToggleSave?: (phraseId: string) => void;
}

export function PhraseOfDaySection({
  phrase,
  isQueued,
  isSaved,
  onAddToQueue,
  onRemoveFromQueue,
  onToggleSave,
}: PhraseOfDaySectionProps) {
  return (
    <section aria-labelledby="phrase-of-day-label">
      <SectionLabel id="phrase-of-day-label">Phrase of the Day</SectionLabel>
      <PhraseCard
        phrase={phrase}
        isQueued={isQueued}
        isSaved={isSaved}
        onAddToQueue={onAddToQueue}
        onRemoveFromQueue={onRemoveFromQueue}
        onToggleSave={onToggleSave}
      />
    </section>
  );
}
