import { StreakBadge } from "@/components/home/StreakBadge";
import { colors, spacing, typography } from "@/styles/theme";

export interface HomeHeaderProps {
  streakDays: number;
}

export function HomeHeader({ streakDays }: HomeHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: spacing[4],
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: typography.fontSize.phraseLg,
            fontWeight: typography.fontWeight.semibold,
            lineHeight: typography.lineHeight.tight,
            color: colors.text,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          AmeriSpeak
        </h1>
        <p
          style={{
            margin: 0,
            marginTop: spacing[2],
            fontSize: typography.fontSize.body,
            lineHeight: typography.lineHeight.normal,
            color: colors.muted,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          Real American English for daily life in the USA
        </p>
      </div>
      <StreakBadge days={streakDays} />
    </header>
  );
}
