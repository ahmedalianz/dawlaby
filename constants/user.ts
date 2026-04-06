import { Preferences, UserProfile } from "@/types";
import { APP_NAME_SMALL } from "./app";

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  bio: "",
  avatarUri: null,
  styleGoal: "casualChic",
};
export const DEFAULT_PREFS: Preferences = {
  notifications: true,
  saveHistory: true,
  aiLanguage: "english",
};
export const PROFILE_KEY = `${APP_NAME_SMALL}_profile`;
export const HISTORY_KEY = `${APP_NAME_SMALL}_history`;
export const PREFS_KEY = `${APP_NAME_SMALL}_prefs`;
export const STYLE_GOALS = [
  "casualChic",
  "businessLuxe",
  "streetStyle",
  "minimalist",
  "maximalist",
  "athleisure",
];
