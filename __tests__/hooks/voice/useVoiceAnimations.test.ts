import { useVoiceAnimations } from "@/hooks/voice/useVoiceAnimations";
import { ScreenState } from "@/types";
import { act, renderHook } from "@testing-library/react-native";

describe("useVoiceAnimations", () => {
  it("provides expected style objects and controls", () => {
    const { result } = renderHook(() => useVoiceAnimations(ScreenState.Idle));

    expect(result.current).toHaveProperty("fadeStyle");
    expect(result.current).toHaveProperty("pulseStyle");
    expect(result.current).toHaveProperty("wave1Style");

    expect(typeof result.current.startWaveAnimation).toBe("function");
    expect(typeof result.current.stopWaveAnimation).toBe("function");
    expect(typeof result.current.showResult).toBe("function");
    expect(typeof result.current.resetAnimations).toBe("function");

    act(() => {
      result.current.startWaveAnimation();
    });
  });

  it("re-evaluates animations when state changes", () => {
    const { result, rerender } = renderHook(
      (state: ScreenState) => useVoiceAnimations(state),
      { initialProps: ScreenState.Idle },
    );

    act(() => {
      rerender(ScreenState.Transcribing);
    });

    expect(result.current.pulseStyle).toBeTruthy();
  });
});
