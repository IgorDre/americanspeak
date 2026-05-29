"use client";

const BARS = [4, 8, 13, 17, 12, 7, 15, 10, 5, 14, 9, 16, 6, 13, 11, 8, 15, 7, 12, 10, 14, 6];

export function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 28,
        gap: 0,
      }}
    >
      {BARS.map((baseH, i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: baseH * 1.5,
            minHeight: 4,
            flexShrink: 0,
            borderRadius: 999,
            background: "var(--ring-text)",
            transformOrigin: "center",
            opacity: isPlaying ? 1 : 0.4,
            animation: isPlaying
              ? `reel-wave ${0.5 + (i % 5) * 0.09}s ease-in-out ${i * 0.04}s infinite`
              : "none",
            transform: isPlaying ? undefined : "scaleY(0.5)",
            transition: "opacity 200ms ease, transform 200ms ease",
          }}
        />
      ))}
    </div>
  );
}
