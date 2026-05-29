"use client";

import { memo, useCallback } from "react";
import type { ReelPhrase } from "@/lib/reelPhrase";
import { ActionRail } from "./ActionRail";
import { BackgroundLayer } from "./BackgroundLayer";
import { FloatingRings } from "./FloatingRings";
import { PhraseTypography } from "./PhraseTypography";
import { ReelAudioControls } from "./ReelAudioControls";
import { SwipeHints } from "./SwipeHints";
import { TagPills } from "./TagPills";

interface ReelCardProps {
  phrase: ReelPhrase;
  isSaved: boolean;
  onToggleSave: () => void;
  isPlaying: boolean;
  isSlow: boolean;
  onPlayNative: () => void;
  onPlaySlow: () => void;
}

function ReelCardBase({
  phrase,
  isSaved,
  onToggleSave,
  isPlaying,
  isSlow,
  onPlayNative,
  onPlaySlow,
}: ReelCardProps) {
  const handleShare = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "AmeriSpeak", text: `"${phrase.text}" — ${phrase.context}` }).catch(() => {});
    }
  }, [phrase.text, phrase.context]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <BackgroundLayer hue={phrase.hue} phraseId={phrase.id} />
      <FloatingRings />

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left content column — bottom anchored */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 18,
            padding: "16px 20px 12px",
            minWidth: 0,
          }}
        >
          <PhraseTypography
            text={phrase.text}
            accentWord={phrase.accentWord}
            phonetic={phrase.phonetic}
            context={phrase.context}
            category={phrase.category}
          />
          <TagPills tags={phrase.tags} />
          <SwipeHints />
          <ReelAudioControls
            onPlayNative={onPlayNative}
            onPlaySlow={onPlaySlow}
            isPlaying={isPlaying}
            isSlow={isSlow}
          />
        </div>

        {/* Right action rail */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 12,
            paddingRight: 14,
            flexShrink: 0,
          }}
        >
          <ActionRail
            likes={phrase.likes}
            isSaved={isSaved}
            onToggleSave={onToggleSave}
            onShare={handleShare}
          />
        </div>
      </div>
    </div>
  );
}

export const ReelCard = memo(ReelCardBase);
