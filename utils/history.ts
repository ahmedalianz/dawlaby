import { MAX_HISTORY_ITEMS } from "@/constants/common";
import { HISTORY_KEY } from "@/constants/user";
import { HistoryItem } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "i18next";

export const saveToHistory = async (item: Omit<HistoryItem, "id" | "date">) => {
  try {
    const existing = await getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `look_${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [newItem, ...existing].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
// ── Get one by id ──
export const getHistoryItem = async (
  id: string,
): Promise<HistoryItem | null> => {
  try {
    const history = await getHistory();
    return history.find((item) => item.id === id) ?? null;
  } catch {
    return null;
  }
};
export const deleteHistoryItem = async (id: string) => {
  const existing = await getHistory();
  const updated = existing.filter((i) => i.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const clearHistory = async () => {
  await AsyncStorage.removeItem(HISTORY_KEY);
};
export const formatDate = (iso: string) => {
  const locale = i18next.language === "ar" ? "ar-EG" : "en-US";

  return new Date(iso).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long",
  });
};
