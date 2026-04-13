import { changeLanguage, initI18n } from "@/utils/i18n";
import { Storage } from "@/utils/storage";
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
jest.mock("@/utils/storage", () => ({
  Storage: {
    getString: jest.fn(),
    set: jest.fn(),
    getObject: jest.fn(),
  },
}));
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
      (Storage.getObject as jest.Mock).mockReturnValue(null);

      await initI18n();

      expect(i18next.language).toBe("ar");
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
    });

    it("should prioritize saved language over device language", async () => {
      (Localization.getLocales as jest.Mock).mockReturnValue([
        { languageCode: "ar" },
      ]);
      (Storage.getString as jest.Mock).mockReturnValue("en");

      await initI18n();

      expect(i18next.language).toBe("en");
    });
  });

  describe("changeLanguage", () => {
    it("should update storage and i18next language", async () => {
      // Ensure we are starting from 'en'
      await i18next.changeLanguage("en");

      const result = await changeLanguage("ar");

      expect(Storage.set).toHaveBeenCalledWith("app_language", "ar");
      expect(i18next.language).toBe("ar");
      // Result is true because I18nManager.isRTL was false and we changed to 'ar'
      expect(result).toBe(true);
    });

    it("should return false for unsupported languages", async () => {
      const result = await changeLanguage("fr");
      expect(result).toBe(false);
      expect(Storage.set).not.toHaveBeenCalled();
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
