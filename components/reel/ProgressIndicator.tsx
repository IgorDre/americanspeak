"use client";

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const progress = total > 1 ? current / (total - 1) : 0;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right: 0,
        top: "4rem",
        bottom: "6rem",
        width: 3,
        zIndex: 20,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 999,
      }}
    >
      <div
        style={{
          width: "100%",
          height: `${progress * 100}%`,
          background: "var(--reel-progress)",
          borderRadius: 999,
          boxShadow: "0 0 8px var(--reel-accent-glow)",
          transition: "height 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />
    </div>
  );
}
