"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { MOCK_PHRASES } from "@/data";
import { useSavedPhrases } from "@/hooks/useSavedPhrases";
import { useStats } from "@/hooks/useStats";
import { useStudyQueue } from "@/hooks/useStudyQueue";
import { BottomNavigation } from "@/components/layout";
import { BOTTOM_NAV_HEIGHT } from "@/components/layout/ScreenContainer";
import { HomeHeader } from "@/components/home/HomeHeader";
import { PhraseOfDaySection } from "@/components/home/PhraseOfDaySection";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";
import type { Phrase } from "@/types";

function pickRandom(current: Phrase): Phrase {
  if (MOCK_PHRASES.length <= 1) return current;
  const others = MOCK_PHRASES.filter((p) => p.id !== current.id);
  return others[Math.floor(Math.random() * others.length)];
}

export function HomeScreen() {
  const [phrase, setPhrase] = useState<Phrase>(MOCK_PHRASES[0]);

  const saved  = useSavedPhrases();
  const queue  = useStudyQueue();
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

  // Keep random phrase accessible via a subtle tap on the phrase card label area
  const _handleRandomPhrase = useCallback(() => {
    setPhrase((current) => pickRandom(current));
  }, []);

  return (
    <>
      {/* Full-screen no-scroll layout */}
      <div
        style={{
          height:          "100dvh",
          display:         "flex",
          flexDirection:   "column",
          overflow:        "hidden",
          backgroundColor: colors.bg,
          paddingBottom:   `calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px))`,
          maxWidth:        "32rem",
          marginInline:    "auto",
          width:           "100%",
        }}
      >
        {/* Compact header */}
        <HomeHeader streakDays={stats.streak} />

        {/* Immersive phrase hero — fills remaining space */}
        <PhraseOfDaySection
          phrase={phrase}
          isQueued={queue.inQueue(phrase.id)}
          isSaved={saved.isSaved(phrase.id)}
          onAddToQueue={handleAddToQueue}
          onRemoveFromQueue={handleRemoveFromQueue}
          onToggleSave={handleToggleSave}
        />

        {/* Single primary CTA */}
        <div
          style={{
            paddingInline: spacing[4],
            paddingTop:    spacing[3],
            paddingBottom: spacing[3],
            flexShrink:    0,
          }}
        >
          <Link
            href="/study"
            style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             spacing[2],
              minHeight:       `${tapTargetMin}px`,
              width:           "100%",
              borderRadius:    radius.pill,
              backgroundColor: colors.accent,
              color:           colors.text,
              textDecoration:  "none",
              fontSize:        typography.fontSize.bodyLg,
              fontWeight:      typography.fontWeight.semibold,
              fontFamily:      typography.fontFamily.sans,
              letterSpacing:   "0.01em",
              transition:      "opacity 150ms ease",
            }}
          >
            <span aria-hidden="true">▶</span>
            <span>Start Studying</span>
          </Link>
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <BottomNavigation />
    </>
  );
}
