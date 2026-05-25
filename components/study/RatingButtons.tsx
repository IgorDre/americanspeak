"use client";

import type { RatingKey } from "@/lib/scheduling";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";

export interface RatingButtonsProps {
  onRate: (rating: RatingKey) => void;
  disabled?: boolean;
}

interface RatingOption {
  key:    RatingKey;
  label:  string;
  color:  string;
  hint:   string;
}

const OPTIONS: RatingOption[] = [
  { key: "again", label: "Again",  color: colors.red,    hint: "5 min"  },
  { key: "good",  label: "Good",   color: colors.blue,   hint: "3 days" },
  { key: "easy",  label: "Easy",   color: colors.green,  hint: "7 days" },
];

export function RatingButtons({ onRate, disabled = false }: RatingButtonsProps) {
  return (
    <div
      role="group"
      aria-label="Rate this phrase"
      style={{
        display:   "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap:       spacing[3],
      }}
    >
      {OPTIONS.map(({ key, label, color, hint }) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onRate(key)}
          style={{
            display:         "flex",
            flexDirection:   "column",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             spacing[1],
            minHeight:       tapTargetMin,
            padding:         `${spacing[3]} ${spacing[2]}`,
            borderRadius:    radius.pill,
            border:          `2px solid ${color}`,
            backgroundColor: colors.elevated,
            color:           color,
            fontFamily:      typography.fontFamily.sans,
            cursor:          disabled ? "not-allowed" : "pointer",
            opacity:         disabled ? 0.4 : 1,
            transition:      "background-color 120ms ease, opacity 120ms ease",
          }}
          onMouseEnter={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = color + "22";
          }}
          onMouseLeave={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = colors.elevated;
          }}
        >
          <span style={{ fontSize: typography.fontSize.body, fontWeight: typography.fontWeight.semibold }}>
            {label}
          </span>
          <span style={{ fontSize: typography.fontSize.label, opacity: 0.75 }}>
            {hint}
          </span>
        </button>
      ))}
    </div>
  );
}
