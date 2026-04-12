import { useSuggestionAnimations } from "@/hooks/suggestions/useSuggestionAnimations";
import { act, renderHook } from "@testing-library/react-native";

describe("useSuggestionAnimations", () => {
  it("provides animated styles and triggers animations safely", () => {
    const { result } = renderHook(() => useSuggestionAnimations());

    expect(result.current).toHaveProperty("opacityStyle");
    expect(result.current).toHaveProperty("shimmerStyle");
    expect(result.current).toHaveProperty("slideStyle");

    // The shared value updates trigger under the hood. We just verify the API is exported
    expect(typeof result.current.animateIn).toBe("function");

    act(() => {
      result.current.animateIn();
    });
  });
});
