import { DEFAULT_PROFILE, PROFILE_KEY } from "@/constants/user";
import { UserProfile } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadProfile = async (): Promise<UserProfile> => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};
export const saveProfile = async (p: UserProfile) => {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
};
