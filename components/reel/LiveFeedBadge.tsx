"use client";

import { motion } from "framer-motion";

export function LiveFeedBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <motion.span
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--ring-text)",
          boxShadow: "0 0 6px var(--ring)",
          display: "block",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        Live Feed
      </span>
    </div>
  );
}
