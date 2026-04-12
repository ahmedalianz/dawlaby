import { DEFAULT_PREFS, PREFS_KEY } from "@/constants/user";
import { Preferences } from "@/types";
import { loadPreferences, savePreferences } from "@/utils/preferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("Preferences Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadPreferences", () => {
    it("should return DEFAULT_PREFS if storage is empty", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadPreferences();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(PREFS_KEY);
      expect(result).toEqual(DEFAULT_PREFS);
    });

    it("should return merged preferences if storage has existing data", async () => {
      const storedData = { theme: "dark" };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedData),
      );

      const result = await loadPreferences();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(PREFS_KEY);
      expect(result).toEqual({ ...DEFAULT_PREFS, ...storedData });
    });

    it("should return DEFAULT_PREFS if AsyncStorage throws an error", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Some error"),
      );

      const result = await loadPreferences();

      expect(result).toEqual(DEFAULT_PREFS);
    });
  });

  describe("savePreferences", () => {
    it("should stringify and save preferences to storage", async () => {
      const mockPrefs: Preferences = {
        ...DEFAULT_PREFS,
      };

      await savePreferences(mockPrefs);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        PREFS_KEY,
        JSON.stringify(mockPrefs),
      );
    });
  });
});
