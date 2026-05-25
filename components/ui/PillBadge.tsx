import { colors, radius, spacing, typography } from "@/styles/theme";

export type PillBadgeVariant =
  | "casual"
  | "neutral"
  | "formal"
  | "common"
  | "rare";

export interface PillBadgeProps {
  label: string;
  variant: PillBadgeVariant;
}

const variantStyles: Record<
  PillBadgeVariant,
  { backgroundColor: string; color: string; borderColor: string }
> = {
  casual: {
    backgroundColor: colors.elevated,
    color: colors.muted,
    borderColor: colors.border,
  },
  neutral: {
    backgroundColor: colors.elevated,
    color: colors.text,
    borderColor: colors.border,
  },
  formal: {
    backgroundColor: colors.elevated,
    color: colors.blue,
    borderColor: colors.border,
  },
  common: {
    backgroundColor: colors.elevated,
    color: colors.green,
    borderColor: colors.border,
  },
  rare: {
    backgroundColor: colors.elevated,
    color: colors.yellow,
    borderColor: colors.border,
  },
};

export function PillBadge({ label, variant }: PillBadgeProps) {
  const style = variantStyles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        paddingInline: spacing[3],
        paddingBlock: spacing[1],
        borderRadius: radius.pill,
        border: `1px solid ${style.borderColor}`,
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontSize: typography.fontSize.badge,
        fontWeight: typography.fontWeight.medium,
        fontFamily: typography.fontFamily.sans,
        lineHeight: typography.lineHeight.tight,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
