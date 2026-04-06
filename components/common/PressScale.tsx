import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  scale?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  activeOpacity?: number;
}

const PressScale: React.FC<Readonly<Props>> = ({
  children,
  onPress,
  scale = 0.8,
  style,
  disabled,
  activeOpacity = 1,
}: Props) => {
  const scaleAnim = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scaleAnim.value }] };
  });
  const onPressIn = () => {
    scaleAnim.value = withSpring(scale, { damping: 200 });
  };

  const onPressOut = () => {
    scaleAnim.value = withSpring(1, { damping: 200 });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      activeOpacity={activeOpacity}
    >
      <Animated.View style={[style, scaleStyle]}>{children}</Animated.View>
    </TouchableOpacity>
  );
};
export default PressScale;
