import { Colors } from "@/constants/colors";
import { useDirection } from "@/store/DirectionContext";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const DotIndicator: React.FC<
  Readonly<{ count: number; activeIndex: number }>
> = ({ count, activeIndex }) => {
  const { isRTL } = useDirection();
  return (
    <View style={[dot.row, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <Animated.View
            key={i}
            style={[dot.base, isActive ? dot.active : dot.inactive]}
          />
        );
      })}
    </View>
  );
};

const dot = StyleSheet.create({
  row: {
    alignItems: "center",
    gap: 8,
  },
  base: {
    height: 6,
    borderRadius: 3,
  },
  active: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  inactive: {
    width: 6,
    backgroundColor: Colors.secondaryAlpha25,
  },
});

export default DotIndicator;
