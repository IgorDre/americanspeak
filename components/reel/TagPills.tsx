"use client";

import type { ReelTag, ReelTagColor } from "@/lib/reelPhrase";

const bgMap: Record<ReelTagColor, string> = {
  amber: "rgba(245,166,35,0.18)",
  red: "rgba(239,68,68,0.18)",
  green: "rgba(52,211,153,0.18)",
  blue: "rgba(96,165,250,0.18)",
  purple: "rgba(167,139,250,0.18)",
};

const textMap: Record<ReelTagColor, string> = {
  amber: "#f5a623",
  red: "#f87171",
  green: "#34d399",
  blue: "#60a5fa",
  purple: "#a78bfa",
};

export function TagPills({ tags }: { tags: ReelTag[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {tags.map((tag) => (
        <span
          key={tag.label}
          style={{
            padding: "5px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: bgMap[tag.color],
            color: textMap[tag.color],
            border: `1px solid ${textMap[tag.color]}40`,
          }}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
