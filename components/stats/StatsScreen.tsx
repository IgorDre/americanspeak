"use client";

import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useStats } from "@/hooks/useStats";
import { colors, radius, shadows, spacing, typography } from "@/styles/theme";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  accent?: boolean;
}

function StatCard({ icon, label, value, accent = false }: StatCardProps) {
  return (
    <div
      style={{
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        gap:             spacing[2],
        padding:         spacing[5],
        borderRadius:    radius.card,
        backgroundColor: colors.surface,
        border:          `1px solid ${colors.border}`,
        boxShadow:       shadows.elevated,
        textAlign:       "center",
      }}
    >
      <span style={{ fontSize: "2rem", lineHeight: 1 }} aria-hidden="true">
        {icon}
      </span>
      <span
        style={{
          fontSize:   typography.fontSize.phraseLg,
          fontWeight: typography.fontWeight.semibold,
          color:      accent ? colors.accent : colors.text,
          fontFamily: typography.fontFamily.sans,
          lineHeight: typography.lineHeight.tight,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize:   typography.fontSize.body,
          color:      colors.muted,
          fontFamily: typography.fontFamily.sans,
          lineHeight: typography.lineHeight.normal,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function StatsScreen() {
  const { stats, loading } = useStats();

  return (
    <>
      <main
        style={{
          flex:            1,
          backgroundColor: colors.bg,
          overflowY:       "auto",
        }}
      >
        <ScreenContainer withBottomNav>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing[6] }}>

            {/* ── Header ────────────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <h1
                style={{
                  margin:     0,
                  fontSize:   typography.fontSize.phraseLg,
                  fontWeight: typography.fontWeight.semibold,
                  color:      colors.text,
                  fontFamily: typography.fontFamily.sans,
                }}
              >
                Your Stats
              </h1>
              <p
                style={{
                  margin:     0,
                  fontSize:   typography.fontSize.body,
                  color:      colors.muted,
                  fontFamily: typography.fontFamily.sans,
                }}
              >
                Track your learning progress
              </p>
            </div>

            {/* ── Stats grid ────────────────────────────────────────────── */}
            {loading ? (
              <div
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  minHeight:      "12rem",
                }}
              >
                <span
                  style={{
                    color:      colors.muted,
                    fontFamily: typography.fontFamily.sans,
                    fontSize:   typography.fontSize.body,
                  }}
                >
                  Loading…
                </span>
              </div>
            ) : (
              <div
                style={{
                  display:             "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap:                 spacing[3],
                }}
              >
                <StatCard
                  icon="🔥"
                  label="Day streak"
                  value={stats.streak}
                  accent={stats.streak > 0}
                />
                <StatCard
                  icon="📚"
                  label="Phrases learned"
                  value={stats.learned}
                />
                <StatCard
                  icon="📋"
                  label="Queue size"
                  value={stats.queueSize}
                />
                <StatCard
                  icon="🎯"
                  label="Accuracy rate"
                  value="—"
                />
              </div>
            )}

            {/* ── Motivational footer ───────────────────────────────────── */}
            {!loading && stats.streak > 0 && (
              <p
                style={{
                  margin:     0,
                  textAlign:  "center",
                  fontSize:   typography.fontSize.body,
                  color:      colors.muted,
                  fontFamily: typography.fontFamily.sans,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                Keep going — {stats.streak} day{stats.streak === 1 ? "" : "s"} and counting 🔥
              </p>
            )}

          </div>
        </ScreenContainer>
      </main>
      <BottomNavigation />
    </>
  );
}
