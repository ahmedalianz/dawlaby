import { MAX_HISTORY_ITEMS } from "@/constants/common";
import { HISTORY_KEY } from "@/constants/user";
import { HistoryItem } from "@/types";
import i18next from "i18next";
import { Storage } from "./storage";

export const saveToHistory = (item: Omit<HistoryItem, "id" | "date">) => {
  try {
    const existing = getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `look_${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [newItem, ...existing].slice(0, MAX_HISTORY_ITEMS);
    Storage.setObject(HISTORY_KEY, updated);
    return newItem;
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    return Storage.getObject<HistoryItem[]>(HISTORY_KEY) ?? [];
  } catch {
    return [];
  }
};
// ── Get one by id ──
export const getHistoryItem = (id: string): HistoryItem | null => {
  try {
    const history = getHistory();
    return history.find((item) => item.id === id) ?? null;
  } catch {
    return null;
  }
};
export const deleteHistoryItem = (id: string) => {
  const existing = getHistory();
  const updated = existing.filter((i) => i.id !== id);
  Storage.setObject(HISTORY_KEY, updated);
};

export const clearHistory = () => {
  Storage.remove(HISTORY_KEY);
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
