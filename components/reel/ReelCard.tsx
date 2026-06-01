"use client";

import { memo, useCallback } from "react";
import type { ReelPhrase } from "@/lib/reelPhrase";
import type { PhraseState } from "@/lib/usePhraseStates";
import { ActionRail } from "./ActionRail";
import { BackgroundLayer } from "./BackgroundLayer";
import { FloatingRings } from "./FloatingRings";
import { PhraseTypography } from "./PhraseTypography";
import { ReelAudioControls } from "./ReelAudioControls";
import { SwipeHints } from "./SwipeHints";
import { TagPills } from "./TagPills";

interface ReelCardProps {
  phrase: ReelPhrase;
  phraseState: PhraseState;
  isPlaying: boolean;
  isSlow: boolean;
  onPlayNative: () => void;
  onPlaySlow: () => void;
  onHide: () => void;
  onReport: () => void;
  onCopy: () => void;
  onViewDetails: () => void;
}

function ReelCardBase({
  phrase,
  phraseState,
  isPlaying,
  isSlow,
  onPlayNative,
  onPlaySlow,
  onHide,
  onReport,
  onCopy,
  onViewDetails,
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
            padding: "16px 0 12px",
            minWidth: 0,
          }}
        >
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <PhraseTypography
              text={phrase.text}
              accentWord={phrase.accentWord}
              phonetic={phrase.phonetic}
              context={phrase.context}
              category={phrase.category}
              phraseState={phraseState}
            />
          </div>
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <TagPills tags={phrase.tags} />
          </div>
          <div style={{ width: "100%", paddingLeft: "20px", paddingRight: "20px" }}>
            <SwipeHints />
          </div>
          <div style={{ width: "100%", paddingLeft: "20px", paddingRight: "20px" }}>
            <ReelAudioControls
              onPlayNative={onPlayNative}
              onPlaySlow={onPlaySlow}
              isPlaying={isPlaying}
              isSlow={isSlow}
            />
          </div>
        </div>

        {/* Right action rail — pushed up so the heart sits above the SwipeHints row */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 120,
            paddingRight: 12,
            gap: 20,
            flexShrink: 0,
          }}
        >
          <ActionRail
            likes={phrase.likes}
            onShare={handleShare}
            onHide={onHide}
            onReport={onReport}
            onCopy={onCopy}
            onViewDetails={onViewDetails}
          />
        </div>
      </div>
    </div>
  );
}

export const ReelCard = memo(ReelCardBase);
