"use client";

import { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_PHRASES } from "@/data";
import { useReelFeed } from "@/hooks/useReelFeed";
import { useAudio } from "@/lib/useAudio";
import { usePhraseStates } from "@/lib/usePhraseStates";
import { useStreak } from "@/lib/useStreak";
import { reelThemeVars } from "@/lib/reelTheme";
import { toReelPhrase } from "@/lib/reelPhrase";
import { BottomNavigation } from "@/components/layout";
import { BOTTOM_NAV_HEIGHT } from "@/components/layout/ScreenContainer";
import { ReelCard } from "./ReelCard";
import { LiveFeedBadge } from "./LiveFeedBadge";
import { PeekNextStrip } from "./PeekNextStrip";

export function ReelFeed() {
  const allPhrases = useMemo(() => MOCK_PHRASES.map(toReelPhrase), []);
  const { playWithSpeech, isPlaying, isSlow } = useAudio();

  const phraseStates = usePhraseStates();
  const { isVisibleInFeed, getState, hide } = phraseStates;
  const { streak } = useStreak();

  // Only phrases that should currently appear in the Discover feed. Falls back
  // to the full list if everything is filtered out, so the feed never empties.
  const visiblePhrases = useMemo(() => {
    const filtered = allPhrases.filter((p) => isVisibleInFeed(p.id));
    return filtered.length > 0 ? filtered : allPhrases;
  }, [allPhrases, isVisibleInFeed]);

  // Speak the phrase the user just landed on. Fired by useReelFeed right after
  // the swipe/wheel/key transition completes — i.e. following a user gesture,
  // which is what browsers require to allow SpeechSynthesis.
  const handleIndexChange = useCallback(
    (i: number) => {
      const phrase = visiblePhrases[i];
      if (phrase) playWithSpeech(phrase.text, false);
    },
    [visiblePhrases, playWithSpeech],
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
  } = useReelFeed(visiblePhrases.length, handleIndexChange);

  // Clamp the index defensively — the visible list can shrink after an action.
  const safeIndex = Math.min(index, visiblePhrases.length - 1);
  const current = visiblePhrases[safeIndex];
  const next = visiblePhrases[safeIndex + 1];

  const handlePlayNative = useCallback(() => {
    playWithSpeech(current.text, false);
  }, [playWithSpeech, current.text]);

  const handlePlaySlow = useCallback(() => {
    playWithSpeech(current.text, true);
  }, [playWithSpeech, current.text]);

  // ── More-menu actions ──
  const handleHide = useCallback(() => {
    hide(current.id);
    goNext();
  }, [hide, current.id, goNext]);

  const handleCopy = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(current.text).catch(() => {});
    }
  }, [current.text]);

  const handleReport = useCallback(() => {
    // Placeholder — flagging is not yet wired to a backend.
  }, []);

  const handleViewDetails = useCallback(() => {
    // Placeholder — detail view is not yet implemented.
  }, []);

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

          {/* Streak counter — nav-icon style, restore pointer events just here */}
          <motion.div
            style={{
              pointerEvents: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              padding: "6px 10px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <motion.span
              animate={{ scale: streak > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: "18px", lineHeight: 1 }}
            >
              🔥
            </motion.span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--accent)",
                lineHeight: 1,
                minWidth: "12px",
                textAlign: "center",
              }}
            >
              {streak}
            </span>
          </motion.div>
        </div>

        {/* Prev hint — appears above the card once the user has scrolled past the first */}
        {index > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(env(safe-area-inset-top) + 48px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.28)",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              ∧ prev
            </span>
          </div>
        )}

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
              phraseState={getState(current.id)}
              isPlaying={isPlaying}
              isSlow={isSlow}
              onPlayNative={handlePlayNative}
              onPlaySlow={handlePlaySlow}
              onHide={handleHide}
              onReport={handleReport}
              onCopy={handleCopy}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>

        {/* Peek-next strip */}
        {next && <PeekNextStrip nextPhrase={next.text} onSwipeUp={goNext} />}
      </div>

      <BottomNavigation />
    </>
  );
}
