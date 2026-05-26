"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { StudySessionCard } from "@/components/study/StudySessionCard";
import { EmptyQueueState } from "@/components/study/EmptyQueueState";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { BOTTOM_NAV_HEIGHT } from "@/components/layout/ScreenContainer";
import { MOCK_PHRASES } from "@/data";
import { useStudyQueue } from "@/hooks/useStudyQueue";
import { applyRating, type RatingKey } from "@/lib/scheduling";
import { incrementLearned, updateStreak } from "@/lib/storage";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";
import type { Phrase } from "@/types";

// ─── Shared full-screen layout wrapper ───────────────────────────────────────

function SessionShell({ children }: { children: React.ReactNode }) {
  return (
    <>
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
        {children}
      </div>
      <BottomNavigation />
    </>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            spacing[3],
        paddingInline:  spacing[4],
        paddingBlock:   spacing[3],
        flexShrink:     0,
      }}
    >
      <div
        style={{
          flex:            1,
          height:          "3px",
          borderRadius:    "999px",
          backgroundColor: colors.elevated,
          overflow:        "hidden",
        }}
      >
        <div
          style={{
            height:          "100%",
            width:           `${pct}%`,
            borderRadius:    "999px",
            backgroundColor: colors.accent,
            transition:      "width 350ms ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize:   typography.fontSize.label,
          color:      colors.muted,
          fontFamily: typography.fontFamily.sans,
          flexShrink: 0,
        }}
      >
        {done} / {total}
      </span>
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
        flex:           1,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        textAlign:      "center",
        gap:            spacing[6],
        padding:        spacing[8],
      }}
    >
      <span style={{ fontSize: "4rem", lineHeight: 1 }} aria-hidden="true">🎉</span>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
        <h2
          style={{
            margin:     0,
            fontSize:   typography.fontSize.phraseHero,
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
          minHeight:       `${tapTargetMin}px`,
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

  const sessionPhrases = useMemo<Phrase[]>(() => {
    if (loading) return [];
    return Object.keys(queue)
      .map((id) => MOCK_PHRASES.find((p) => p.id === id))
      .filter((p): p is Phrase => p !== undefined);
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
      <SessionShell>
        <div
          style={{
            flex:           1,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color:      colors.muted,
              fontFamily: typography.fontFamily.sans,
              fontSize:   typography.fontSize.body,
            }}
          >
            Loading…
          </span>
        </div>
      </SessionShell>
    );
  }

  // ── Empty queue ───────────────────────────────────────────────────────────
  if (sessionPhrases.length === 0) {
    return (
      <SessionShell>
        <EmptyQueueState />
      </SessionShell>
    );
  }

  // ── Completion ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <SessionShell>
        <CompletionScreen reviewedCount={reviewedCount} />
      </SessionShell>
    );
  }

  // ── Active session ────────────────────────────────────────────────────────
  const phrase = sessionPhrases[index];

  return (
    <SessionShell>
      {/* Compact progress bar */}
      <ProgressBar done={reviewedCount} total={sessionPhrases.length} />

      {/* Full-height card with safe margins */}
      <div
        style={{
          flex:          1,
          display:       "flex",
          flexDirection: "column",
          paddingInline: spacing[4],
          paddingBottom: spacing[3],
          overflow:      "hidden",
        }}
      >
        {/* key forces unmount+remount → triggers .as-card-enter animation */}
        <StudySessionCard
          key={phrase.id}
          phrase={phrase}
          onRate={handleRate}
        />
      </div>
    </SessionShell>
  );
}
