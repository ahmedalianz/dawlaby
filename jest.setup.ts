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
  useFocusEffect: (cb: any) => {
    const React = require("react");
    React.useEffect(cb, []);
  },
}));

jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});
// ── Mock expo-file-system ──
const mockAudioRecorder = {
  record: jest.fn(),
  stop: jest.fn().mockResolvedValue(undefined),
  prepareToRecordAsync: jest.fn().mockResolvedValue(undefined),
  isRecording: false,
  uri: "mock/audio.m4a",
};
jest.mock("expo-file-system", () => ({
  File: jest.fn().mockImplementation(() => ({
    base64: jest.fn().mockResolvedValue("mockbase64string"),
  })),
  readAsStringAsync: jest.fn().mockResolvedValue("mockbase64string"),
  EncodingType: { Base64: "base64" },
  useAudioRecorder: jest.fn(() => mockAudioRecorder),
  AudioModule: {
    requestRecordingPermissionsAsync: jest
      .fn()
      .mockResolvedValue({ granted: true }),
  },
}));
jest.mock("expo-constants", () => ({
  default: {},
}));

// ── Mock expo-audio ──
jest.mock("expo-audio", () => {
  const mockAudioRecorder = {
    isRecording: false,
    prepareToRecordAsync: jest.fn(),
    record: jest.fn(),
    stop: jest.fn(),
    uri: "file://mock/audio.m4a",
  };
  return {
    AudioModule: {
      requestRecordingPermissionsAsync: jest
        .fn()
        .mockResolvedValue({ granted: true }),
    },
    useAudioRecorder: jest.fn(() => mockAudioRecorder),
    RecordingPresets: { HIGH_QUALITY: "HQ" },
  };
});

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

jest.mock("react-native/Libraries/Share/Share", () => ({
  share: jest.fn().mockResolvedValue({ action: "sharedAction" }),
}));

const mockSaveAsync = jest.fn().mockResolvedValue({
  uri: "file://mock/compressed/image.jpg",
  base64: "mockbase64",
});
const mockRenderAsync = jest
  .fn()
  .mockResolvedValue({ saveAsync: mockSaveAsync });
const mockResize = jest.fn();
jest.mock("expo-image-manipulator", () => ({
  ImageManipulator: {
    manipulate: jest.fn(() => ({
      resize: mockResize,
      renderAsync: mockRenderAsync,
    })),
  },
  SaveFormat: {
    JPEG: "jpeg",
  },
}));

// ── Mock Reanimated ──
jest.mock("react-native-reanimated", () => ({
  default: {
    createAnimatedComponent: (component: any) => component,
    call: () => {},
  },
  useSharedValue: (val: any) => ({ value: val }),
  useAnimatedStyle: (cb: any) => {
    try {
      return cb();
    } catch {
      return {};
    }
  },
  useAnimatedScrollHandler: () => ({}),
  withTiming: (toValue: any, _config?: any, callback?: any) => {
    callback?.(true);
    return toValue;
  },
  withSpring: (toValue: any, _config?: any, callback?: any) => {
    callback?.(true);
    return toValue;
  },
  withRepeat: (toValue: any) => toValue,
  withSequence: (...args: any[]) => {
    // Execute last callback if exists
    const last = args[args.length - 1];
    return last;
  },
  withDelay: (_delay: any, toValue: any) => toValue,
  cancelAnimation: () => {},
  runOnJS: (fn: any) => fn,
  runOnUI: (fn: any) => fn,
  Easing: {
    out: () => {},
    in: () => {},
    inOut: () => {},
    exp: () => {},
    back: () => () => {},
    ease: () => {},
  },
  // ✅ Animated components
  View: "View",
  Text: "Text",
  ScrollView: "ScrollView",
  FlatList: "FlatList",
  Image: "Image",
}));

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

// Mock Ionicons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialIcons: "MaterialIcons",
}));
const mockStorage = new Map();

jest.mock("react-native-mmkv", () => {
  return {
    createMMKV: jest.fn(() => ({
      set: jest.fn((key, value) => {
        mockStorage.set(key, value);
      }),
      getString: jest.fn((key) => mockStorage.get(key)),
      getNumber: jest.fn((key) => mockStorage.get(key)),
      getBoolean: jest.fn((key) => mockStorage.get(key)),
      contains: jest.fn((key) => mockStorage.has(key)),
      remove: jest.fn((key) => mockStorage.delete(key)),
      clearAll: jest.fn(() => mockStorage.clear()),
    })),
  };
});
