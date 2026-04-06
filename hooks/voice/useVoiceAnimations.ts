import { ScreenState } from "@/types";
import { useCallback, useEffect } from "react";
import {
  cancelAnimation,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function useVoiceAnimations(state: ScreenState) {
  const wave1 = useSharedValue(1);
  const wave2 = useSharedValue(1);
  const wave3 = useSharedValue(1);
  const fadeAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  // ── Pulse while processing ──
  useEffect(() => {
    if (state === ScreenState.Transcribing || state === ScreenState.Thinking) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      );
    } else {
      cancelAnimation(pulseAnim);
      pulseAnim.value = withTiming(1, { duration: 200 });
    }
  }, [state]);

  // ── Wave helpers ──
  const makeWave = useCallback((anim: SharedValue<number>, delay: number) => {
    anim.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const startWaveAnimation = useCallback(() => {
    makeWave(wave1, 0);
    makeWave(wave2, 150);
    makeWave(wave3, 300);
  }, [makeWave]);

  const stopWaveAnimation = useCallback(() => {
    cancelAnimation(wave1);
    cancelAnimation(wave2);
    cancelAnimation(wave3);
    wave1.value = withTiming(1, { duration: 200 });
    wave2.value = withTiming(1, { duration: 200 });
    wave3.value = withTiming(1, { duration: 200 });
  }, []);

  const showResult = useCallback(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
  }, []);

  const resetAnimations = useCallback(() => {
    cancelAnimation(fadeAnim);
    fadeAnim.value = 0;
  }, []);

  // ── Animated styles ──
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fadeAnim.value }));
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseAnim.value }));
  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave1.value }],
  }));
  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave2.value }],
  }));
  const wave3Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave3.value }],
  }));

  return {
    // controls
    startWaveAnimation,
    stopWaveAnimation,
    showResult,
    resetAnimations,
    // styles
    fadeStyle,
    pulseStyle,
    wave1Style,
    wave2Style,
    wave3Style,
  };
}
