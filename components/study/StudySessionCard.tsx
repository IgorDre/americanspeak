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
  phrase: Phrase;
  onRate: (rating: RatingKey) => void;
}

function registerVariant(r: Register) {
  if (r === Register.CASUAL) return "casual"  as const;
  if (r === Register.FORMAL) return "formal"  as const;
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
        flex:            1,
        display:         "flex",
        flexDirection:   "column",
        borderRadius:    radius.card,
        backgroundColor: colors.surface,
        border:          `1px solid ${colors.border}`,
        boxShadow:       shadows.elevated,
        overflow:        "hidden",
        position:        "relative",
      }}
    >
      {/* Subtle ambient gradient — ready for future cinematic backgrounds */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          inset:         0,
          background:    "radial-gradient(ellipse at 50% 25%, rgba(167, 139, 250, 0.05) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* ── FRONT — always visible ─────────────────────────────── */}

      {/* Badges header */}
      <header
        style={{
          display:    "flex",
          flexWrap:   "wrap",
          gap:        spacing[2],
          padding:    `${spacing[4]} ${spacing[5]}`,
          flexShrink: 0,
        }}
      >
        <PillBadge label={phrase.type.replace(/_/g, " ")} variant="neutral" />
        <PillBadge
          label={phrase.register.charAt(0) + phrase.register.slice(1).toLowerCase()}
          variant={registerVariant(phrase.register)}
        />
        <PillBadge
          label={fmtFrequency(phrase.frequency)}
          variant={frequencyVariant(phrase.frequency)}
        />
      </header>

      {/* Phrase hero — centered, dominates the card */}
      <div
        style={{
          flex:           revealed ? "none" : 1,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          textAlign:      "center",
          padding:        `${spacing[5]} ${spacing[5]}`,
          gap:            spacing[4],
        }}
      >
        <h2
          style={{
            margin:        0,
            fontSize:      revealed ? typography.fontSize.phraseHero : typography.fontSize.phraseXl,
            fontWeight:    typography.fontWeight.semibold,
            color:         colors.text,
            lineHeight:    typography.lineHeight.tight,
            fontFamily:    typography.fontFamily.sans,
            letterSpacing: "-0.01em",
            transition:    "font-size 200ms ease",
          }}
        >
          {phrase.term}
        </h2>
        <p
          style={{
            margin:     0,
            fontSize:   typography.fontSize.ipa,
            fontFamily: typography.fontFamily.mono,
            color:      colors.muted,
          }}
        >
          {phrase.pronunciation}
        </p>

        <AudioControls text={phrase.term} />
      </div>

      {/* ── BACK — revealed after tap ──────────────────────────── */}
      {!revealed ? (
        <div
          style={{
            padding:    `0 ${spacing[5]} ${spacing[5]}`,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => setReveal(true)}
            style={{
              width:           "100%",
              minHeight:       `${tapTargetMin}px`,
              borderRadius:    radius.pill,
              border:          `1px solid ${colors.border}`,
              backgroundColor: colors.elevated,
              color:           colors.muted,
              fontSize:        typography.fontSize.body,
              fontWeight:      typography.fontWeight.medium,
              fontFamily:      typography.fontFamily.sans,
              cursor:          "pointer",
              transition:      "background-color 150ms ease, color 150ms ease",
            }}
          >
            Reveal Meaning ↓
          </button>
        </div>
      ) : (
        <div
          className="as-reveal-enter"
          style={{
            flex:          1,
            display:       "flex",
            flexDirection: "column",
            overflowY:     "auto",
            overscrollBehavior: "contain",
          }}
        >
          {/* Scrollable content area */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           spacing[4],
              padding:       `0 ${spacing[5]} ${spacing[4]}`,
              flex:          1,
            }}
          >
            {/* Definition */}
            <div
              style={{
                display:         "flex",
                alignItems:      "flex-start",
                justifyContent:  "space-between",
                gap:             spacing[3],
                padding:         spacing[4],
                borderRadius:    radius.md,
                backgroundColor: colors.elevated,
                border:          `1px solid ${colors.border}`,
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
                <ul
                  style={{
                    margin:    0,
                    padding:   0,
                    listStyle: "none",
                    display:   "flex",
                    flexDirection: "column",
                    gap:       spacing[3],
                  }}
                >
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
          </div>

          {/* Rating — anchored at bottom */}
          <div
            style={{
              padding:       `${spacing[3]} ${spacing[5]} ${spacing[5]}`,
              borderTop:     `1px solid ${colors.border}`,
              flexShrink:    0,
            }}
          >
            <RatingButtons onRate={onRate} />
          </div>
        </div>
      )}
    </div>
  );
}
