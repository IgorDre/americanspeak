import Link from "next/link";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";

interface NavAction {
  kind: "nav";
  id: string;
  label: string;
  icon: string;
  href: string;
  emphasis?: boolean;
}

interface ButtonAction {
  kind: "button";
  id: string;
  label: string;
  icon: string;
  emphasis?: boolean;
}

type QuickActionItem = NavAction | ButtonAction;

const QUICK_ACTIONS: QuickActionItem[] = [
  { kind: "nav",    id: "study",  label: "Study Now",      icon: "▶", href: "/study", emphasis: true },
  { kind: "nav",    id: "browse", label: "Browse Phrases", icon: "🔍", href: "/browse" },
  { kind: "nav",    id: "saved",  label: "Saved",          icon: "♡", href: "/saved" },
  { kind: "button", id: "random", label: "Random Phrase",  icon: "🎲" },
];

const sharedStyle = (emphasis?: boolean): React.CSSProperties => ({
  display:         "flex",
  flexDirection:   "column",
  alignItems:      "center",
  justifyContent:  "center",
  gap:             spacing[2],
  minHeight:       tapTargetMin,
  padding:         spacing[4],
  borderRadius:    radius.card,
  border:          `1px solid ${colors.border}`,
  backgroundColor: emphasis ? colors.accent : colors.surface,
  color:           colors.text,
  fontSize:        typography.fontSize.body,
  fontWeight:      typography.fontWeight.medium,
  fontFamily:      typography.fontFamily.sans,
  cursor:          "pointer",
  textAlign:       "center",
  textDecoration:  "none",
  touchAction:     "manipulation",
});

export interface QuickActionsRowProps {
  onRandomPhrase?: () => void;
}

export function QuickActionsRow({ onRandomPhrase }: QuickActionsRowProps) {
  return (
    <section aria-label="Quick actions">
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap:                 spacing[3],
        }}
      >
        {QUICK_ACTIONS.map((action) => {
          const iconNode = (
            <span aria-hidden="true" style={{ fontSize: typography.fontSize.phrase }}>
              {action.icon}
            </span>
          );

          if (action.kind === "nav") {
            return (
              <Link
                key={action.id}
                href={action.href}
                aria-label={action.label}
                style={sharedStyle(action.emphasis)}
              >
                {iconNode}
                <span>{action.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={action.id}
              type="button"
              aria-label={action.label}
              onClick={action.id === "random" ? onRandomPhrase : undefined}
              style={sharedStyle(action.emphasis)}
            >
              {iconNode}
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
