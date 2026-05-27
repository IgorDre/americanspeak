import { CATEGORY_LABELS } from "@/lib/settings";
import { colors, radius, shadows, spacing, typography } from "@/styles/theme";

function getVibe(learned: number): string {
  if (learned >= 100) return "You get the vibe — keep going 🎯";
  if (learned >= 50)  return "Starting to sound like a local";
  if (learned >= 10)  return "Getting comfortable in casual American conversations";
  return "Just getting started — welcome to America 🇺🇸";
}

/** Pick the first N enabled categories to show as "Strongest areas". */
function pickTopCategories(enabledCategories: string[], count = 3): string[] {
  return enabledCategories.slice(0, count);
}

interface ProfileIdentityProps {
  learned: number;
  enabledCategories: string[];
}

export function ProfileIdentity({ learned, enabledCategories }: ProfileIdentityProps) {
  const vibe       = getVibe(learned);
  const topCats    = pickTopCategories(enabledCategories, 3);

  return (
    <div
      style={{
        borderRadius:    radius.card,
        border:          `1px solid ${colors.border}`,
        overflow:        "hidden",
        position:        "relative",
        boxShadow:       shadows.elevated,
        // Subtle accent gradient — feels alive
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.elevated} 60%, ${colors.accent}0d 100%)`,
      }}
    >
      {/* Decorative accent line at top */}
      <div
        aria-hidden="true"
        style={{
          height:          "2px",
          background:      `linear-gradient(90deg, transparent 0%, ${colors.accent}80 50%, transparent 100%)`,
        }}
      />

      <div style={{ padding: spacing[5], display: "flex", flexDirection: "column", gap: spacing[4] }}>
        {/* Vibe */}
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
          <span
            style={{
              fontSize:   typography.fontSize.label,
              fontWeight: typography.fontWeight.semibold,
              color:      colors.muted,
              fontFamily: typography.fontFamily.sans,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Your vibe
          </span>
          <p
            style={{
              margin:     0,
              fontSize:   typography.fontSize.bodyLg,
              fontWeight: typography.fontWeight.medium,
              color:      colors.text,
              fontFamily: typography.fontFamily.sans,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            {vibe}
          </p>
        </div>

        {/* Strongest areas */}
        {topCats.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
            <span
              style={{
                fontSize:   typography.fontSize.label,
                fontWeight: typography.fontWeight.semibold,
                color:      colors.muted,
                fontFamily: typography.fontFamily.sans,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Strongest areas
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: spacing[2] }}>
              {topCats.map((slug) => (
                <span
                  key={slug}
                  style={{
                    display:         "inline-flex",
                    alignItems:      "center",
                    paddingInline:   spacing[3],
                    paddingBlock:    "0.3125rem",
                    borderRadius:    radius.pill,
                    backgroundColor: `${colors.accent}15`,
                    border:          `1px solid ${colors.accent}30`,
                    color:           colors.accent,
                    fontSize:        typography.fontSize.badge,
                    fontWeight:      typography.fontWeight.medium,
                    fontFamily:      typography.fontFamily.sans,
                    whiteSpace:      "nowrap",
                  }}
                >
                  {CATEGORY_LABELS[slug] ?? slug}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
