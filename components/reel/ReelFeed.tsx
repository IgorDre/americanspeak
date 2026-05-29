"use client";

import { useCallback, useEffect, useMemo } from "react";
import { MOCK_PHRASES } from "@/data";
import { useReelFeed } from "@/hooks/useReelFeed";
import { useAudio } from "@/lib/useAudio";
import { useSavedPhrases } from "@/hooks/useSavedPhrases";
import { useStats } from "@/hooks/useStats";
import { reelThemeVars } from "@/lib/reelTheme";
import { toReelPhrase } from "@/lib/reelPhrase";
import { BottomNavigation } from "@/components/layout";
import { BOTTOM_NAV_HEIGHT } from "@/components/layout/ScreenContainer";
import { ReelCard } from "./ReelCard";
import { LiveFeedBadge } from "./LiveFeedBadge";
import { PeekNextStrip } from "./PeekNextStrip";
import { ProgressIndicator } from "./ProgressIndicator";

export function ReelFeed() {
  const phrases = useMemo(() => MOCK_PHRASES.map(toReelPhrase), []);
  const { playWithSpeech, isPlaying, isSlow } = useAudio();

  // Speak the phrase the user just landed on. Fired by useReelFeed right after
  // the swipe/wheel/key transition completes — i.e. following a user gesture,
  // which is what browsers require to allow SpeechSynthesis.
  const handleIndexChange = useCallback(
    (i: number) => {
      const phrase = phrases[i];
      if (phrase) playWithSpeech(phrase.text, false);
    },
    [phrases, playWithSpeech],
  );

  const {
    index,
    dragY,
    isDragging,
    containerRef,
    goNext,
    goPrev,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useReelFeed(phrases.length, handleIndexChange);

  const saved = useSavedPhrases();
  const { stats } = useStats();
  const streakCount = stats.streak;

  const current = phrases[index];
  const next = phrases[index + 1];
  const currentSaved = saved.isSaved(current.id);

  const handleToggleSave = useCallback(() => {
    saved.toggle(current.id);
  }, [saved, current.id]);

  const handlePlayNative = useCallback(() => {
    playWithSpeech(current.text, false);
  }, [playWithSpeech, current.text]);

  const handlePlaySlow = useCallback(() => {
    playWithSpeech(current.text, true);
  }, [playWithSpeech, current.text]);

  // Desktop keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  return (
    <>
      <div
        ref={containerRef}
        className="reel-shell reel-container"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          ...reelThemeVars(),
          position: "relative",
          height: "100dvh",
          width: "100%",
          maxWidth: "30rem",
          marginInline: "auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          containerType: "inline-size",
          background: "var(--reel-bg)",
          color: "var(--reel-text)",
          paddingBottom: `calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        {/* Top bar — overlays the card, safe-area aware */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "calc(env(safe-area-inset-top, 0px) + 12px) 16px 0",
            zIndex: 30,
            pointerEvents: "none", // so it doesn't block swipes
          }}
        >
          <LiveFeedBadge />

          {/* Streak counter — restore pointer events just on this element */}
          <div
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 14px",
              borderRadius: 999,
              background: "var(--reel-glass-bg)",
              border: "1px solid var(--reel-glass-border)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <span style={{ fontSize: "15px" }}>🔥</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--reel-accent)" }}>
              {streakCount}
            </span>
          </div>
        </div>

        {/* Card viewport */}
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          {/* Drag-follow transform wrapper */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateY(${dragY}px)`,
              transition: isDragging
                ? "none"
                : "transform 0.38s cubic-bezier(0.22,0.61,0.36,1)",
              willChange: "transform",
            }}
          >
            <ReelCard
              key={current.id}
              phrase={current}
              isSaved={currentSaved}
              onToggleSave={handleToggleSave}
              isPlaying={isPlaying}
              isSlow={isSlow}
              onPlayNative={handlePlayNative}
              onPlaySlow={handlePlaySlow}
            />
          </div>

          <ProgressIndicator current={index} total={phrases.length} />
        </div>

        {/* Peek-next strip */}
        {next && <PeekNextStrip nextPhrase={next.text} onSwipeUp={goNext} />}
      </div>

      <BottomNavigation />
    </>
  );
}
