import { DEFAULT_PROFILE, PROFILE_KEY } from "@/constants/user";
import { loadProfile, saveProfile } from "@/utils/profile";
import { Storage } from "@/utils/storage";

jest.mock("@/utils/storage", () => ({
  Storage: {
    getString: jest.fn(),
    setObject: jest.fn(),
  },
}));

describe("Profile Storage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return DEFAULT_PROFILE when storage is empty", () => {
    (Storage.getString as jest.Mock).mockReturnValue(null);
    const result = loadProfile();
    expect(result).toEqual(DEFAULT_PROFILE);
  });

  it("should merge stored data with DEFAULT_PROFILE", () => {
    const stored = { name: "Ahmed" };
    (Storage.getString as jest.Mock).mockReturnValue(JSON.stringify(stored));
    const result = loadProfile();
    expect(result).toEqual({ ...DEFAULT_PROFILE, ...stored });
  });

  it("should save profile correctly", () => {
    const profile = { ...DEFAULT_PROFILE, name: "Ahmed" };
    saveProfile(profile);
    expect(Storage.setObject).toHaveBeenCalledWith(PROFILE_KEY, profile);
  });
});
