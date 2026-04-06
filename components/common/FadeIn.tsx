import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface Props {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromY?: number;
  style?: StyleProp<ViewStyle>;
}

const FadeIn: React.FC<Readonly<Props>> = ({
  children,
  delay = 0,
  duration = 500,
  fromY = 20,
  style,
}: Props) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(fromY);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    translateY.value = withDelay(delay, withTiming(0, { duration }));
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};
export default FadeIn;
