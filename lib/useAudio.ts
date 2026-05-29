"use client";

import { useCallback, useRef, useState } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  // Play an audio file URL (when real audio files exist)
  const play = useCallback(async (url: string, slow = false) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(url);
      audio.playbackRate = slow ? 0.65 : 1.0;
      audioRef.current = audio;
      audio.addEventListener("ended", () => setIsPlaying(false));
      audio.addEventListener("error", () => setIsPlaying(false));
      await audio.play();
      setIsPlaying(true);
      setIsSlow(slow);
    } catch (err) {
      console.error("Audio play failed:", err);
      setIsPlaying(false);
    }
  }, []);

  // Fallback: Web Speech API — works everywhere with no audio files
  const playWithSpeech = useCallback((phraseText: string, slow = false) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // cancel() must settle before speak() on several mobile browsers, otherwise
    // the new utterance is dropped silently. A short timeout guarantees it.
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(phraseText);
      u.lang = "en-US";
      u.rate = slow ? 0.6 : 1.0;
      u.onstart = () => {
        setIsPlaying(true);
        setIsSlow(slow);
      };
      u.onend = () => setIsPlaying(false);
      u.onerror = (e) => {
        console.error("Speech error:", e);
        setIsPlaying(false);
      };
      window.speechSynthesis.speak(u);
    }, 50);
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  return { play, playWithSpeech, stop, isPlaying, isSlow };
}
