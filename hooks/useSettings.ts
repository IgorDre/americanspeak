"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getSettings,
  saveSettings,
  resetSettings as resetSettingsLib,
  DEFAULT_SETTINGS,
  type UserSettings,
} from "@/lib/settings";

export interface UseSettingsReturn {
  settings: UserSettings;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  resetSettings: () => void;
}

/**
 * Single source of truth for user settings.
 * SSR-safe: initialises from DEFAULT_SETTINGS, then hydrates from localStorage.
 * Future Feed, Study, and Home screens should consume this hook.
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSetting = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        saveSettings(updated);
        return updated;
      });
    },
    [],
  );

  const resetSettings = useCallback(() => {
    const defaults = resetSettingsLib();
    setSettings(defaults);
  }, []);

  return { settings, updateSetting, resetSettings };
}
