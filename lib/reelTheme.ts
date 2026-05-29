/**
 * Reel theme tokens — a self-contained cinematic palette for the Home Reel Feed.
 *
 * These are applied as CSS custom properties on the Reel feed wrapper ONLY,
 * so the rest of the app keeps its existing global (purple) theme untouched.
 */

export type ReelTheme = {
  id: string;
  name: string;
  bg: string;
  bgSecondary: string;
  accent: string;
  accentGlow: string;
  accentMuted: string;
  text: string;
  textMuted: string;
  glassBg: string;
  glassBorder: string;
  ringColor: string;
  waveformColor: string;
  progressColor: string;
  overlayGradient: string;
};

export const reelThemes: Record<string, ReelTheme> = {
  midnightAmber: {
    id: "midnightAmber",
    name: "Midnight Amber",
    bg: "#0d0d0d",
    bgSecondary: "#111111",
    accent: "#f5a623",
    accentGlow: "rgba(245,166,35,0.35)",
    accentMuted: "rgba(245,166,35,0.15)",
    text: "#f0ede6",
    textMuted: "rgba(240,237,230,0.5)",
    glassBg: "rgba(255,255,255,0.06)",
    glassBorder: "rgba(255,255,255,0.10)",
    ringColor: "rgba(180,220,80,0.18)",
    waveformColor: "#6fcf3a",
    progressColor: "#f5a623",
    overlayGradient:
      "linear-gradient(to top, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.55) 50%, rgba(13,13,13,0.3) 100%)",
  },
  deepIndigo: {
    id: "deepIndigo",
    name: "Deep Indigo",
    bg: "#08080f",
    bgSecondary: "#0e0e1a",
    accent: "#7c6cfc",
    accentGlow: "rgba(124,108,252,0.35)",
    accentMuted: "rgba(124,108,252,0.15)",
    text: "#e8e6f5",
    textMuted: "rgba(232,230,245,0.5)",
    glassBg: "rgba(255,255,255,0.05)",
    glassBorder: "rgba(255,255,255,0.09)",
    ringColor: "rgba(124,108,252,0.15)",
    waveformColor: "#a78bfa",
    progressColor: "#7c6cfc",
    overlayGradient:
      "linear-gradient(to top, rgba(8,8,15,0.97) 0%, rgba(8,8,15,0.55) 50%, rgba(8,8,15,0.3) 100%)",
  },
  mineralGreen: {
    id: "mineralGreen",
    name: "Mineral Green",
    bg: "#080f0a",
    bgSecondary: "#0b140d",
    accent: "#34d399",
    accentGlow: "rgba(52,211,153,0.3)",
    accentMuted: "rgba(52,211,153,0.12)",
    text: "#e2f0e8",
    textMuted: "rgba(226,240,232,0.5)",
    glassBg: "rgba(255,255,255,0.05)",
    glassBorder: "rgba(255,255,255,0.09)",
    ringColor: "rgba(52,211,153,0.12)",
    waveformColor: "#34d399",
    progressColor: "#34d399",
    overlayGradient:
      "linear-gradient(to top, rgba(8,15,10,0.97) 0%, rgba(8,15,10,0.55) 50%, rgba(8,15,10,0.3) 100%)",
  },
};

export const defaultReelTheme = reelThemes.midnightAmber;

/** Produce the CSS-variable style object to spread on the Reel wrapper element. */
export function reelThemeVars(theme: ReelTheme = defaultReelTheme): React.CSSProperties {
  return {
    ["--reel-bg" as string]: theme.bg,
    ["--reel-bg-secondary" as string]: theme.bgSecondary,
    ["--reel-accent" as string]: theme.accent,
    ["--reel-accent-glow" as string]: theme.accentGlow,
    ["--reel-accent-muted" as string]: theme.accentMuted,
    ["--reel-text" as string]: theme.text,
    ["--reel-text-muted" as string]: theme.textMuted,
    ["--reel-glass-bg" as string]: theme.glassBg,
    ["--reel-glass-border" as string]: theme.glassBorder,
    ["--reel-ring" as string]: theme.ringColor,
    ["--reel-waveform" as string]: theme.waveformColor,
    ["--reel-progress" as string]: theme.progressColor,
    ["--reel-overlay" as string]: theme.overlayGradient,
  };
}
