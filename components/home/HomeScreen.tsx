"use client";

import { useCallback, useState } from "react";
import { MOCK_PHRASES } from "@/data";
import { useSavedPhrases } from "@/hooks/useSavedPhrases";
import { useStats } from "@/hooks/useStats";
import { useStudyQueue } from "@/hooks/useStudyQueue";
import { BottomNavigation, ScreenContainer } from "@/components/layout";
import { HomeHeader } from "@/components/home/HomeHeader";
import { MiniStatsRow } from "@/components/home/MiniStatsRow";
import { PhraseOfDaySection } from "@/components/home/PhraseOfDaySection";
import { QuickActionsRow } from "@/components/home/QuickActionsRow";
import { colors, spacing } from "@/styles/theme";
import type { Phrase } from "@/types";

function pickRandom(current: Phrase): Phrase {
  if (MOCK_PHRASES.length <= 1) return current;
  const others = MOCK_PHRASES.filter((p) => p.id !== current.id);
  return others[Math.floor(Math.random() * others.length)];
}

export function HomeScreen() {
  const [phrase, setPhrase] = useState<Phrase>(MOCK_PHRASES[0]);

  const saved = useSavedPhrases();
  const queue = useStudyQueue();
  const { stats, refresh: refreshStats } = useStats();

  const handleToggleSave = useCallback(
    (phraseId: string) => {
      saved.toggle(phraseId);
      refreshStats();
    },
    [saved, refreshStats],
  );

  const handleAddToQueue = useCallback(
    (phraseId: string) => {
      queue.add(phraseId);
      refreshStats();
    },
    [queue, refreshStats],
  );

  const handleRemoveFromQueue = useCallback(
    (phraseId: string) => {
      queue.remove(phraseId);
      refreshStats();
    },
    [queue, refreshStats],
  );

  const handleRandomPhrase = useCallback(() => {
    setPhrase((current) => pickRandom(current));
  }, []);

  return (
    <>
      <main style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenContainer withBottomNav>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing[6],
            }}
          >
            <HomeHeader streakDays={stats.streak} />

            <PhraseOfDaySection
              phrase={phrase}
              isQueued={queue.inQueue(phrase.id)}
              isSaved={saved.isSaved(phrase.id)}
              onAddToQueue={handleAddToQueue}
              onRemoveFromQueue={handleRemoveFromQueue}
              onToggleSave={handleToggleSave}
            />

            <QuickActionsRow onRandomPhrase={handleRandomPhrase} />

            <MiniStatsRow
              phrasesLearned={stats.learned}
              streakDays={stats.streak}
              queueCount={stats.queueSize}
            />
          </div>
        </ScreenContainer>
      </main>
      <BottomNavigation />
    </>
  );
}
