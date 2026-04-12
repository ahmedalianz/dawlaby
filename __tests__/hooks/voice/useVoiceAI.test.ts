import { useAsyncError } from "@/hooks/useAsyncError";
import { useVoiceAI } from "@/hooks/voice/useVoiceAI";
import { askText, callGeminiRaw } from "@/utils/gemini";
import { act, renderHook } from "@testing-library/react-native";

jest.mock("@/utils/gemini", () => ({
  askText: jest.fn(),
  callGeminiRaw: jest.fn(),
}));

jest.mock("@/hooks/useAsyncError", () => ({
  useAsyncError: jest.fn(),
}));

describe("useVoiceAI", () => {
  let executeMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    executeMock = jest.fn(async (cb) => {
      return await cb();
    });

    (useAsyncError as jest.Mock).mockReturnValue({
      error: null,
      isLoading: false,
      execute: executeMock,
    });
  });

  it("processes question properly", async () => {
    const isMounted = { current: true };
    const onResult = jest.fn();
    const onThinking = jest.fn();
    const onDone = jest.fn();

    (askText as jest.Mock).mockResolvedValue({
      answer: "Wear red.",
      tips: ["It pops"],
      avoid: ["yellow"],
    });

    const { result } = renderHook(() =>
      useVoiceAI({
        isMounted,
        onTranscribed: jest.fn(),
        onResult,
        onThinking,
        onDone,
        onError: jest.fn(),
      }),
    );

    await act(async () => {
      await result.current.processQuestion("What should I wear?");
    });

    expect(onThinking).toHaveBeenCalled();
    expect(askText).toHaveBeenCalled();
    expect(onResult).toHaveBeenCalledWith({
      answer: "Wear red.",
      tips: ["It pops"],
      avoid: ["yellow"],
    });
    expect(onDone).toHaveBeenCalled();
  });

  it("transcribes audio and processes it", async () => {
    const isMounted = { current: true };
    const onTranscribed = jest.fn();
    const onResult = jest.fn();
    const onThinking = jest.fn();

    (callGeminiRaw as jest.Mock).mockResolvedValue("What should I wear?");
    (askText as jest.Mock).mockResolvedValue({
      answer: "Wear black.",
      tips: [],
      avoid: [],
    });

    const { result } = renderHook(() =>
      useVoiceAI({
        isMounted,
        onTranscribed,
        onResult,
        onThinking,
        onDone: jest.fn(),
        onError: jest.fn(),
      }),
    );

    await act(async () => {
      await result.current.processAudio("base64_audio_data");
    });

    expect(callGeminiRaw).toHaveBeenCalled();
    expect(onTranscribed).toHaveBeenCalledWith("What should I wear?");
    expect(askText).toHaveBeenCalled();
    expect(onResult).toHaveBeenCalled();
  });
});
