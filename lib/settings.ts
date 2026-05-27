const SETTINGS_KEY = "as_settings";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VoiceStyle =
  | "auto"
  | "neutral_american"
  | "casual_american"
  | "urban_american"
  | "latino_american";

export type UserSettings = {
  autoplay: boolean;
  autoplayDelay: number; // ms: 0, 500, 1000, 2000
  playbackSpeed: number; // 0.7, 0.9, 1.1
  voiceStyle: VoiceStyle;
  dailyGoal: number; // 10, 20, 30, 50
  showIPA: boolean;
  showVisualScene: boolean;
  showEmotionalTone: boolean;
  hideDefinitionInitially: boolean;
  enabledCategories: string[];
  darkMode: boolean;
};

// ─── Category labels ──────────────────────────────────────────────────────────

/** All settings-level category slugs (underscore format). */
export const ALL_CATEGORY_SLUGS: string[] = [
  "everyday",
  "work",
  "tech",
  "small_talk",
  "friends",
  "dating",
  "social_events",
  "immigration",
  "medical",
  "school",
  "phone_calls",
  "customer_service",
  "money",
  "anxiety_awkward",
  "neighbors",
  "driving",
  "texting",
  "gym_fitness",
  "weather",
  "family",
];

/** Maps settings category slugs (and "qa" alias) to human-readable labels. */
export const CATEGORY_LABELS: Record<string, string> = {
  everyday:         "Everyday Life",
  work:             "Work & Office",
  tech:             "Tech & Software",
  qa:               "Tech & Software", // alias — do not rename in data files
  small_talk:       "Small Talk",
  friends:          "Friends",
  dating:           "Dating",
  social_events:    "Social Events",
  immigration:      "US Life & Immigration",
  medical:          "Medical English",
  school:           "School English",
  phone_calls:      "Phone Calls",
  customer_service: "Customer Service",
  money:            "Money & Finances",
  anxiety_awkward:  "Awkward Situations",
  neighbors:        "Neighbors",
  driving:          "Driving & Uber",
  texting:          "Texting & Online",
  gym_fitness:      "Gym & Fitness",
  weather:          "Weather",
  family:           "Family",
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: UserSettings = {
  autoplay:                 false,
  autoplayDelay:            1000,
  playbackSpeed:            0.9,
  voiceStyle:               "auto",
  dailyGoal:                20,
  showIPA:                  true,
  showVisualScene:          true,
  showEmotionalTone:        true,
  hideDefinitionInitially:  false,
  enabledCategories:        [...ALL_CATEGORY_SLUGS],
  darkMode:                 true,
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    // Merge so that new keys added in future updates get their defaults.
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<UserSettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage quota exceeded — fail silently.
  }
}

export function updateSetting<K extends keyof UserSettings>(
  key: K,
  value: UserSettings[K],
): UserSettings {
  const updated = { ...getSettings(), [key]: value };
  saveSettings(updated);
  return updated;
}

export function resetSettings(): UserSettings {
  saveSettings(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS };
}
