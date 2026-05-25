import type { CSSProperties, ReactNode } from "react";
import { colors, spacing, typography } from "@/styles/theme";

export const BOTTOM_NAV_HEIGHT = "4.5rem";

export interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  /** Reserve space for fixed bottom navigation. */
  withBottomNav?: boolean;
  style?: CSSProperties;
}

export function ScreenContainer({
  children,
  className,
  withBottomNav = false,
  style,
}: ScreenContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "32rem",
        marginInline: "auto",
        paddingInline: spacing[4],
        paddingTop: spacing[4],
        paddingBottom: withBottomNav
          ? `calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px) + ${spacing[4]})`
          : spacing[4],
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: typography.fontFamily.sans,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
