import { useStats } from "@/hooks/useStats";
import { colors, radius, shadows, spacing, typography } from "@/styles/theme";

interface MiniStatProps {
  icon: string;
  label: string;
  value: string | number;
  accent?: boolean;
}

function MiniStat({ icon, label, value, accent = false }: MiniStatProps) {
  return (
    <div
      style={{
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        gap:             spacing[1],
        padding:         spacing[4],
        borderRadius:    radius.card,
        backgroundColor: colors.surface,
        border:          `1px solid ${colors.border}`,
        boxShadow:       shadows.sm,
        textAlign:       "center",
      }}
    >
      <span style={{ fontSize: "1.25rem", lineHeight: 1 }} aria-hidden="true">
        {icon}
      </span>
      <span
        style={{
          fontSize:   typography.fontSize.phraseLg,
          fontWeight: typography.fontWeight.semibold,
          color:      accent ? colors.accent : colors.text,
          fontFamily: typography.fontFamily.sans,
          lineHeight: typography.lineHeight.tight,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize:   typography.fontSize.badge,
          color:      colors.muted,
          fontFamily: typography.fontFamily.sans,
          lineHeight: typography.lineHeight.normal,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function ProfileStats() {
  const { stats } = useStats();

  return (
    <div
      style={{
        display:             "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap:                 spacing[3],
      }}
    >
      <MiniStat
        icon="🔥"
        label="Streak"
        value={stats.streak}
        accent={stats.streak > 0}
      />
      <MiniStat
        icon="📚"
        label="Learned"
        value={stats.learned}
      />
      <MiniStat
        icon="📋"
        label="In queue"
        value={stats.queueSize}
      />
      <MiniStat
        icon="🎯"
        label="Accuracy"
        value="—"
      />
    </div>
  );
}
