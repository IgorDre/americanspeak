"use client";

import { useStats } from "@/hooks/useStats";
import { useSettings } from "@/hooks/useSettings";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { colors, spacing, typography } from "@/styles/theme";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileIdentity } from "./ProfileIdentity";
import { ProfileStats } from "./ProfileStats";
import { ProfileSettings } from "./ProfileSettings";

export function ProfileScreen() {
  const { stats } = useStats();
  const { settings } = useSettings();

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

            {/* ── Header: avatar + title + rank ──────────────────────────── */}
            <ProfileHeader learned={stats.learned} />

            {/* ── Identity: vibe + strongest areas ───────────────────────── */}
            <ProfileIdentity
              learned={stats.learned}
              enabledCategories={settings.enabledCategories}
            />

            {/* ── Stats: 2×2 compact grid ────────────────────────────────── */}
            <div>
              <p
                style={{
                  margin:        0,
                  marginBottom:  spacing[3],
                  fontSize:      typography.fontSize.label,
                  fontWeight:    typography.fontWeight.semibold,
                  color:         colors.muted,
                  fontFamily:    typography.fontFamily.sans,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Progress
              </p>
              <ProfileStats />
            </div>

            {/* ── Settings: collapsible sections ─────────────────────────── */}
            <div>
              <p
                style={{
                  margin:        0,
                  marginBottom:  spacing[3],
                  fontSize:      typography.fontSize.label,
                  fontWeight:    typography.fontWeight.semibold,
                  color:         colors.muted,
                  fontFamily:    typography.fontFamily.sans,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Settings
              </p>
              <ProfileSettings />
            </div>

          </div>
        </ScreenContainer>
      </main>
      <BottomNavigation />
    </>
  );
}
