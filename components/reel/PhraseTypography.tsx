"use client";

interface PhraseTypographyProps {
  text: string;
  accentWord: string;
  phonetic: string;
  context: string;
  category: string;
}

/** The emotional centerpiece — large cinematic phrase with one accent word. */
export function PhraseTypography({
  text,
  accentWord,
  phonetic,
  context,
  category,
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
      {/* Category badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          alignSelf: "flex-start",
          padding: "6px 12px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          background: "var(--reel-accent-muted)",
          border: "1px solid var(--reel-glass-border)",
          color: "var(--reel-accent)",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 11 }}>✦</span>
        <span>{category}</span>
      </div>

      {/* Main phrase — scales with the column width (container query), balanced wrap */}
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(1.55rem, 8.2cqi, 2.5rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
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

      {/* Context — left amber border, clamped to avoid overflow on short screens */}
      <div style={{ paddingLeft: 14, borderLeft: "2px solid var(--reel-accent-muted)" }}>
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
