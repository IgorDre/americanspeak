"use client";

import { useCallback, useState } from "react";
import { speakAmerican, stopSpeaking } from "@/lib/speak";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";

export type AudioButtonSize = "sm" | "md" | "lg";

export interface AudioButtonProps {
  text: string;
  slow?: boolean;
  repeat?: number;
  size?: AudioButtonSize;
  label?: string;
}

const sizeMap: Record<AudioButtonSize, number> = {
  sm: 28,
  md: 36,
  lg: tapTargetMin,
};

export function AudioButton({
  text,
  slow = false,
  repeat = 1,
  size = "md",
  label,
}: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  const handleClick = useCallback(async () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    try {
      await speakAmerican(text, { rate: slow ? 0.6 : 0.9, repeat });
    } finally {
      setPlaying(false);
    }
  }, [playing, repeat, slow, text]);

  const dimension = sizeMap[size];
  const hasLabel = Boolean(label);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={playing ? `Stop: ${text}` : `Play: ${text}`}
      aria-pressed={playing}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing[2],
        minHeight: hasLabel ? tapTargetMin : dimension,
        minWidth: hasLabel ? undefined : dimension,
        height: hasLabel ? tapTargetMin : dimension,
        width: hasLabel ? undefined : dimension,
        paddingInline: hasLabel ? spacing[4] : 0,
        borderRadius: radius.full,
        border: `1px solid ${colors.border}`,
        backgroundColor: playing ? colors.accent : colors.elevated,
        color: colors.text,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.medium,
        fontFamily: typography.fontFamily.sans,
        cursor: "pointer",
        transition: "background-color 150ms ease, transform 150ms ease",
        transform: playing ? "scale(0.95)" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!playing) {
          e.currentTarget.style.backgroundColor = colors.accent;
        }
      }}
      onMouseLeave={(e) => {
        if (!playing) {
          e.currentTarget.style.backgroundColor = colors.elevated;
        }
      }}
    >
      <span aria-hidden="true">{playing ? "◼" : "▶"}</span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}

export interface AudioControlsProps {
  text: string;
  size?: AudioButtonSize;
}

/** Normal · slow · repeat ×3 — used on phrase term rows. */
export function AudioControls({ text, size = "lg" }: AudioControlsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: spacing[2],
      }}
    >
      <AudioButton text={text} size={size} label="🔊" />
      <AudioButton text={text} slow label="🐢 Slow" />
      <AudioButton text={text} repeat={3} label="🔁 ×3" />
    </div>
  );
}
