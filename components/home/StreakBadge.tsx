import { colors, radius, spacing, typography } from "@/styles/theme";

export interface StreakBadgeProps {
  days: number;
}

export function StreakBadge({ days }: StreakBadgeProps) {
  const label = days === 1 ? "1 day" : `${days} days`;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacing[1],
        paddingInline: spacing[3],
        paddingBlock: spacing[2],
        borderRadius: radius.pill,
        backgroundColor: colors.elevated,
        border: `1px solid ${colors.border}`,
        color: colors.yellow,
        fontSize: typography.fontSize.badge,
        fontWeight: typography.fontWeight.semibold,
        fontFamily: typography.fontFamily.sans,
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true">🔥</span>
      <span>{label}</span>
    </span>
  );
}
