import { useCallback, useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function useSuggestionAnimations() {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(40);
  const shimmerAnim = useSharedValue(0);

  // ── Shimmer loop while loading ──
  useEffect(() => {
    shimmerAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  // ── Animate result in ──
  const animateIn = useCallback(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withTiming(0, { duration: 600 });
  }, []);

  // ── Animated styles ──
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const slideStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerAnim.value,
  }));

  return {
    animateIn,
    opacityStyle,
    slideStyle,
    shimmerStyle,
  };
}
