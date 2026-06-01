"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ActionRailProps {
  likes: number;
  onShare?: () => void;
  onHide: () => void;
  onReport: () => void;
  onCopy: () => void;
  onViewDetails: () => void;
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

interface GlassButtonProps {
  children: React.ReactNode;
  label?: string;
  active?: boolean;
  ariaLabel: string;
  ariaPressed?: boolean;
  onActivate?: () => void;
}

function GlassButton({
  children,
  label,
  active,
  ariaLabel,
  ariaPressed,
  onActivate,
}: GlassButtonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => {
          e.stopPropagation();
          onActivate?.();
        }}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        className="reel-tappable"
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: active ? "rgba(245,166,35,0.08)" : "var(--reel-glass-bg)",
          border: `1px solid ${active ? "rgba(245,166,35,0.45)" : "var(--reel-glass-border)"}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          touchAction: "manipulation",
          color: active ? "var(--accent)" : "rgba(255,255,255,0.55)",
        }}
      >
        {children}
      </button>
      {label ? (
        <span style={{ fontSize: 10, color: "var(--reel-text-muted)" }}>{label}</span>
      ) : null}
    </div>
  );
}

export function ActionRail({
  likes,
  onShare,
  onHide,
  onReport,
  onCopy,
  onViewDetails,
}: ActionRailProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      {/* Like */}
      <GlassButton
        label={formatCount(likeCount)}
        active={liked}
        ariaLabel={liked ? "Unlike" : "Like"}
        ariaPressed={liked}
        onActivate={handleLike}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </GlassButton>

      {/* Share */}
      <GlassButton label="Share" ariaLabel="Share phrase" onActivate={onShare}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </GlassButton>

      {/* More — morphs upward from button bottom edge */}
      <div style={{ position: "relative" }}>
        {moreOpen && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 49 }}
            onPointerUp={(e) => {
              e.stopPropagation();
              setMoreOpen(false);
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {!moreOpen ? (
            <motion.button
              key="more-closed"
              type="button"
              layoutId="more-surface"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => {
                e.stopPropagation();
                setMoreOpen(true);
              }}
              aria-label="More options"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--reel-glass-bg)",
                border: "1px solid var(--reel-glass-border)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.55)",
                fontSize: "18px",
                touchAction: "manipulation",
                position: "relative",
                zIndex: 50,
              }}
            >
              ···
            </motion.button>
          ) : (
            <motion.div
              key="more-open"
              layoutId="more-surface"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 204,
                borderRadius: "16px",
                background: "rgba(14,14,14,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
                overflow: "hidden",
                zIndex: 50,
                transformOrigin: "bottom right",
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.18 }}
              >
                {[
                  { label: "Hide", sublabel: "Never show this phrase", icon: "⊘", action: onHide },
                  { label: "Report", sublabel: "Flag an error", icon: "⚑", action: onReport },
                  { label: "Copy phrase", sublabel: null, icon: "⎘", action: onCopy },
                  { label: "View details", sublabel: null, icon: "↗", action: onViewDetails },
                ].map((item, i, arr) => (
                  <motion.button
                    key={item.label}
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      item.action();
                      setMoreOpen(false);
                    }}
                    whileTap={{ background: "rgba(255,255,255,0.07)" }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      background: "none",
                      border: "none",
                      borderBottom:
                        i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      cursor: "pointer",
                      touchAction: "manipulation",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        opacity: 0.45,
                        width: "20px",
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1px",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.88)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "6px 10px 8px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <motion.button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    setMoreOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "16px",
                    touchAction: "manipulation",
                  }}
                >
                  ···
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
