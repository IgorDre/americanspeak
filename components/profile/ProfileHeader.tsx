import { colors, radius, shadows, spacing, typography } from "@/styles/theme";

function getRank(learned: number): string {
  if (learned >= 300) return "You Get It 🎯";
  if (learned >= 200) return "Almost Native";
  if (learned >= 100) return "Sounding Local";
  if (learned >= 50)  return "Holding Conversations";
  if (learned >= 25)  return "Breaking the Ice";
  if (learned >= 10)  return "Getting Around";
  return "Just Arrived 🇺🇸";
}

interface ProfileHeaderProps {
  learned: number;
}

export function ProfileHeader({ learned }: ProfileHeaderProps) {
  const rank = getRank(learned);

  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            spacing[3],
        paddingBlock:   spacing[6],
      }}
    >
      {/* Avatar */}
      <div
        aria-hidden="true"
        style={{
          width:           "5rem",
          height:          "5rem",
          borderRadius:    radius.full,
          backgroundColor: colors.accent,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          boxShadow:       `0 0 0 4px ${colors.surface}, 0 0 0 6px ${colors.accent}40`,
        }}
      >
        <span
          style={{
            fontSize:   "1.75rem",
            fontWeight: typography.fontWeight.semibold,
            color:      colors.text,
            fontFamily: typography.fontFamily.sans,
            letterSpacing: "0.02em",
          }}
        >
          AS
        </span>
      </div>

      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing[2] }}>
        <h1
          style={{
            margin:     0,
            fontSize:   typography.fontSize.phraseLg,
            fontWeight: typography.fontWeight.semibold,
            color:      colors.text,
            fontFamily: typography.fontFamily.sans,
            lineHeight: typography.lineHeight.tight,
          }}
        >
          AmeriSpeak Learner
        </h1>

        {/* Rank badge */}
        <span
          style={{
            display:         "inline-flex",
            alignItems:      "center",
            paddingInline:   spacing[4],
            paddingBlock:    spacing[2],
            borderRadius:    radius.pill,
            backgroundColor: `${colors.accent}18`,
            border:          `1px solid ${colors.accent}40`,
            color:           colors.accent,
            fontSize:        typography.fontSize.body,
            fontWeight:      typography.fontWeight.medium,
            fontFamily:      typography.fontFamily.sans,
            boxShadow:       shadows.sm,
          }}
        >
          {rank}
        </span>
      </div>
    </div>
  );
}
