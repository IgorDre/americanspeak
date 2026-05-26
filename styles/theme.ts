/**
 * AmeriSpeak design tokens — dark mode first.
 * Values from PROJECT_SPEC.md design system.
 */

export const colors = {
  bg: "#0a0a0a",
  surface: "#141414",
  elevated: "#1c1c1c",
  border: "#2a2a2a",
  text: "#f5f5f5",
  muted: "#737373",
  accent: "#a78bfa",
  green: "#4ade80",
  yellow: "#facc15",
  red: "#f87171",
  blue: "#60a5fa",
} as const;

export type ColorToken = keyof typeof colors;

/** CSS custom properties for use in globals.css or inline styles. */
export const cssVariables = {
  "--bg": colors.bg,
  "--surface": colors.surface,
  "--elevated": colors.elevated,
  "--border": colors.border,
  "--text": colors.text,
  "--muted": colors.muted,
  "--accent": colors.accent,
  "--green": colors.green,
  "--yellow": colors.yellow,
  "--red": colors.red,
  "--blue": colors.blue,
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  12: "3rem", // 48px — minimum tap target
} as const;

export type SpacingToken = keyof typeof spacing;

export const radius = {
  card: "20px",
  pill: "999px",
  sm: "8px",
  md: "12px",
  lg: "20px",
  full: "999px",
} as const;

export type RadiusToken = keyof typeof radius;

export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
  md: "0 4px 12px rgba(0, 0, 0, 0.5)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.6)",
  elevated: "0 2px 8px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.04)",
} as const;

export type ShadowToken = keyof typeof shadows;

export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans), system-ui, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  fontSize: {
    label: "0.6875rem", // 11px — labels/badges
    badge: "0.75rem", // 12px — labels/badges
    ipa: "0.8125rem", // 13px — IPA notation
    body: "0.875rem", // 14px — body/definition
    bodyLg: "0.9375rem", // 15px — body/definition
    phrase: "1.375rem", // 22px — phrase term
    phraseLg: "1.5rem", // 24px — phrase term
    phraseHero: "1.875rem", // 30px — immersive/study phrase display
    phraseXl: "2.25rem", // 36px — cinematic hero phrase
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
  },
} as const;

export type TypographyToken = typeof typography;

/** Minimum interactive tap target (px). */
export const tapTargetMin = 48;

export const theme = {
  mode: "dark" as const,
  colors,
  cssVariables,
  spacing,
  radius,
  shadows,
  typography,
  tapTargetMin,
} as const;

export type Theme = typeof theme;

export default theme;
