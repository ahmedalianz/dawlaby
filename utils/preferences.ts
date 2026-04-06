import { DEFAULT_PREFS, PREFS_KEY } from "@/constants/user";
import { Preferences } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadPreferences = async (): Promise<Preferences> => {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
};

export const savePreferences = async (p: Preferences) => {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(p));
};
