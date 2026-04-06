import { Ionicons } from "@expo/vector-icons";

export enum ScreenState {
  Idle = "idle",
  Recording = "recording",
  Transcribing = "transcribing",
  Thinking = "thinking",
  Result = "result",
  Error = "error",
}

export interface FashionResult {
  answer: string;
  tips: string[];
  avoid: string[];
}

export interface ProcessingStepProps {
  label: string;
  done: boolean;
  active: boolean;
}

export interface SectionHeaderProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  color?: string;
}

// ── Upload type ──
export type UploadType = "outfit" | "item";
interface Suggestion {
  title: string;
  description: string;
}

export interface OutfitResult {
  detected_items: string[];
  style_vibe: string;
  color_palette: string[];
  occasions: string[];
  suggestions: Suggestion[];
  stylist_note: string;
}

export interface SectionProps {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  children: React.ReactNode;
}
export interface UserProfile {
  name: string;
  bio: string;
  avatarUri: string | null;
  styleGoal: string;
}

export interface Preferences {
  notifications: boolean;
  saveHistory: boolean;
  aiLanguage: "english" | "arabic";
}

export interface OnboardingStep {
  id: string;
  visual: React.ComponentType;
}
export enum Mode {
  Photo = "Photo",
  Portrait = "Portrait",
}
export interface HistoryItem {
  id: string;
  imageUri: string | string[];
  styleVibe: string;
  detectedItems: string[];
  occasions: string[];
  stylistNote: string;
  date: string; // ISO string
  result: OutfitResult;
}

export interface ListCardItem {
  item: HistoryItem;
  handleDelete: (id: HistoryItem["id"]) => void;
}
export interface GridCardItem extends ListCardItem {
  index: number;
}
export enum HistoryContentView {
  Grid = "grid",
  List = "list",
}

export interface TopBarProps {
  firstButtonIcon?: React.ComponentProps<typeof Ionicons>["name"];
  secondButtonIcon?: React.ComponentProps<typeof Ionicons>["name"];
  onFirstButtonPress?: () => void;
  onSecondButtonPress?: () => void;
  secondButtonColor?: string;
  title: string;
}
