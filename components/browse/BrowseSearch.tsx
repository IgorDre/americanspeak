"use client";

import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";

export interface BrowseSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BrowseSearch({
  value,
  onChange,
  placeholder = "Search phrases, definitions, examples…",
}: BrowseSearchProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: spacing[4],
          fontSize: typography.fontSize.bodyLg,
          color: colors.muted,
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        🔍
      </span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search phrases"
        style={{
          width: "100%",
          minHeight: tapTargetMin,
          paddingInline: `calc(${spacing[4]} + 1.5rem + ${spacing[2]}) ${spacing[4]}`,
          borderRadius: radius.pill,
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.elevated,
          color: colors.text,
          fontSize: typography.fontSize.body,
          fontFamily: typography.fontFamily.sans,
          outline: "none",
          appearance: "none",
          WebkitAppearance: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.accent;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.border;
        }}
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: spacing[3],
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: radius.full,
            border: "none",
            backgroundColor: colors.border,
            color: colors.muted,
            fontSize: typography.fontSize.body,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
