"use client";

const BARS = [3, 6, 9, 12, 9, 7, 11, 8, 5, 10];

export function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{ display: "flex", alignItems: "center", gap: 2, height: 26 }}
    >
      {BARS.map((baseH, i) => (
        <span
          key={i}
          style={{
            width: 2,
            height: baseH * 2,
            borderRadius: 999,
            background: "var(--reel-waveform)",
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
