import { DEFAULT_PREFS, PREFS_KEY } from "@/constants/user";
import { Preferences } from "@/types";
import { Storage } from "@/utils/storage";

export const loadPreferences = (): Preferences => {
  try {
    const raw = Storage.getString(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
};

export const savePreferences = (p: Preferences) => {
  Storage.setObject(PREFS_KEY, p);
};
