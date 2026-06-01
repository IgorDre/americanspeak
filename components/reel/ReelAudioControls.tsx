"use client";

import { motion } from "framer-motion";
import { WaveformVisualizer } from "./WaveformVisualizer";

interface ReelAudioControlsProps {
  onPlayNative: () => void;
  onPlaySlow: () => void;
  isPlaying: boolean;
  isSlow: boolean;
}

const buttonBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 18px",
  borderRadius: 14,
  background: "var(--reel-glass-bg)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "var(--reel-text)",
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: "nowrap",
  flexShrink: 0,
  touchAction: "manipulation",
  cursor: "pointer",
};

export function ReelAudioControls({
  onPlayNative,
  onPlaySlow,
  isPlaying,
  isSlow,
}: ReelAudioControlsProps) {
  const nativeActive = isPlaying && !isSlow;
  const slowActive = isPlaying && isSlow;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "8px",
        minWidth: 0,
      }}
    >
      <motion.button
        type="button"
        onPointerDown={(e) => e.stopPropagation()} // prevent swipe starting on button
        onPointerUp={(e) => {
          e.stopPropagation();
          onPlayNative(); // call audio handler
        }}
        aria-pressed={nativeActive}
        className="reel-tappable"
        animate={
          nativeActive
            ? {
                boxShadow: [
                  "0 0 0 0px var(--reel-accent-glow)",
                  "0 0 0 7px var(--reel-accent-glow)",
                  "0 0 0 0px var(--reel-accent-glow)",
                ],
              }
            : { boxShadow: "0 0 0 0px transparent" }
        }
        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          ...buttonBase,
          border: nativeActive
            ? "2px solid var(--reel-accent)"
            : "1px solid var(--reel-glass-border)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--reel-text)" aria-hidden="true">
          <polygon points="2,1 13,7 2,13" />
        </svg>
        Native speed
      </motion.button>

      <motion.button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => {
          e.stopPropagation();
          onPlaySlow();
        }}
        aria-pressed={slowActive}
        className="reel-tappable"
        animate={
          slowActive
            ? {
                boxShadow: [
                  "0 0 0 0px var(--reel-accent-glow)",
                  "0 0 0 7px var(--reel-accent-glow)",
                  "0 0 0 0px var(--reel-accent-glow)",
                ],
              }
            : { boxShadow: "0 0 0 0px transparent" }
        }
        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          ...buttonBase,
          border: slowActive
            ? "2px solid var(--reel-accent)"
            : "1px solid var(--reel-glass-border)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--reel-text)" aria-hidden="true">
          <rect x="1" y="1" width="4" height="12" rx="1" />
          <rect x="9" y="1" width="4" height="12" rx="1" />
        </svg>
        Slow
      </motion.button>

      <div style={{ flex: "1 1 0%", minWidth: 0, overflow: "hidden" }}>
        <WaveformVisualizer isPlaying={isPlaying} isSlow={isSlow} />
      </div>
    </div>
  );
}
