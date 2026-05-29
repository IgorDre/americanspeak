"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePhraseStates } from "@/lib/usePhraseStates";

const ACCENT = "var(--accent)";
const INACTIVE_ICON = "rgba(255,255,255,0.32)";
const INACTIVE_LABEL = "rgba(255,255,255,0.35)";

const tabs = [
  {
    id: "discover",
    label: "Discover",
    path: "/",
    Icon: ({ active }: { active: boolean }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? ACCENT : INACTIVE_ICON}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    id: "browse",
    label: "Browse",
    path: "/browse",
    Icon: ({ active }: { active: boolean }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? ACCENT : INACTIVE_ICON}
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "learning",
    label: "Learning",
    path: "/saved",
    Icon: ({ active }: { active: boolean }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? ACCENT : INACTIVE_ICON}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    Icon: ({ active }: { active: boolean }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? ACCENT : INACTIVE_ICON}
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { states } = usePhraseStates();
  const learningCount = Object.values(states).filter(
    (s) => s.status === "learning",
  ).length;

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: `10px 4px calc(env(safe-area-inset-bottom) + 6px)`,
        background: "rgba(8,8,8,0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => {
        const active =
          tab.path === "/"
            ? pathname === "/" || pathname === ""
            : pathname.startsWith(tab.path);
        return (
          <motion.button
            key={tab.id}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => {
              e.stopPropagation();
              router.push(tab.path);
            }}
            aria-current={active ? "page" : undefined}
            whileTap={{ scale: 0.85 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 10px",
              touchAction: "manipulation",
            }}
          >
            <div style={{ position: "relative", display: "flex" }}>
              <tab.Icon active={active} />
              {tab.id === "learning" && learningCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    minWidth: 16,
                    height: 16,
                    paddingInline: 3,
                    boxSizing: "border-box",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {learningCount > 99 ? "99+" : learningCount}
                </div>
              )}
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: active ? 700 : 400,
                color: active ? ACCENT : INACTIVE_LABEL,
                letterSpacing: "0.02em",
              }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  marginTop: 2,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
