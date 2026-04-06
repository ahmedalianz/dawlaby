import { ScreenState } from "@/types";
export const BLUR_HASH = "L26RW4xu00Ri_NRjIT-;~qWA4Ut7";

export const OCCASIONS = [
  { label: "upload.casualDay", icon: "sunny-outline" },
  { label: "upload.workOffice", icon: "briefcase-outline" },
  { label: "upload.dateNight", icon: "heart-outline" },
  { label: "upload.party", icon: "wine-outline" },
  { label: "upload.wedding", icon: "diamond-outline" },
  { label: "upload.gym", icon: "barbell-outline" },
  { label: "upload.travel", icon: "airplane-outline" },
  { label: "upload.beach", icon: "umbrella-outline" },
];

export const QUICK_QUESTIONS: Record<string, string[]> = {
  english: [
    "What goes with blue jeans?",
    "How to dress for a business casual?",
    "Best colors for summer outfits?",
    "How to style a white shirt?",
  ],
  arabic: [
    "إيه اللي يناسب جينز أزرق؟",
    "إزاي البس casual للشغل؟",
    "أحسن ألوان للصيف؟",
    "إزاي أنسّق قميص أبيض؟",
  ],
};

export const STATUS_LABELS: Record<ScreenState, string> = {
  idle: "voice.tapToSpeak",
  recording: "voice.listening",
  transcribing: "voice.transcribing",
  thinking: "voice.thinking",
  result: "voice.result",
  error: "voice.error",
};

export const MAX_HISTORY_ITEMS = 30;
