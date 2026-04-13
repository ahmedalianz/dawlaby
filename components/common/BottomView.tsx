import { Colors } from "@/constants/colors";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomView = ({
  children,
  testID,
}: {
  children: React.ReactNode;
  testID?: string;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <BlurView
      testID={testID}
      intensity={60}
      tint="dark"
      style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: Colors.surface,
  },
});
export default BottomView;
