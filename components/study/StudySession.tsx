"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { StudySessionCard } from "@/components/study/StudySessionCard";
import { EmptyQueueState } from "@/components/study/EmptyQueueState";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ScreenContainer, BOTTOM_NAV_HEIGHT } from "@/components/layout/ScreenContainer";
import { MOCK_PHRASES } from "@/data";
import { useStudyQueue } from "@/hooks/useStudyQueue";
import { applyRating, type RatingKey } from "@/lib/scheduling";
import { incrementLearned, updateStreak } from "@/lib/storage";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";
import type { Phrase } from "@/types";

// ─── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: typography.fontSize.label,
          color: colors.muted,
          fontFamily: typography.fontFamily.sans,
        }}
      >
        <span>Session</span>
        <span>{done} / {total}</span>
      </div>
      <div
        style={{
          height: "4px",
          borderRadius: radius.pill,
          backgroundColor: colors.elevated,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: radius.pill,
            backgroundColor: colors.accent,
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Completion screen ────────────────────────────────────────────────────────

function CompletionScreen({ reviewedCount }: { reviewedCount: number }) {
  const label = reviewedCount === 1 ? "1 phrase" : `${reviewedCount} phrases`;

  return (
    <div
      className="as-card-enter"
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        textAlign:      "center",
        gap:            spacing[6],
        padding:        spacing[8],
        flex:           1,
      }}
    >
      <span style={{ fontSize: "4rem", lineHeight: 1 }} aria-hidden="true">🎉</span>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
        <h2
          style={{
            margin:     0,
            fontSize:   typography.fontSize.phraseLg,
            fontWeight: typography.fontWeight.semibold,
            color:      colors.text,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          Nice work today!
        </h2>
        <p
          style={{
            margin:     0,
            fontSize:   typography.fontSize.body,
            lineHeight: typography.lineHeight.relaxed,
            color:      colors.muted,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          You reviewed <strong style={{ color: colors.accent }}>{label}</strong> this session.
        </p>
      </div>

      <Link
        href="/"
        style={{
          display:         "inline-flex",
          alignItems:      "center",
          justifyContent:  "center",
          minHeight:       tapTargetMin,
          paddingInline:   spacing[8],
          borderRadius:    radius.pill,
          backgroundColor: colors.accent,
          color:           colors.text,
          textDecoration:  "none",
          fontSize:        typography.fontSize.body,
          fontWeight:      typography.fontWeight.semibold,
          fontFamily:      typography.fontFamily.sans,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}

// ─── StudySession ─────────────────────────────────────────────────────────────

export function StudySession() {
  const { queue, loading, update } = useStudyQueue();

  // Capture the session phrase list once after the queue loads.
  // We use a stable list so adding/removing phrases mid-session doesn't jump.
  const sessionPhrases = useMemo<Phrase[]>(() => {
    if (loading) return [];
    return Object.keys(queue)
      .map((id) => MOCK_PHRASES.find((p) => p.id === id))
      .filter((p): p is Phrase => p !== undefined);
    // intentionally run once when loading flips to false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const [index,         setIndex]   = useState(0);
  const [reviewedCount, setReviewed] = useState(0);
  const [done,          setDone]    = useState(false);

  const handleRate = useCallback(
    (rating: RatingKey) => {
      const phrase = sessionPhrases[index];
      if (!phrase) return;

      const entry = queue[phrase.id];
      if (entry) {
        const updated = applyRating(entry, rating);
        update(phrase.id, updated);
      }

      if (rating !== "again") {
        incrementLearned();
      }
      updateStreak();

      const nextReviewed = reviewedCount + 1;
      setReviewed(nextReviewed);

      const nextIndex = index + 1;
      if (nextIndex >= sessionPhrases.length) {
        setDone(true);
      } else {
        setIndex(nextIndex);
      }
    },
    [index, queue, reviewedCount, sessionPhrases, update],
  );

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <main style={{ flex: 1, backgroundColor: colors.bg }}>
          <ScreenContainer withBottomNav>
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                minHeight:      "50vh",
              }}
            >
              <span style={{ color: colors.muted, fontFamily: typography.fontFamily.sans, fontSize: typography.fontSize.body }}>
                Loading…
              </span>
            </div>
          </ScreenContainer>
        </main>
        <BottomNavigation />
      </>
    );
  }

  // ── Empty queue ───────────────────────────────────────────────────────────
  if (sessionPhrases.length === 0) {
    return (
      <>
        <main style={{ flex: 1, backgroundColor: colors.bg, display: "flex", flexDirection: "column" }}>
          <ScreenContainer withBottomNav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <EmptyQueueState />
          </ScreenContainer>
        </main>
        <BottomNavigation />
      </>
    );
  }

  // ── Completion ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <>
        <main style={{ flex: 1, backgroundColor: colors.bg, display: "flex", flexDirection: "column" }}>
          <ScreenContainer withBottomNav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <CompletionScreen reviewedCount={reviewedCount} />
          </ScreenContainer>
        </main>
        <BottomNavigation />
      </>
    );
  }

  // ── Active session ────────────────────────────────────────────────────────
  const phrase = sessionPhrases[index];

  return (
    <>
      <main
        style={{
          flex:            1,
          backgroundColor: colors.bg,
          overflowY:       "auto",
          paddingBottom:   `calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <ScreenContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing[4] }}>
            <ProgressBar done={reviewedCount} total={sessionPhrases.length} />

            {/* key forces unmount+remount → triggers .as-card-enter animation */}
            <StudySessionCard
              key={phrase.id}
              phrase={phrase}
              onRate={handleRate}
            />
          </div>
        </ScreenContainer>
      </main>
      <BottomNavigation />
    </>
  );
}
