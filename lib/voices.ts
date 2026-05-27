import type { VoiceStyle } from "./settings";

/**
 * Maps a VoiceStyle preference to the best matching SpeechSynthesisVoice.
 *
 * ElevenLabs / OpenAI TTS voices are reserved for future integration:
 *   urban_american  → ElevenLabs "Domi" or similar en-US voice
 *   latino_american → ElevenLabs "Bella" or OpenAI "shimmer"
 *
 * Falls back to the first available en-US voice if no specific match is found.
 */
export function getVoiceForStyle(
  style: VoiceStyle,
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const enUS = voices.filter((v) => v.lang === "en-US" || v.lang.startsWith("en-US"));
  if (enUS.length === 0) return null;

  const find = (pred: (v: SpeechSynthesisVoice) => boolean) =>
    enUS.find(pred) ?? null;

  switch (style) {
    case "auto":
      // Mirror the selection logic from lib/speak.ts
      return (
        find((v) => v.name.includes("Samantha")) ??
        find((v) => v.name.toLowerCase().includes("google")) ??
        enUS[0]
      );

    case "neutral_american":
      // Samantha (macOS / iOS) or Google US English — both are clean neutral voices
      return (
        find((v) => v.name.includes("Samantha")) ??
        find((v) => v.name.toLowerCase().includes("google")) ??
        enUS[0]
      );

    case "casual_american":
      // Prefer an alternative en-US voice that isn't the primary neutral one
      // ElevenLabs "Rachel" reserved for future integration
      return (
        find((v) => v.name.includes("Alex")) ??
        find(
          (v) =>
            !v.name.includes("Samantha") &&
            !v.name.toLowerCase().includes("google"),
        ) ??
        enUS[0]
      );

    case "urban_american":
      // en-US voice variant — ElevenLabs "Domi" slot reserved
      return find((v) => v.name.includes("US")) ?? enUS[0];

    case "latino_american":
      // en-US-x-sfg or similar accent — ElevenLabs "Bella" slot reserved
      return (
        find((v) => v.lang === "en-US-x-sfg") ??
        find((v) => v.name.toLowerCase().includes("spanish") && v.lang.startsWith("en")) ??
        enUS[0]
      );
  }
}
