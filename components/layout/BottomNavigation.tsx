"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ACCENT = "#f5a623";
const INACTIVE_ICON = "rgba(255,255,255,0.38)";
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
        fill={active ? ACCENT : "none"}
        stroke={active ? ACCENT : INACTIVE_ICON}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
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
    id: "practice",
    label: "Practice",
    path: "/practice",
    Icon: ({ active }: { active: boolean }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={active ? ACCENT : "none"}
        stroke={active ? ACCENT : INACTIVE_ICON}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    path: "/saved",
    Icon: ({ active }: { active: boolean }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={active ? ACCENT : "none"}
        stroke={active ? ACCENT : INACTIVE_ICON}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
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
            <tab.Icon active={active} />
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
          </motion.button>
        );
      })}
    </nav>
  );
}
