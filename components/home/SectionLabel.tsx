import { colors, spacing, typography } from "@/styles/theme";

export interface SectionLabelProps {
  children: string;
  id?: string;
}

export function SectionLabel({ children, id }: SectionLabelProps) {
  return (
    <p
      id={id}
      style={{
        margin: 0,
        marginBottom: spacing[3],
        fontSize: typography.fontSize.label,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: colors.muted,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {children}
    </p>
  );
}
