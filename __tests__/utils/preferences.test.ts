import { DEFAULT_PREFS, PREFS_KEY } from "@/constants/user";
import { Preferences } from "@/types";
import { loadPreferences, savePreferences } from "@/utils/preferences";
import { Storage } from "@/utils/storage";

jest.mock("@/utils/storage", () => ({
  Storage: {
    getString: jest.fn(),
    setObject: jest.fn(),
  },
}));

describe("Preferences Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadPreferences", () => {
    it("should return DEFAULT_PREFS if storage is empty", () => {
      (Storage.getString as jest.Mock).mockReturnValue(null);

      const result = loadPreferences();

      expect(Storage.getString).toHaveBeenCalledWith(PREFS_KEY);
      expect(result).toEqual(DEFAULT_PREFS);
    });

    it("should return merged preferences if storage has existing data", () => {
      const storedData = { theme: "dark" };
      (Storage.getString as jest.Mock).mockReturnValue(
        JSON.stringify(storedData),
      );

      const result = loadPreferences();

      expect(Storage.getString).toHaveBeenCalledWith(PREFS_KEY);
      expect(result).toEqual({ ...DEFAULT_PREFS, ...storedData });
    });

    it("should return DEFAULT_PREFS if Storage throws an error", () => {
      // MMKV getString is synchronous, so use mockImplementation to throw
      (Storage.getString as jest.Mock).mockImplementation(() => {
        throw new Error("Disk error");
      });

      const result = loadPreferences();

      expect(result).toEqual(DEFAULT_PREFS);
    });
  });

  describe("savePreferences", () => {
    it("should save preferences object via Storage.setObject", () => {
      const mockPrefs: Preferences = {
        ...DEFAULT_PREFS,
        // Adding a specific change to ensure it's passed correctly
        notifications: false,
      } as any;

      savePreferences(mockPrefs);

      expect(Storage.setObject).toHaveBeenCalledTimes(1);
      // Logic Check: Your implementation calls Storage.setObject(PREFS_KEY, p).
      // Since your Storage helper handles stringification, we pass the raw object here.
      expect(Storage.setObject).toHaveBeenCalledWith(PREFS_KEY, mockPrefs);
    });
  });
});
