"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors, spacing, typography } from "@/styles/theme";
import { BOTTOM_NAV_HEIGHT } from "./ScreenContainer";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/study", label: "Study", icon: "▶" },
  { href: "/browse", label: "Browse", icon: "🔍" },
  { href: "/saved", label: "Saved", icon: "♡" },
  { href: "/stats", label: "Stats", icon: "📊" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        height: BOTTOM_NAV_HEIGHT,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          height: "100%",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <li key={item.href} style={{ display: "flex" }}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: spacing[1],
                  minHeight: spacing[12],
                  textDecoration: "none",
                  color: active ? colors.accent : colors.muted,
                  fontSize: typography.fontSize.label,
                  fontWeight: active
                    ? typography.fontWeight.semibold
                    : typography.fontWeight.normal,
                  fontFamily: typography.fontFamily.sans,
                  transition: "color 150ms ease",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: typography.fontSize.bodyLg }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
