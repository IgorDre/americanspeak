"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PhraseCard } from "@/components/phrase/PhraseCard";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ScreenContainer, BOTTOM_NAV_HEIGHT } from "@/components/layout/ScreenContainer";
import { MOCK_PHRASES } from "@/data";
import { useSavedPhrases } from "@/hooks/useSavedPhrases";
import { useStudyQueue } from "@/hooks/useStudyQueue";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";

export function SavedScreen() {
  const { savedIds, toggle: toggleSave, isSaved, loading: savedLoading } = useSavedPhrases();
  const { add, remove, inQueue, loading: queueLoading } = useStudyQueue();

  const loading = savedLoading || queueLoading;

  const savedPhrases = useMemo(
    () => MOCK_PHRASES.filter((p) => savedIds.includes(p.id)),
    [savedIds],
  );

  return (
    <>
      <main
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          overflowY: "auto",
          paddingBottom: `calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <ScreenContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing[4] }}>

            {/* ── Header ──────────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing[3],
              }}
            >
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: typography.fontSize.phraseLg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text,
                    fontFamily: typography.fontFamily.sans,
                  }}
                >
                  Saved Phrases
                </h1>
              </div>

              {savedPhrases.length > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "2rem",
                    paddingInline: spacing[2],
                    height: "1.5rem",
                    borderRadius: radius.pill,
                    backgroundColor: colors.accent,
                    color: colors.text,
                    fontSize: typography.fontSize.badge,
                    fontWeight: typography.fontWeight.semibold,
                    fontFamily: typography.fontFamily.sans,
                    lineHeight: 1,
                  }}
                  aria-label={`${savedPhrases.length} saved`}
                >
                  {savedPhrases.length}
                </span>
              )}
            </div>

            {/* ── Content ─────────────────────────────────────────────── */}
            {loading ? null : savedPhrases.length === 0 ? (
              <EmptyState />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: spacing[4] }}>
                {savedPhrases.map((phrase) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    isQueued={inQueue(phrase.id)}
                    isSaved={isSaved(phrase.id)}
                    onAddToQueue={add}
                    onRemoveFromQueue={remove}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            )}

          </div>
        </ScreenContainer>
      </main>
      <BottomNavigation />
    </>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing[4],
        paddingBlock: spacing[8],
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "3rem", lineHeight: 1 }} aria-hidden="true">
        🤍
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
        <p
          style={{
            margin: 0,
            fontSize: typography.fontSize.bodyLg,
            fontWeight: typography.fontWeight.medium,
            color: colors.text,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          No saved phrases yet
        </p>
        <p
          style={{
            margin: 0,
            fontSize: typography.fontSize.body,
            color: colors.muted,
            fontFamily: typography.fontFamily.sans,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          Tap the ♡ on any phrase to save it here.
        </p>
      </div>
      <Link
        href="/browse"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: tapTargetMin,
          paddingInline: spacing[6],
          borderRadius: radius.pill,
          backgroundColor: colors.accent,
          color: colors.text,
          fontSize: typography.fontSize.body,
          fontWeight: typography.fontWeight.medium,
          fontFamily: typography.fontFamily.sans,
          textDecoration: "none",
        }}
      >
        Browse phrases
      </Link>
    </div>
  );
}
