"use client";

export function LiveFeedBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--reel-accent)",
          animation: "reel-dot-pulse 2s ease-in-out infinite",
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--reel-text-muted)",
        }}
      >
        Live Feed
      </span>
    </div>
  );
}
