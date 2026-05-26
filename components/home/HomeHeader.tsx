import { colors, spacing, typography } from "@/styles/theme";

export interface HomeHeaderProps {
  streakDays: number;
}

function formatCompactDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
  });
}

export function HomeHeader({ streakDays }: HomeHeaderProps) {
  const dateLabel = formatCompactDate();
  const streakLabel = streakDays > 0 ? `🔥 ${streakDays}` : "🔥 0";

  return (
    <header
      style={{
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        paddingInline:   spacing[4],
        paddingBlock:    spacing[3],
        minHeight:       "48px",
        flexShrink:      0,
      }}
    >
      <span
        style={{
          fontSize:   typography.fontSize.body,
          fontWeight: typography.fontWeight.semibold,
          color:      colors.text,
          fontFamily: typography.fontFamily.sans,
          letterSpacing: "0.01em",
        }}
      >
        AmeriSpeak
      </span>

      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        spacing[3],
        }}
      >
        <span
          style={{
            fontSize:   typography.fontSize.badge,
            color:      colors.muted,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          {dateLabel}
        </span>
        <span
          style={{
            fontSize:        typography.fontSize.badge,
            fontWeight:      typography.fontWeight.semibold,
            color:           "#facc15",
            fontFamily:      typography.fontFamily.sans,
            paddingInline:   spacing[2],
            paddingBlock:    spacing[1],
            borderRadius:    "6px",
            backgroundColor: "rgba(250, 204, 21, 0.1)",
          }}
        >
          {streakLabel}
        </span>
      </div>
    </header>
  );
}
