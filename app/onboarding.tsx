import AppButton from "@/components/common/AppButton";
import AppText from "@/components/common/AppText";
import Screen from "@/components/common/Screen";
import DotIndicator from "@/components/onboarding/DotIndicator";
import SlideItem from "@/components/onboarding/SlideItem";
import Step1Visual from "@/components/onboarding/Step1Visual";
import Step2Visual from "@/components/onboarding/Step2Visual";
import Step3Visual from "@/components/onboarding/Step3Visual";
import { APP_NAME_LARGE } from "@/constants/app";
import { useDirection } from "@/store/DirectionContext";
import { OnboardingStep } from "@/types";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/colors";

const { width, height } = Dimensions.get("window");
const BASE_STEPS: OnboardingStep[] = [
  { id: "1", visual: Step1Visual },
  { id: "2", visual: Step2Visual },
  { id: "3", visual: Step3Visual },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const buttonScale = useSharedValue(1);
  const steps = useMemo(() => {
    return isRTL ? [...BASE_STEPS].reverse() : BASE_STEPS;
  }, [isRTL]);
  const isLast = activeIndex === (isRTL ? 0 : steps.length - 1);

  const handleNext = () => {
    buttonScale.value = withSequence(
      withTiming(0.93, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 120 }),
    );

    if (isLast) {
      router.replace("/home");
      return;
    }
    const nextIndex = isRTL ? activeIndex - 1 : activeIndex + 1;
    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
  };
  const handleSkip = () => {
    router.replace("/home");
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const renderSlideItem = useCallback(
    ({ item }: { item: OnboardingStep }) => <SlideItem item={item} />,
    [],
  );
  useEffect(() => {
    if (isRTL) {
      flatListRef.current?.scrollToIndex({
        index: steps.length - 1,
        animated: false,
      });
    }
  }, [isRTL, steps.length]);
  return (
    <Screen>
      {/* Background gradients */}
      <View style={styles.bgTopRight} pointerEvents="none" />
      <View style={styles.bgBottomLeft} pointerEvents="none" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={{ width: 40 }} />
        <AppText style={styles.logo}>{t(APP_NAME_LARGE)}</AppText>
        {isLast ? (
          <View style={{ width: 40 }} />
        ) : (
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <AppText style={styles.skipText}>{t("onboarding.skip")}</AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* SLIDES */}
      <FlatList
        ref={flatListRef}
        data={steps}
        keyExtractor={(item) => item.id}
        renderItem={renderSlideItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={true}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        contentContainerStyle={{
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      />

      {/* BOTTOM NAV */}
      <BlurView intensity={60} tint="dark" style={styles.bottomNav}>
        <DotIndicator count={steps.length} activeIndex={activeIndex} />

        <Animated.View style={btnStyle}>
          <AppButton
            hasArrow={!isLast}
            onPress={handleNext}
            text={isLast ? t("onboarding.getStarted") : t("onboarding.next")}
          />
        </Animated.View>
      </BlurView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bgTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.6,
    height: height * 0.4,
    backgroundColor: Colors.primaryAlpha04,
    borderBottomLeftRadius: 999,
  },
  bgBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: width * 0.5,
    height: height * 0.3,
    backgroundColor: Colors.primaryContainerAlpha04,
    borderTopRightRadius: 999,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 8,
  },
  logo: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 6,
  },
  skipBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    width: 40,
  },
  skipText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 44,
    borderTopWidth: 0,
    overflow: "hidden",
  },
});
