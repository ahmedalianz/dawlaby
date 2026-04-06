import AppText from "@/components/common/AppText";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

interface Props {
  onFinish: () => void;
}

const SplashAnimation: React.FC<Readonly<Props>> = ({ onFinish }) => {
  const { t } = useTranslation();

  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.75);
  const logoOpacity = useSharedValue(0);
  const shimmerX = useSharedValue(-width);
  const textOpacity = useSharedValue(0);
  const textSlide = useSharedValue(16);
  const dotsOpacity = useSharedValue(0);
  const exitOpacity = useSharedValue(1);

  // ── Animated styles ──
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textSlide.value }],
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  const exitStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
  }));

  useEffect(() => {
    // 1. Glow ring appears (0ms)
    ringScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
    ringOpacity.value = withTiming(1, { duration: 500 });

    // 2. Icon pops in (500ms)
    logoScale.value = withDelay(
      500,
      withTiming(1, {
        duration: 450,
        easing: Easing.out(Easing.back(1.4)),
      }),
    );
    logoOpacity.value = withDelay(500, withTiming(1, { duration: 350 }));

    // 3. Shimmer across icon (950ms)
    shimmerX.value = withDelay(950, withTiming(width * 1.5, { duration: 700 }));

    // 4. Tagline slides up (1650ms)
    textOpacity.value = withDelay(1650, withTiming(1, { duration: 400 }));
    textSlide.value = withDelay(1650, withTiming(0, { duration: 400 }));

    // 5. Dots appear (1800ms)
    dotsOpacity.value = withDelay(1800, withTiming(1, { duration: 300 }));

    // 6. Fade out everything (2400ms)
    exitOpacity.value = withDelay(
      2400,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) scheduleOnRN(onFinish);
      }),
    );
  }, []);

  return (
    <Animated.View style={[styles.container, exitStyle]}>
      {/* Background gradient */}
      <LinearGradient
        colors={[
          Colors.surfaceOverlay,
          Colors.surface,
          Colors.surfaceContainer,
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glow behind icon */}
      <Animated.View style={[styles.glow, ringStyle]} />

      {/* Outer gold ring */}
      <Animated.View style={[styles.ringWrapper, ringStyle]}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ring}
        >
          {/* Icon container */}
          <Animated.View style={[styles.iconContainer, logoStyle]}>
            {/* Shimmer sweep */}
            <Animated.View style={[styles.shimmer, shimmerStyle]} />

            <Image
              source={require("@/assets/images/icon.webp")}
              style={styles.iconImage}
              resizeMode="cover"
            />
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineWrapper, textStyle]}>
        <View style={styles.taglineLine} />
        <AppText style={styles.tagline}>{t("splash.tagline")}</AppText>
        <View style={styles.taglineLine} />
      </Animated.View>

      {/* Dots */}
      <Animated.View style={[styles.dotsRow, dotsStyle]}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === 1 && {
                backgroundColor: Colors.primary,
                width: 20,
              },
            ]}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    gap: 28,
  },

  // ── Glow ──
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.primaryAlpha07,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 80,
  },

  // ── Ring ──
  ringWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: 190,
    height: 190,
    borderRadius: 46,
    padding: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 20,
  },

  // ── Icon ──
  iconContainer: {
    flex: 1,
    borderRadius: 44,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  iconImage: {
    width: "100%",
    height: "100%",
    borderRadius: 44,
  },

  // ── Shimmer ──
  shimmer: {
    position: "absolute",
    zIndex: 10,
    width: 50,
    height: "200%",
    backgroundColor: Colors.primaryAlpha10,
    // backgroundColor:"#ffffff14",
    transform: [{ rotate: "25deg" }],
  },

  // ── Tagline ──
  taglineWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taglineLine: {
    width: 28,
    height: 1,
    backgroundColor: Colors.primaryAlpha30,
  },
  tagline: {
    color: Colors.primaryAlpha60,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },

  // ── Dots ──
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryAlpha25,
  },
});
export default SplashAnimation;
