"use client";

interface PeekNextStripProps {
  nextPhrase: string;
  onSwipeUp: () => void;
}

/** Bottom "swipe up · next phrase" teaser — the addictive continuation engine. */
export function PeekNextStrip({ nextPhrase, onSwipeUp }: PeekNextStripProps) {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => {
        e.stopPropagation();
        onSwipeUp();
      }}
      className="reel-tappable"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
        padding: "14px 20px",
        background: "var(--reel-glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--reel-glass-border)",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        cursor: "pointer",
        textAlign: "left",
        touchAction: "manipulation",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--reel-text-muted)",
          }}
        >
          Swipe Up · Next Phrase
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--reel-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          &ldquo;{nextPhrase}&rdquo;
        </span>
      </div>

      <span
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--reel-glass-bg)",
          border: "1px solid var(--reel-glass-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "reel-peek-bounce 2.4s ease-in-out infinite",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--reel-text)" strokeWidth="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </span>
    </button>
  );
}
