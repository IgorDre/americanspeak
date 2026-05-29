"use client";

import { motion } from "framer-motion";

function ChevronGroup({ direction, label }: { direction: "left" | "right"; label: string }) {
  const isLeft = direction === "left";

  // Cascade direction:
  // save (left): animation flows right→left  (rightmost chevron lights first)
  // skip (right): animation flows left→right (leftmost chevron lights first)
  const delays = isLeft ? [0.28, 0.14, 0] : [0, 0.14, 0.28];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        flexDirection: isLeft ? "row" : "row-reverse",
      }}
    >
      {/* Three chevrons */}
      <div style={{ display: "flex", gap: "1px" }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: delays[i],
              ease: "easeInOut",
            }}
            style={{
              fontSize: "12px",
              color: "var(--reel-accent)",
              lineHeight: 1,
              display: "block",
            }}
          >
            {isLeft ? "‹" : "›"}
          </motion.span>
        ))}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--reel-accent)",
          opacity: 0.65,
          marginLeft: isLeft ? "4px" : 0,
          marginRight: isLeft ? 0 : "4px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function SwipeHints() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "0 2px",
      }}
    >
      <ChevronGroup direction="left" label="save" />
      <ChevronGroup direction="right" label="skip" />
    </div>
  );
}
