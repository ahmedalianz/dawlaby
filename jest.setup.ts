// ── Silence console during tests ──
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// ── Mock expo-router ──
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  useFocusEffect: jest.fn(),
}));

// ── Mock expo-file-system ──
jest.mock("expo-file-system", () => ({
  File: jest.fn().mockImplementation(() => ({
    base64: jest.fn().mockResolvedValue("mockbase64string"),
  })),
  readAsStringAsync: jest.fn().mockResolvedValue("mockbase64string"),
  EncodingType: { Base64: "base64" },
}));
jest.mock("expo-constants", () => ({
  default: {},
}));

// ── Mock expo-audio ──
jest.mock("expo-audio", () => ({
  useAudioRecorder: jest.fn(() => ({
    record: jest.fn(),
    stop: jest.fn().mockResolvedValue(null),
    prepareToRecordAsync: jest.fn(),
    isRecording: false,
    uri: null,
  })),
  AudioModule: {
    requestRecordingPermissionsAsync: jest.fn().mockResolvedValue({
      granted: true,
    }),
  },
  RecordingPresets: { HIGH_QUALITY: {} },
}));

// ── Mock expo-camera ──
jest.mock("expo-camera", () => ({
  CameraView: "CameraView",
  useCameraPermissions: jest.fn(() => [{ granted: true }, jest.fn()]),
}));

// ── Mock expo-image-picker ──
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true }),
  MediaTypeOptions: { Images: "Images" },
}));

// ── Mock react-native-reanimated ──
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// ── Mock expo-blur ──
jest.mock("expo-blur", () => ({
  BlurView: "BlurView",
}));

// ── Mock expo-linear-gradient ──
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

//  MOCK AXIOS GLOBALLY
jest.mock("axios", () => ({
  post: jest.fn(),
}));

// ── Mock i18next ──
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
  initReactI18next: { type: "3rdParty", init: jest.fn() },
}));
jest.mock("i18next", () => ({
  t: (key: string) => key,
  language: "en",
  changeLanguage: jest.fn(),
}));
// ── Mock fetch globally ──
global.fetch = jest.fn();
