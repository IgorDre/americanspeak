"use client";

import { useState } from "react";
import { AudioButton, AudioControls } from "@/components/ui/AudioButton";
import { PillBadge } from "@/components/ui/PillBadge";
import { RatingButtons } from "@/components/study/RatingButtons";
import type { RatingKey } from "@/lib/scheduling";
import { Frequency, Register, type Phrase } from "@/types";
import {
  colors,
  radius,
  shadows,
  spacing,
  tapTargetMin,
  typography,
} from "@/styles/theme";

export interface StudySessionCardProps {
  phrase:     Phrase;
  /** Unique key passed from the parent to trigger entry animation on phrase change. */
  onRate:     (rating: RatingKey) => void;
}

function registerVariant(r: Register) {
  if (r === Register.CASUAL)  return "casual"  as const;
  if (r === Register.FORMAL)  return "formal"  as const;
  return "neutral" as const;
}

function frequencyVariant(f: Frequency) {
  return f === Frequency.OCCASIONAL || f === Frequency.RARE ? "rare" as const : "common" as const;
}

function fmtFrequency(f: Frequency) {
  return f.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");
}

export function StudySessionCard({ phrase, onRate }: StudySessionCardProps) {
  const [revealed, setReveal] = useState(false);

  const examples = [phrase.example1, phrase.example2, phrase.example3].filter(
    (e): e is string => Boolean(e),
  );

  return (
    <div
      className="as-card-enter"
      style={{
        display:        "flex",
        flexDirection:  "column",
        gap:            spacing[4],
        padding:        spacing[5],
        borderRadius:   radius.card,
        backgroundColor: colors.surface,
        border:         `1px solid ${colors.border}`,
        boxShadow:      shadows.elevated,
      }}
    >
      {/* ── FRONT — always visible ────────────────────────────── */}
      <header style={{ display: "flex", flexWrap: "wrap", gap: spacing[2] }}>
        <PillBadge
          label={phrase.type.replace(/_/g, " ")}
          variant="neutral"
        />
        <PillBadge
          label={phrase.register.charAt(0) + phrase.register.slice(1).toLowerCase()}
          variant={registerVariant(phrase.register)}
        />
        <PillBadge
          label={fmtFrequency(phrase.frequency)}
          variant={frequencyVariant(phrase.frequency)}
        />
      </header>

      <div>
        <h2
          style={{
            margin:     0,
            fontSize:   typography.fontSize.phraseLg,
            fontWeight: typography.fontWeight.medium,
            color:      colors.text,
            lineHeight: typography.lineHeight.tight,
          }}
        >
          {phrase.term}
        </h2>
        <p
          style={{
            margin:     0,
            marginTop:  spacing[2],
            fontSize:   typography.fontSize.ipa,
            fontFamily: typography.fontFamily.mono,
            color:      colors.muted,
          }}
        >
          {phrase.pronunciation}
        </p>
      </div>

      <AudioControls text={phrase.term} />

      {/* ── BACK — revealed after tap ──────────────────────────── */}
      {!revealed ? (
        <button
          type="button"
          onClick={() => setReveal(true)}
          style={{
            minHeight:       tapTargetMin,
            borderRadius:    radius.pill,
            border:          `1px solid ${colors.border}`,
            backgroundColor: colors.elevated,
            color:           colors.muted,
            fontSize:        typography.fontSize.body,
            fontWeight:      typography.fontWeight.medium,
            fontFamily:      typography.fontFamily.sans,
            cursor:          "pointer",
            marginTop:       spacing[2],
          }}
        >
          Reveal Meaning ↓
        </button>
      ) : (
        <div className="as-reveal-enter" style={{ display: "flex", flexDirection: "column", gap: spacing[4] }}>
          {/* Definition */}
          <div
            style={{
              display:   "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap:       spacing[3],
              padding:   spacing[4],
              borderRadius: radius.md,
              backgroundColor: colors.elevated,
              border:    `1px solid ${colors.border}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin:        0,
                  marginBottom:  spacing[1],
                  fontSize:      typography.fontSize.label,
                  fontWeight:    typography.fontWeight.semibold,
                  color:         colors.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Meaning
              </p>
              <p
                style={{
                  margin:     0,
                  fontSize:   typography.fontSize.bodyLg,
                  lineHeight: typography.lineHeight.relaxed,
                  color:      colors.text,
                }}
              >
                {phrase.definition}
              </p>
            </div>
            <AudioButton text={phrase.definition} size="sm" />
          </div>

          {/* Examples */}
          {examples.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
              <p
                style={{
                  margin:        0,
                  fontSize:      typography.fontSize.label,
                  fontWeight:    typography.fontWeight.semibold,
                  color:         colors.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Examples
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: spacing[3] }}>
                {examples.map((ex) => (
                  <li
                    key={ex}
                    style={{
                      display:        "flex",
                      alignItems:     "flex-start",
                      justifyContent: "space-between",
                      gap:            spacing[3],
                    }}
                  >
                    <p
                      style={{
                        margin:     0,
                        flex:       1,
                        fontSize:   typography.fontSize.body,
                        lineHeight: typography.lineHeight.relaxed,
                        color:      colors.text,
                      }}
                    >
                      • {ex}
                    </p>
                    <AudioButton text={ex} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Situations */}
          {phrase.situations.length > 0 && (
            <p
              style={{
                margin:     0,
                fontSize:   typography.fontSize.body,
                color:      colors.muted,
                lineHeight: typography.lineHeight.normal,
              }}
            >
              Used in: {phrase.situations.join(" · ")}
            </p>
          )}

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: colors.border }} />

          {/* Rating */}
          <RatingButtons onRate={onRate} />
        </div>
      )}
    </div>
  );
}
