"use client";

import { useState, type ReactNode } from "react";
import { useSettings } from "@/hooks/useSettings";
import {
  ALL_CATEGORY_SLUGS,
  CATEGORY_LABELS,
  type UserSettings,
} from "@/lib/settings";
import { colors, radius, shadows, spacing, tapTargetMin, typography } from "@/styles/theme";

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div
      style={{
        height:          "1px",
        backgroundColor: colors.border,
        marginBlock:     spacing[1],
      }}
    />
  );
}

/** Collapsible section — uses CSS grid-template-rows for smooth, performant animation. */
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        borderRadius:    radius.card,
        backgroundColor: colors.surface,
        border:          `1px solid ${colors.border}`,
        boxShadow:       shadows.sm,
        overflow:        "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          width:           "100%",
          minHeight:       `${tapTargetMin}px`,
          paddingInline:   spacing[5],
          paddingBlock:    spacing[3],
          backgroundColor: "transparent",
          border:          "none",
          cursor:          "pointer",
          textAlign:       "left",
        }}
      >
        <span
          style={{
            fontSize:      typography.fontSize.body,
            fontWeight:    typography.fontWeight.semibold,
            color:         colors.text,
            fontFamily:    typography.fontFamily.sans,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </span>
        <span
          aria-hidden="true"
          style={{
            color:      colors.muted,
            fontSize:   typography.fontSize.body,
            lineHeight:  1,
            transition:  "transform 280ms ease",
            transform:   open ? "rotate(180deg)" : "rotate(0deg)",
            display:     "inline-block",
            flexShrink:  0,
            marginLeft:  spacing[2],
          }}
        >
          ▾
        </span>
      </button>

      {/* Grid animation — performant, works with variable-height content */}
      <div
        style={{
          display:            "grid",
          gridTemplateRows:   open ? "1fr" : "0fr",
          transition:         "grid-template-rows 280ms ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              paddingInline: spacing[5],
              paddingBottom: spacing[4],
              display:       "flex",
              flexDirection: "column",
              gap:           spacing[3],
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Toggle row with 48px tap target and smooth knob transition. */
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
      style={{
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        gap:             spacing[3],
        minHeight:       `${tapTargetMin}px`,
        width:           "100%",
        paddingBlock:    spacing[2],
        backgroundColor: "transparent",
        border:          "none",
        cursor:          "pointer",
        textAlign:       "left",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: spacing[1], flex: 1 }}>
        <span
          style={{
            fontSize:   typography.fontSize.bodyLg,
            fontWeight: typography.fontWeight.medium,
            color:      colors.text,
            fontFamily: typography.fontFamily.sans,
            lineHeight: typography.lineHeight.tight,
          }}
        >
          {label}
        </span>
        {description && (
          <span
            style={{
              fontSize:   typography.fontSize.badge,
              color:      colors.muted,
              fontFamily: typography.fontFamily.sans,
              lineHeight: typography.lineHeight.normal,
            }}
          >
            {description}
          </span>
        )}
      </div>

      {/* Toggle switch */}
      <div
        aria-hidden="true"
        style={{
          flexShrink:      0,
          width:           "2.25rem",
          height:          "1.25rem",
          borderRadius:    radius.full,
          backgroundColor: checked ? colors.accent : colors.elevated,
          border:          `1px solid ${checked ? colors.accent : colors.border}`,
          position:        "relative",
          transition:      "background-color 200ms ease, border-color 200ms ease",
        }}
      >
        <span
          style={{
            position:        "absolute",
            top:             "50%",
            left:            checked ? "calc(100% - 1rem - 2px)" : "2px",
            transform:       "translateY(-50%)",
            width:           "1rem",
            height:          "1rem",
            borderRadius:    radius.full,
            backgroundColor: checked ? colors.text : colors.muted,
            transition:      "left 200ms ease, background-color 200ms ease",
          }}
        />
      </div>
    </button>
  );
}

/** Segmented control — horizontal pill buttons, one active at a time. */
function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
      <span
        style={{
          fontSize:   typography.fontSize.bodyLg,
          fontWeight: typography.fontWeight.medium,
          color:      colors.text,
          fontFamily: typography.fontFamily.sans,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: spacing[1], flexWrap: "wrap" }}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              style={{
                flex:            "1 1 auto",
                minHeight:       "2.25rem",
                paddingInline:   spacing[3],
                paddingBlock:    spacing[2],
                borderRadius:    radius.md,
                border:          `1px solid ${active ? colors.accent : colors.border}`,
                backgroundColor: active ? `${colors.accent}20` : colors.elevated,
                color:           active ? colors.accent : colors.muted,
                fontSize:        typography.fontSize.badge,
                fontWeight:      active ? typography.fontWeight.semibold : typography.fontWeight.normal,
                fontFamily:      typography.fontFamily.sans,
                cursor:          "pointer",
                transition:      "background-color 150ms ease, color 150ms ease, border-color 150ms ease",
                whiteSpace:      "nowrap",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Toggle row for a single category (slim, 44px). */
function CategoryToggleRow({
  slug,
  enabled,
  onChange,
}: {
  slug: string;
  enabled: boolean;
  onChange: (slug: string, enabled: boolean) => void;
}) {
  const label = CATEGORY_LABELS[slug] ?? slug;

  return (
    <button
      onClick={() => onChange(slug, !enabled)}
      aria-checked={enabled}
      role="switch"
      style={{
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        gap:             spacing[3],
        minHeight:       `${tapTargetMin}px`,
        width:           "100%",
        paddingBlock:    spacing[2],
        backgroundColor: "transparent",
        border:          "none",
        cursor:          "pointer",
        textAlign:       "left",
      }}
    >
      <span
        style={{
          fontSize:   typography.fontSize.bodyLg,
          fontWeight: typography.fontWeight.normal,
          color:      enabled ? colors.text : colors.muted,
          fontFamily: typography.fontFamily.sans,
          lineHeight: typography.lineHeight.tight,
          transition: "color 150ms ease",
        }}
      >
        {label}
      </span>
      <div
        aria-hidden="true"
        style={{
          flexShrink:      0,
          width:           "2.25rem",
          height:          "1.25rem",
          borderRadius:    radius.full,
          backgroundColor: enabled ? colors.accent : colors.elevated,
          border:          `1px solid ${enabled ? colors.accent : colors.border}`,
          position:        "relative",
          transition:      "background-color 200ms ease, border-color 200ms ease",
        }}
      >
        <span
          style={{
            position:        "absolute",
            top:             "50%",
            left:            enabled ? "calc(100% - 1rem - 2px)" : "2px",
            transform:       "translateY(-50%)",
            width:           "1rem",
            height:          "1rem",
            borderRadius:    radius.full,
            backgroundColor: enabled ? colors.text : colors.muted,
            transition:      "left 200ms ease, background-color 200ms ease",
          }}
        />
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfileSettings() {
  const { settings, updateSetting, resetSettings } = useSettings();

  function toggleCategory(slug: string, enabled: boolean) {
    const next = enabled
      ? [...settings.enabledCategories, slug]
      : settings.enabledCategories.filter((s) => s !== slug);
    updateSetting("enabledCategories", next);
  }

  function enableAllCategories() {
    updateSetting("enabledCategories", [...ALL_CATEGORY_SLUGS]);
  }

  function disableAllCategories() {
    updateSetting("enabledCategories", []);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>

      {/* ── Audio & Playback ─────────────────────────────────────────────── */}
      <CollapsibleSection title="🔊  Audio & Playback">
        <ToggleRow
          label="Autoplay"
          description="Play audio automatically when a phrase loads"
          checked={settings.autoplay}
          onChange={(v) => updateSetting("autoplay", v)}
        />

        <SectionDivider />

        <SegmentedControl
          label="Autoplay delay"
          value={settings.autoplayDelay}
          onChange={(v: number) => updateSetting("autoplayDelay", v as UserSettings["autoplayDelay"])}
          options={[
            { label: "Instant", value: 0 },
            { label: "0.5s",    value: 500 },
            { label: "1s",      value: 1000 },
            { label: "2s",      value: 2000 },
          ]}
        />

        <SectionDivider />

        <SegmentedControl
          label="Playback speed"
          value={settings.playbackSpeed}
          onChange={(v: number) => updateSetting("playbackSpeed", v as UserSettings["playbackSpeed"])}
          options={[
            { label: "Slow (0.7×)",    value: 0.7 },
            { label: "Natural (0.9×)", value: 0.9 },
            { label: "Fast (1.1×)",    value: 1.1 },
          ]}
        />

        <SectionDivider />

        <SegmentedControl
          label="Voice style"
          value={settings.voiceStyle}
          onChange={(v) => updateSetting("voiceStyle", v as UserSettings["voiceStyle"])}
          options={[
            { label: "Auto",            value: "auto" as const },
            { label: "Neutral American", value: "neutral_american" as const },
            { label: "Casual American", value: "casual_american" as const },
            { label: "Urban American",  value: "urban_american" as const },
            { label: "Latino American", value: "latino_american" as const },
          ]}
        />
      </CollapsibleSection>

      {/* ── Learning ─────────────────────────────────────────────────────── */}
      <CollapsibleSection title="📚  Learning">
        <SegmentedControl
          label="Daily goal"
          value={settings.dailyGoal}
          onChange={(v: number) => updateSetting("dailyGoal", v as UserSettings["dailyGoal"])}
          options={[
            { label: "10",  value: 10 },
            { label: "20",  value: 20 },
            { label: "30",  value: 30 },
            { label: "50",  value: 50 },
          ]}
        />

        <SectionDivider />

        <ToggleRow
          label="Show IPA"
          description="Pronunciation notation (e.g. /dʒʌst ə hɛdz ʌp/)"
          checked={settings.showIPA}
          onChange={(v) => updateSetting("showIPA", v)}
        />
        <ToggleRow
          label="Show visual scene"
          description="Context illustration for each phrase"
          checked={settings.showVisualScene}
          onChange={(v) => updateSetting("showVisualScene", v)}
        />
        <ToggleRow
          label="Show emotional tone"
          description="Friendly / serious / sarcastic indicators"
          checked={settings.showEmotionalTone}
          onChange={(v) => updateSetting("showEmotionalTone", v)}
        />
        <ToggleRow
          label="Hide definition initially"
          description="Reveal meaning only after tapping the card"
          checked={settings.hideDefinitionInitially}
          onChange={(v) => updateSetting("hideDefinitionInitially", v)}
        />
      </CollapsibleSection>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <CollapsibleSection title="🗂  Categories">
        {/* Quick actions */}
        <div style={{ display: "flex", gap: spacing[2] }}>
          <button
            onClick={enableAllCategories}
            style={{
              flex:            1,
              minHeight:       `${tapTargetMin}px`,
              borderRadius:    radius.md,
              border:          `1px solid ${colors.border}`,
              backgroundColor: colors.elevated,
              color:           colors.text,
              fontSize:        typography.fontSize.badge,
              fontWeight:      typography.fontWeight.medium,
              fontFamily:      typography.fontFamily.sans,
              cursor:          "pointer",
              transition:      "background-color 150ms ease",
            }}
          >
            Enable all
          </button>
          <button
            onClick={disableAllCategories}
            style={{
              flex:            1,
              minHeight:       `${tapTargetMin}px`,
              borderRadius:    radius.md,
              border:          `1px solid ${colors.border}`,
              backgroundColor: colors.elevated,
              color:           colors.muted,
              fontSize:        typography.fontSize.badge,
              fontWeight:      typography.fontWeight.medium,
              fontFamily:      typography.fontFamily.sans,
              cursor:          "pointer",
              transition:      "background-color 150ms ease",
            }}
          >
            Disable all
          </button>
        </div>

        <SectionDivider />

        {ALL_CATEGORY_SLUGS.map((slug, i) => (
          <div key={slug}>
            <CategoryToggleRow
              slug={slug}
              enabled={settings.enabledCategories.includes(slug)}
              onChange={toggleCategory}
            />
            {i < ALL_CATEGORY_SLUGS.length - 1 && <SectionDivider />}
          </div>
        ))}
      </CollapsibleSection>

      {/* ── Appearance ───────────────────────────────────────────────────── */}
      <CollapsibleSection title="⚙️  Appearance">
        <ToggleRow
          label="Dark mode"
          description="Dark background, easier on the eyes"
          checked={settings.darkMode}
          onChange={(v) => updateSetting("darkMode", v)}
        />
      </CollapsibleSection>

      {/* Reset */}
      <button
        onClick={resetSettings}
        style={{
          minHeight:       `${tapTargetMin}px`,
          width:           "100%",
          borderRadius:    radius.md,
          border:          `1px solid ${colors.border}`,
          backgroundColor: "transparent",
          color:           colors.muted,
          fontSize:        typography.fontSize.body,
          fontFamily:      typography.fontFamily.sans,
          cursor:          "pointer",
          transition:      "color 150ms ease",
        }}
      >
        Reset to defaults
      </button>

    </div>
  );
}
