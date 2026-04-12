import { changeLanguage, initI18n } from "@/utils/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { I18nManager } from "react-native";

// 1. Better Mock for I18nManager
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.I18nManager.isRTL = false;
  RN.I18nManager.allowRTL = jest.fn();
  RN.I18nManager.forceRTL = jest.fn();
  return RN;
});

// 2. Un-mock i18next for this file specifically
// so we can test actual language transitions
jest.unmock("i18next");

jest.mock("expo-localization", () => ({
  getLocales: jest.fn(),
}));

describe("Internationalization (i18n)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset RTL state to false before each test
    I18nManager.isRTL = false;
  });

  describe("initI18n", () => {
    it("should use device language if no language is saved in storage", async () => {
      (Localization.getLocales as jest.Mock).mockReturnValue([
        { languageCode: "ar" },
      ]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await initI18n();

      expect(i18next.language).toBe("ar");
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
    });

    it("should prioritize saved language over device language", async () => {
      (Localization.getLocales as jest.Mock).mockReturnValue([
        { languageCode: "ar" },
      ]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("en");

      await initI18n();

      expect(i18next.language).toBe("en");
    });
  });

  describe("changeLanguage", () => {
    it("should update storage and i18next language", async () => {
      // Ensure we are starting from 'en'
      await i18next.changeLanguage("en");

      const result = await changeLanguage("ar");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("app_language", "ar");
      expect(i18next.language).toBe("ar");
      // Result is true because I18nManager.isRTL was false and we changed to 'ar'
      expect(result).toBe(true);
    });

    it("should return false for unsupported languages", async () => {
      const result = await changeLanguage("fr");
      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it("should return false if language changed but RTL state remains the same", async () => {
      // Force the mock state to already be RTL
      I18nManager.isRTL = true;

      const result = await changeLanguage("ar");

      expect(i18next.language).toBe("ar");
      expect(result).toBe(false); // Already RTL, no reload needed
    });
  });
});
