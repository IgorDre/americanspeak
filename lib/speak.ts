export type SpeakOptions = {
  rate?: number;
  repeat?: number;
};

export async function speakAmerican(
  text: string,
  options: SpeakOptions = {},
): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const { rate = 0.9, repeat = 1 } = options;

  const getVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === "en-US" && v.name.includes("Samantha")) ??
      voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ??
      voices.find((v) => v.lang === "en-US") ??
      null
    );
  };

  const voice = getVoice();

  for (let i = 0; i < repeat; i++) {
    await new Promise<void>((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = rate;
      utterance.pitch = 1.0;
      if (voice) utterance.voice = voice;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });

    if (i < repeat - 1) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
