import { DEFAULT_PROFILE, PROFILE_KEY } from "@/constants/user";
import { loadProfile, saveProfile } from "@/utils/profile"; // Adjust path
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("Profile Storage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return DEFAULT_PROFILE when storage is empty", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const result = await loadProfile();
    expect(result).toEqual(DEFAULT_PROFILE);
  });

  it("should merge stored data with DEFAULT_PROFILE", async () => {
    const stored = { name: "Ahmed" };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(stored),
    );
    const result = await loadProfile();
    expect(result).toEqual({ ...DEFAULT_PROFILE, ...stored });
  });

  it("should save profile correctly", async () => {
    const profile = { ...DEFAULT_PROFILE, name: "Ahmed" };
    await saveProfile(profile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      PROFILE_KEY,
      JSON.stringify(profile),
    );
  });
});
