"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors, radius, spacing, typography } from "@/styles/theme";
import { BOTTOM_NAV_HEIGHT } from "./ScreenContainer";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  primary?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/",        label: "Home",    icon: "🏠" },
  { href: "/study",   label: "Study",   icon: "▶",  primary: true },
  { href: "/browse",  label: "Browse",  icon: "🔍" },
  { href: "/saved",   label: "Saved",   icon: "♡"  },
  { href: "/stats",   label: "Stats",   icon: "📊" },
  { href: "/profile", label: "Profile", icon: "👤" },
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
        position:        "fixed",
        left:            0,
        right:           0,
        bottom:          0,
        zIndex:          50,
        height:          BOTTOM_NAV_HEIGHT,
        paddingBottom:   "env(safe-area-inset-bottom, 0px)",
        backgroundColor: colors.surface,
        borderTop:       `1px solid ${colors.border}`,
      }}
    >
      <ul
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          height:              "100%",
          margin:              0,
          padding:             `0 ${spacing[1]}`,
          listStyle:           "none",
          alignItems:          "stretch",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);

          if (item.primary) {
            return (
              <li
                key={item.href}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  padding:        `${spacing[2]} ${spacing[1]}`,
                }}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    display:         "flex",
                    flexDirection:   "column",
                    alignItems:      "center",
                    justifyContent:  "center",
                    gap:             spacing[1],
                    minWidth:        "48px",
                    minHeight:       "48px",
                    paddingInline:   spacing[3],
                    paddingBlock:    spacing[2],
                    borderRadius:    radius.pill,
                    backgroundColor: active ? colors.accent : colors.elevated,
                    border:          `1px solid ${active ? colors.accent : colors.border}`,
                    textDecoration:  "none",
                    color:           active ? colors.text : colors.muted,
                    fontSize:        typography.fontSize.label,
                    fontWeight:      typography.fontWeight.semibold,
                    fontFamily:      typography.fontFamily.sans,
                    transition:      "background-color 150ms ease, color 150ms ease",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: typography.fontSize.bodyLg,
                      lineHeight: 1,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          }

          return (
            <li
              key={item.href}
              style={{ display: "flex" }}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={{
                  flex:           1,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            spacing[1],
                  minHeight:      "48px",
                  textDecoration: "none",
                  color:          active ? colors.accent : colors.muted,
                  fontSize:       typography.fontSize.label,
                  fontWeight:     active ? typography.fontWeight.semibold : typography.fontWeight.normal,
                  fontFamily:     typography.fontFamily.sans,
                  opacity:        active ? 1 : 0.75,
                  transition:     "color 150ms ease, opacity 150ms ease",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: typography.fontSize.bodyLg,
                    lineHeight: 1,
                  }}
                >
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
