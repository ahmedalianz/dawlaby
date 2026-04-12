import { useSuggestionAI } from "@/hooks/suggestions/useSuggestionAI";
import { useAsyncError } from "@/hooks/useAsyncError";
import { analyzeImage } from "@/utils/gemini";
import { saveToHistory } from "@/utils/history";
import { convertToBase64 } from "@/utils/normalization";
import { act, renderHook } from "@testing-library/react-native";

jest.mock("@/utils/normalization", () => ({
  convertToBase64: jest.fn(),
}));

jest.mock("@/utils/gemini", () => ({
  analyzeImage: jest.fn(),
}));

jest.mock("@/utils/history", () => ({
  saveToHistory: jest.fn(),
}));

jest.mock("@/hooks/useAsyncError", () => ({
  useAsyncError: jest.fn(),
}));

describe("useSuggestionAI", () => {
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

  it("fetches suggestion successfully", async () => {
    const onLoading = jest.fn();
    const onResult = jest.fn();
    const onError = jest.fn();
    const onAnimateIn = jest.fn();

    (convertToBase64 as jest.Mock).mockResolvedValue("mockBase64Data");
    (analyzeImage as jest.Mock).mockResolvedValue({
      style_vibe: "Street",
      detected_items: ["shoe"],
      color_palette: ["red"],
      occasions: ["party"],
      suggestions: [],
      stylist_note: "nice.",
    });

    const { result } = renderHook(() =>
      useSuggestionAI({
        imageUri: "file://image.jpg",
        context: "party",
        onLoading,
        onResult,
        onError,
        onAnimateIn,
      }),
    );

    await act(async () => {
      await result.current.fetchSuggestion();
    });

    expect(convertToBase64).toHaveBeenCalledWith("file://image.jpg");
    expect(analyzeImage).toHaveBeenCalled();
    expect(onResult).toHaveBeenCalled();
    expect(saveToHistory).toHaveBeenCalled();
    expect(onAnimateIn).toHaveBeenCalled();
  });

  it("throws error when no image is provided", async () => {
    const onLoading = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useSuggestionAI({
        imageUri: null,
        context: null,
        onLoading,
        onResult: jest.fn(),
        onError,
        onAnimateIn: jest.fn(),
      }),
    );

    await act(async () => {
      await result.current.fetchSuggestion();
    });

    expect(onError).toHaveBeenCalledWith("No image provided.");
  });
});
