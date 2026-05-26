"use client";

import { AudioControls } from "@/components/ui/AudioButton";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";
import type { Phrase } from "@/types";

export interface PhraseOfDaySectionProps {
  phrase: Phrase;
  isQueued?: boolean;
  isSaved?: boolean;
  onAddToQueue?: (phraseId: string) => void;
  onRemoveFromQueue?: (phraseId: string) => void;
  onToggleSave?: (phraseId: string) => void;
}

export function PhraseOfDaySection({
  phrase,
  isQueued = false,
  isSaved = false,
  onAddToQueue,
  onRemoveFromQueue,
  onToggleSave,
}: PhraseOfDaySectionProps) {
  const handleQueueToggle = () => {
    if (isQueued) {
      onRemoveFromQueue?.(phrase.id);
    } else {
      onAddToQueue?.(phrase.id);
    }
  };

  return (
    <section
      aria-label="Phrase of the Day"
      style={{
        flex:            1,
        display:         "flex",
        flexDirection:   "column",
        marginInline:    spacing[4],
        borderRadius:    radius.card,
        backgroundColor: colors.surface,
        border:          `1px solid ${colors.border}`,
        overflow:        "hidden",
        position:        "relative",
      }}
    >
      {/* Ambient gradient overlay — prepares surface for future cinematic backgrounds */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          inset:      0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(167, 139, 250, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Label */}
      <div
        style={{
          padding:     `${spacing[4]} ${spacing[5]} 0`,
          flexShrink:  0,
        }}
      >
        <span
          style={{
            fontSize:      typography.fontSize.label,
            fontWeight:    typography.fontWeight.semibold,
            color:         colors.accent,
            fontFamily:    typography.fontFamily.sans,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Phrase of the Day
        </span>
      </div>

      {/* Phrase hero — vertically centered, dominates the surface */}
      <div
        style={{
          flex:           1,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          padding:        `${spacing[6]} ${spacing[5]}`,
          textAlign:      "center",
          gap:            spacing[4],
        }}
      >
        <h2
          style={{
            margin:      0,
            fontSize:    typography.fontSize.phraseXl,
            fontWeight:  typography.fontWeight.semibold,
            lineHeight:  typography.lineHeight.tight,
            color:       colors.text,
            fontFamily:  typography.fontFamily.sans,
            letterSpacing: "-0.01em",
          }}
        >
          &ldquo;{phrase.term}&rdquo;
        </h2>

        <p
          style={{
            margin:     0,
            fontSize:   typography.fontSize.ipa,
            fontFamily: typography.fontFamily.mono,
            color:      colors.muted,
            lineHeight: typography.lineHeight.normal,
          }}
        >
          {phrase.pronunciation}
        </p>

        <AudioControls text={phrase.term} />

        <p
          style={{
            margin:     0,
            fontSize:   typography.fontSize.body,
            lineHeight: typography.lineHeight.relaxed,
            color:      colors.muted,
            maxWidth:   "22rem",
          }}
        >
          {phrase.definition}
        </p>

        {phrase.situations.length > 0 && (
          <p
            style={{
              margin:     0,
              fontSize:   typography.fontSize.label,
              color:      colors.muted,
              fontFamily: typography.fontFamily.sans,
              opacity:    0.75,
            }}
          >
            {phrase.situations.join(" · ")}
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div
        style={{
          display:       "flex",
          gap:           spacing[3],
          padding:       `${spacing[4]} ${spacing[5]}`,
          flexShrink:    0,
          borderTop:     `1px solid ${colors.border}`,
        }}
      >
        <button
          type="button"
          onClick={handleQueueToggle}
          style={{
            flex:            1,
            minHeight:       `${tapTargetMin}px`,
            paddingInline:   spacing[4],
            borderRadius:    radius.pill,
            border:          "none",
            backgroundColor: isQueued ? colors.elevated : colors.accent,
            color:           colors.text,
            fontSize:        typography.fontSize.body,
            fontWeight:      typography.fontWeight.medium,
            fontFamily:      typography.fontFamily.sans,
            cursor:          "pointer",
            transition:      "background-color 150ms ease",
          }}
        >
          {isQueued ? "✓ In queue" : "+ Add to queue"}
        </button>
        <button
          type="button"
          onClick={() => onToggleSave?.(phrase.id)}
          aria-label={isSaved ? "Remove from saved" : "Save phrase"}
          aria-pressed={isSaved}
          style={{
            minWidth:        `${tapTargetMin}px`,
            minHeight:       `${tapTargetMin}px`,
            paddingInline:   spacing[4],
            borderRadius:    radius.pill,
            border:          `1px solid ${isSaved ? colors.accent : colors.border}`,
            backgroundColor: isSaved ? "rgba(167, 139, 250, 0.15)" : colors.elevated,
            color:           isSaved ? colors.accent : colors.muted,
            fontSize:        typography.fontSize.phrase,
            cursor:          "pointer",
            transition:      "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
          }}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>
    </section>
  );
}
