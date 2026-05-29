"use client";

interface BackgroundLayerProps {
  /** 0–360 deterministic seed used to tint the cinematic atmosphere. */
  hue: number;
  phraseId: string;
}

/**
 * Atmospheric, fully procedural cinematic backdrop.
 *
 * No external images are used (keeps it offline-safe and avoids remote-image
 * config). Two large blurred color blooms keyed to the phrase's hue create a
 * grayscale-leaning, dimmed canvas behind the content.
 */
export function BackgroundLayer({ hue, phraseId }: BackgroundLayerProps) {
  const bloomA = `hsla(${hue}, 45%, 30%, 0.55)`;
  const bloomB = `hsla(${(hue + 60) % 360}, 40%, 22%, 0.5)`;

  return (
    <div
      key={phraseId}
      className="reel-bg-fade"
      style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}
    >
      {/* Deep base */}
      <div style={{ position: "absolute", inset: 0, background: "var(--reel-bg)" }} />

      {/* Color blooms — blurred, dimmed, grayscale-leaning */}
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background: `radial-gradient(60% 50% at 65% 22%, ${bloomA} 0%, transparent 60%),
                       radial-gradient(55% 45% at 30% 80%, ${bloomB} 0%, transparent 65%)`,
          filter: "blur(28px) saturate(0.6) brightness(0.7)",
          opacity: 0.6,
          transform: "scale(1.1)",
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(120% 80% at 50% 30%, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Overlay gradient — pushes the bottom toward near-pure bg for legibility */}
      <div style={{ position: "absolute", inset: 0, background: "var(--reel-overlay)" }} />

      {/* Extra bottom fade for nav blending */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "10rem",
          background: "linear-gradient(to top, var(--reel-bg) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
