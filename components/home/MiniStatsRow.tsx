import { colors, radius, spacing, typography } from "@/styles/theme";

export interface MiniStatsRowProps {
  phrasesLearned: number;
  streakDays: number;
  queueCount: number;
}

interface StatItem {
  label: string;
  value: string;
}

export function MiniStatsRow({
  phrasesLearned,
  streakDays,
  queueCount,
}: MiniStatsRowProps) {
  const streakLabel = streakDays === 1 ? "1 day" : `${streakDays} days`;

  const stats: StatItem[] = [
    { label: "Phrases learned", value: String(phrasesLearned) },
    { label: "Streak", value: streakLabel },
    { label: "Queue", value: String(queueCount) },
  ];

  return (
    <section aria-label="Learning stats">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: spacing[2],
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing[1],
              padding: spacing[3],
              borderRadius: radius.md,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: typography.fontSize.phrase,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text,
                fontFamily: typography.fontFamily.sans,
                lineHeight: typography.lineHeight.tight,
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize: typography.fontSize.label,
                color: colors.muted,
                fontFamily: typography.fontFamily.sans,
                lineHeight: typography.lineHeight.normal,
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
