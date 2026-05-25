import Link from "next/link";
import { colors, radius, spacing, tapTargetMin, typography } from "@/styles/theme";

export function EmptyQueueState() {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        textAlign:      "center",
        gap:            spacing[6],
        padding:        spacing[8],
        flex:           1,
      }}
    >
      <span style={{ fontSize: "4rem", lineHeight: 1 }} aria-hidden="true">
        📭
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
        <h2
          style={{
            margin:     0,
            fontSize:   typography.fontSize.phrase,
            fontWeight: typography.fontWeight.semibold,
            color:      colors.text,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          Queue is empty
        </h2>
        <p
          style={{
            margin:     0,
            fontSize:   typography.fontSize.body,
            lineHeight: typography.lineHeight.relaxed,
            color:      colors.muted,
            fontFamily: typography.fontFamily.sans,
            maxWidth:   "18rem",
          }}
        >
          Browse phrases and tap{" "}
          <strong style={{ color: colors.accent }}>+ Add to queue</strong> to
          start studying.
        </p>
      </div>

      <Link
        href="/browse"
        style={{
          display:         "inline-flex",
          alignItems:      "center",
          justifyContent:  "center",
          minHeight:       tapTargetMin,
          paddingInline:   spacing[8],
          borderRadius:    radius.pill,
          backgroundColor: colors.accent,
          color:           colors.text,
          textDecoration:  "none",
          fontSize:        typography.fontSize.body,
          fontWeight:      typography.fontWeight.semibold,
          fontFamily:      typography.fontFamily.sans,
        }}
      >
        Browse Phrases
      </Link>
    </div>
  );
}
