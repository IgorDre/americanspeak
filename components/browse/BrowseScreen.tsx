"use client";

import { useMemo, useState } from "react";
import { BrowseSearch } from "./BrowseSearch";
import { CategoryFilter } from "./CategoryFilter";
import { PhraseCard } from "@/components/phrase/PhraseCard";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ScreenContainer, BOTTOM_NAV_HEIGHT } from "@/components/layout/ScreenContainer";
import { MOCK_CATEGORIES, MOCK_PHRASES } from "@/data";
import { useSavedPhrases } from "@/hooks/useSavedPhrases";
import { useStudyQueue } from "@/hooks/useStudyQueue";
import { colors, spacing, typography } from "@/styles/theme";
import type { Phrase } from "@/types";

function matchesSearch(phrase: Phrase, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    phrase.term.toLowerCase().includes(q) ||
    phrase.definition.toLowerCase().includes(q) ||
    phrase.example1.toLowerCase().includes(q) ||
    (phrase.example2?.toLowerCase().includes(q) ?? false) ||
    (phrase.example3?.toLowerCase().includes(q) ?? false) ||
    phrase.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function BrowseScreen() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const { add, remove, inQueue, loading: queueLoading } = useStudyQueue();
  const { toggle: toggleSave, isSaved, loading: savedLoading } = useSavedPhrases();

  const categoryIdBySlug = useMemo(
    () => Object.fromEntries(MOCK_CATEGORIES.map((c) => [c.slug, c.id])),
    [],
  );

  const filtered = useMemo(() => {
    const targetId = category ? categoryIdBySlug[category] : null;
    return MOCK_PHRASES.filter((p) => {
      const catMatch = targetId === null || p.categoryId === targetId;
      return catMatch && matchesSearch(p, query);
    });
  }, [query, category, categoryIdBySlug]);

  const loading = queueLoading || savedLoading;

  return (
    <>
      <main
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          overflowY: "auto",
          paddingBottom: `calc(${BOTTOM_NAV_HEIGHT} + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <ScreenContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing[4] }}>

            {/* ── Header ──────────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.phraseLg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text,
                  fontFamily: typography.fontFamily.sans,
                }}
              >
                Browse
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.body,
                  color: colors.muted,
                  fontFamily: typography.fontFamily.sans,
                }}
              >
                {MOCK_PHRASES.length} phrases across {MOCK_CATEGORIES.length} categories
              </p>
            </div>

            {/* ── Search ──────────────────────────────────────────────── */}
            <BrowseSearch value={query} onChange={setQuery} />

            {/* ── Category filter ─────────────────────────────────────── */}
            <CategoryFilter
              categories={MOCK_CATEGORIES}
              selected={category}
              onSelect={setCategory}
            />

            {/* ── Results count ───────────────────────────────────────── */}
            {(query || category) && (
              <p
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.body,
                  color: colors.muted,
                  fontFamily: typography.fontFamily.sans,
                }}
              >
                {filtered.length === 0
                  ? "No phrases found"
                  : `${filtered.length} phrase${filtered.length === 1 ? "" : "s"} found`}
              </p>
            )}

            {/* ── Phrase list ─────────────────────────────────────────── */}
            {filtered.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: spacing[4] }}>
                {filtered.map((phrase) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    isQueued={!loading && inQueue(phrase.id)}
                    isSaved={!loading && isSaved(phrase.id)}
                    onAddToQueue={add}
                    onRemoveFromQueue={remove}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            ) : (
              <EmptyState query={query} category={category} />
            )}

          </div>
        </ScreenContainer>
      </main>
      <BottomNavigation />
    </>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  query: string;
  category: string | null;
}

function EmptyState({ query, category }: EmptyStateProps) {
  if (!query && !category) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing[3],
        paddingBlock: spacing[8],
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "2.5rem", lineHeight: 1 }} aria-hidden="true">
        🔍
      </span>
      <p
        style={{
          margin: 0,
          fontSize: typography.fontSize.body,
          color: colors.muted,
          fontFamily: typography.fontFamily.sans,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        {query
          ? `No phrases match "${query}"`
          : "No phrases in this category yet"}
      </p>
    </div>
  );
}
