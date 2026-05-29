"use client";

/**
 * Two large concentric ring decorations positioned center-right and partially
 * cropped by the viewport — matching the reference mockup. Pure CSS pulse.
 */
export function FloatingRings() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Outer ring — large, thin, subtle */}
      <div
        className="reel-ring-outer"
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          top: "4%",
          left: "50%",
          transform: "translateX(-20%)",
          borderRadius: "50%",
          border: "1px solid rgba(180, 220, 80, 0.15)",
          animation: "reel-ring-pulse 6s ease-in-out infinite",
        }}
      />

      {/* Mid ring */}
      <div
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          top: "12%",
          left: "50%",
          transform: "translateX(-20%)",
          borderRadius: "50%",
          border: "1px solid rgba(180, 220, 80, 0.15)",
          opacity: 0.6,
        }}
      />

      {/* Inner glow circle (the soft colored fill in the reference) */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          top: "14%",
          left: "52%",
          transform: "translateX(-25%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180, 220, 80, 0.08) 0%, transparent 70%)",
          animation: "reel-glow-pulse 8s ease-in-out infinite 1s",
        }}
      />
    </div>
  );
}
