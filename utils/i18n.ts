import * as Localization from "expo-localization";
import * as Updates from "expo-updates";
import i18next, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import ar from "../locales/ar.json";
import en from "../locales/en.json";
import { Storage } from "./storage";

const LANG_KEY = "app_language";

const SUPPORTED_LANGS = ["en", "ar"];

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const getDeviceLang = () => {
  const code = Localization.getLocales()[0]?.languageCode;
  return SUPPORTED_LANGS.includes(code || "") ? code : "en";
};

export const initI18n = async () => {
  let savedLang = getDeviceLang();

  try {
    const lang = Storage.getString(LANG_KEY);
    if (lang && SUPPORTED_LANGS.includes(lang)) {
      savedLang = lang;
    }
  } catch (error) {
    console.warn("Error reading language", error);
  }

  const isRTL = savedLang === "ar";

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }
  const options: InitOptions = {
    resources,
    lng: savedLang as string,
    fallbackLng: "en",
    compatibilityJSON: "v4",
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
  };
  await i18next.use(initReactI18next).init(options);

  return i18next;
};

export const changeLanguage = async (lang: string) => {
  if (!SUPPORTED_LANGS.includes(lang)) return false;

  try {
    Storage.set(LANG_KEY, lang);
    await i18next.changeLanguage(lang);

    const isRTL = lang === "ar";

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);

      // Wait for storage to save
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Restart
      await Updates.reloadAsync();
      return true;
    }

    return false;
  } catch (e) {
    // If not in production (dev mode) — reloadAsync fails
    // In dev mode, just warn
    if (__DEV__) {
      console.warn("Restart required — reload manually in dev mode");
      return true;
    }
    console.error("Failed to change language", e);
    return false;
  }
};

export default i18next;
