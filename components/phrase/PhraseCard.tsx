"use client";

import { AudioButton, AudioControls } from "@/components/ui/AudioButton";
import { PillBadge, type PillBadgeVariant } from "@/components/ui/PillBadge";
import { Frequency, Register, type Phrase } from "@/types";
import {
  colors,
  radius,
  shadows,
  spacing,
  tapTargetMin,
  typography,
} from "@/styles/theme";

export interface PhraseCardProps {
  phrase: Phrase;
  isQueued?: boolean;
  isSaved?: boolean;
  onAddToQueue?: (phraseId: string) => void;
  onRemoveFromQueue?: (phraseId: string) => void;
  onToggleSave?: (phraseId: string) => void;
}

function formatRegisterLabel(register: Register): string {
  return register.charAt(0) + register.slice(1).toLowerCase();
}

function registerToVariant(register: Register): PillBadgeVariant {
  switch (register) {
    case Register.CASUAL:
      return "casual";
    case Register.NEUTRAL:
      return "neutral";
    case Register.FORMAL:
      return "formal";
    default:
      return "neutral";
  }
}

function formatFrequencyLabel(frequency: Frequency): string {
  return frequency
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function frequencyToVariant(frequency: Frequency): PillBadgeVariant {
  return frequency === Frequency.OCCASIONAL || frequency === Frequency.RARE
    ? "rare"
    : "common";
}

function formatPhraseType(type: string): string {
  return type.replace(/_/g, " ");
}

export function PhraseCard({
  phrase,
  isQueued = false,
  isSaved = false,
  onAddToQueue,
  onRemoveFromQueue,
  onToggleSave,
}: PhraseCardProps) {
  const examples = [phrase.example1, phrase.example2, phrase.example3].filter(
    (example): example is string => Boolean(example),
  );

  const handleQueueClick = () => {
    if (isQueued) {
      onRemoveFromQueue?.(phrase.id);
      return;
    }
    onAddToQueue?.(phrase.id);
  };

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[4],
        padding: spacing[5],
        borderRadius: radius.card,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.elevated,
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: spacing[2],
        }}
      >
        <PillBadge label={formatPhraseType(phrase.type)} variant="neutral" />
        <PillBadge
          label={formatRegisterLabel(phrase.register)}
          variant={registerToVariant(phrase.register)}
        />
        <PillBadge
          label={formatFrequencyLabel(phrase.frequency)}
          variant={frequencyToVariant(phrase.frequency)}
        />
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
        <h2
          style={{
            margin: 0,
            fontSize: typography.fontSize.phraseLg,
            fontWeight: typography.fontWeight.medium,
            lineHeight: typography.lineHeight.tight,
            color: colors.text,
          }}
        >
          {phrase.term}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: typography.fontSize.ipa,
            fontFamily: typography.fontFamily.mono,
            color: colors.muted,
            lineHeight: typography.lineHeight.normal,
          }}
        >
          {phrase.pronunciation}
        </p>
      </div>

      <AudioControls text={phrase.term} />

      <section style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: spacing[3],
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                marginBottom: spacing[1],
                fontSize: typography.fontSize.label,
                fontWeight: typography.fontWeight.medium,
                color: colors.muted,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Meaning
            </p>
            <p
              style={{
                margin: 0,
                fontSize: typography.fontSize.bodyLg,
                lineHeight: typography.lineHeight.relaxed,
                color: colors.text,
              }}
            >
              {phrase.definition}
            </p>
          </div>
          <AudioButton text={phrase.definition} size="sm" />
        </div>
      </section>

      {examples.length > 0 ? (
        <section style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
          <p
            style={{
              margin: 0,
              fontSize: typography.fontSize.label,
              fontWeight: typography.fontWeight.medium,
              color: colors.muted,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Examples
          </p>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: spacing[3],
            }}
          >
            {examples.map((example) => (
              <li
                key={example}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: spacing[3],
                }}
              >
                <p
                  style={{
                    margin: 0,
                    flex: 1,
                    fontSize: typography.fontSize.body,
                    lineHeight: typography.lineHeight.relaxed,
                    color: colors.text,
                  }}
                >
                  • {example}
                </p>
                <AudioButton text={example} size="sm" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phrase.situations.length > 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: typography.fontSize.body,
            lineHeight: typography.lineHeight.normal,
            color: colors.muted,
          }}
        >
          Used in: {phrase.situations.join(" · ")}
        </p>
      ) : null}

      <footer
        style={{
          display: "flex",
          gap: spacing[3],
          paddingTop: spacing[2],
        }}
      >
        <button
          type="button"
          onClick={handleQueueClick}
          style={{
            flex: 1,
            minHeight: tapTargetMin,
            paddingInline: spacing[4],
            borderRadius: radius.pill,
            border: "none",
            backgroundColor: isQueued ? colors.elevated : colors.accent,
            color: colors.text,
            fontSize: typography.fontSize.body,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.sans,
            cursor: "pointer",
          }}
        >
          {isQueued ? "Remove from queue" : "+ Add to queue"}
        </button>
        <button
          type="button"
          onClick={() => onToggleSave?.(phrase.id)}
          aria-label={isSaved ? "Remove from saved" : "Save phrase"}
          aria-pressed={isSaved}
          style={{
            minWidth: tapTargetMin,
            minHeight: tapTargetMin,
            paddingInline: spacing[4],
            borderRadius: radius.pill,
            border: `1px solid ${colors.border}`,
            backgroundColor: isSaved ? colors.accent : colors.elevated,
            color: colors.text,
            fontSize: typography.fontSize.phrase,
            cursor: "pointer",
          }}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </footer>
    </article>
  );
}
