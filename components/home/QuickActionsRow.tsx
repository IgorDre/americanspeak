import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";

interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  emphasis?: boolean;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  { id: "study",   label: "Study Now",      icon: "▶", emphasis: true },
  { id: "browse",  label: "Browse Phrases", icon: "🔍" },
  { id: "saved",   label: "Saved",          icon: "♡" },
  { id: "random",  label: "Random Phrase",  icon: "🎲" },
];

export interface QuickActionsRowProps {
  onRandomPhrase?: () => void;
}

export function QuickActionsRow({ onRandomPhrase }: QuickActionsRowProps) {
  function handleClick(id: string) {
    if (id === "random") onRandomPhrase?.();
  }

  return (
    <section aria-label="Quick actions">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: spacing[3],
        }}
      >
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            onClick={() => handleClick(action.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing[2],
              minHeight: tapTargetMin,
              padding: spacing[4],
              borderRadius: radius.card,
              border: `1px solid ${colors.border}`,
              backgroundColor: action.emphasis ? colors.accent : colors.surface,
              color: colors.text,
              fontSize: typography.fontSize.body,
              fontWeight: typography.fontWeight.medium,
              fontFamily: typography.fontFamily.sans,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <span aria-hidden="true" style={{ fontSize: typography.fontSize.phrase }}>
              {action.icon}
            </span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
