import { DEFAULT_PROFILE, PROFILE_KEY } from "@/constants/user";
import { UserProfile } from "@/types";
import { Storage } from "@/utils/storage";

export const loadProfile = (): UserProfile => {
  try {
    const raw = Storage.getString(PROFILE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};
export const saveProfile = (p: UserProfile) => {
  Storage.setObject(PROFILE_KEY, p);
};
