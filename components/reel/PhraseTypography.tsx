"use client";

import type { PhraseState } from "@/lib/usePhraseStates";

interface PhraseTypographyProps {
  text: string;
  accentWord: string;
  phonetic: string;
  context: string;
  category: string;
  phraseState: PhraseState;
}

/** The emotional centerpiece — large cinematic phrase with one accent word. */
export function PhraseTypography({
  text,
  accentWord,
  phonetic,
  context,
  category,
  phraseState,
}: PhraseTypographyProps) {
  const renderPhrase = () => {
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === accentWord.toLowerCase() ? (
        <span key={i} style={{ color: "var(--reel-accent)" }}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  };

  return (
    <div
      className="reel-content-rise"
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {/* Category badge + learning badge row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          alignSelf: "flex-start",
        }}
      >
        {/* Category badge — ring-green ambient style */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            width: "fit-content",
            padding: "5px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            background: "rgba(180, 220, 80, 0.12)",
            border: "1px solid rgba(180, 220, 80, 0.28)",
            color: "rgb(180, 220, 80)",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 11 }}>✦</span>
          <span>{category}</span>
        </div>

        {/* Learning badge — shows when the phrase is in the learning state */}
        {phraseState.status === "learning" && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(245,166,35,0.1)",
              border: "1px solid rgba(245,166,35,0.25)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--accent)",
            }}
          >
            ✓ Learning
            {phraseState.learnCount > 1 && (
              <span style={{ opacity: 0.55 }}>· {phraseState.learnCount}×</span>
            )}
          </div>
        )}

        {/* Returned-after-skip hint — edge case when a skipped phrase reappears */}
        {phraseState.status === "skipped" && phraseState.skippedUntil && (
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              fontWeight: 500,
            }}
          >
            Returned after skip
          </div>
        )}
      </div>

      {/* Main phrase — scales with the column width (container query), balanced wrap */}
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.55rem, 8.2cqi, 2.5rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          color: "var(--reel-text)",
          textWrap: "balance",
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        &ldquo;{renderPhrase()}&rdquo;
      </h1>

      {/* Phonetic */}
      <p
        style={{
          margin: 0,
          fontSize: "clamp(11px, 3.4cqi, 13px)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          color: "var(--reel-text-muted)",
        }}
      >
        {phonetic}
      </p>

      {/* Context — left ring-green border, clamped to avoid overflow on short screens */}
      <div style={{ paddingLeft: 14, borderLeft: "2px solid rgba(180, 220, 80, 0.45)" }}>
        <p
          style={{
            margin: 0,
            fontSize: "clamp(13px, 3.7cqi, 14px)",
            lineHeight: 1.55,
            color: "var(--reel-text-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {context}
        </p>
      </div>
    </div>
  );
}
