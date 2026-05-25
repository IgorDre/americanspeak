"use client";

import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";
import type { Category } from "@/types";

export interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      style={{
        display: "flex",
        gap: spacing[2],
        overflowX: "auto",
        paddingBottom: spacing[1],
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <CategoryPill
        label="All"
        active={selected === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((cat) => (
        <CategoryPill
          key={cat.slug}
          label={`${cat.emoji} ${cat.name}`}
          active={selected === cat.slug}
          onClick={() => onSelect(selected === cat.slug ? null : cat.slug)}
        />
      ))}
    </div>
  );
}

interface PillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function CategoryPill({ label, active, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        flexShrink: 0,
        minHeight: tapTargetMin,
        paddingInline: spacing[4],
        borderRadius: radius.pill,
        border: `1px solid ${active ? colors.accent : colors.border}`,
        backgroundColor: active ? colors.accent : colors.elevated,
        color: active ? colors.text : colors.muted,
        fontSize: typography.fontSize.body,
        fontWeight: active ? typography.fontWeight.medium : typography.fontWeight.normal,
        fontFamily: typography.fontFamily.sans,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background-color 150ms ease, color 150ms ease, border-color 150ms ease",
      }}
    >
      {label}
    </button>
  );
}
