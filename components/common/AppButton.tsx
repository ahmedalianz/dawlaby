import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import RtlArrow from "./RtlArrow";

interface AppButtonProps {
  onPress: () => void;
  text: string;
  hasArrow?: boolean;
}

const AppButton = ({ onPress, text, hasArrow }: AppButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} testID="app-button">
      <LinearGradient
        colors={[Colors.primary, Colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.btn}
      >
        <AppText style={styles.btnText}>{text}</AppText>
        {hasArrow && (
          <RtlArrow
            testID="arrow-icon"
            size={16}
            reversed
            color={Colors.onPrimary}
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: {
    color: Colors.onPrimary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
export default AppButton;
