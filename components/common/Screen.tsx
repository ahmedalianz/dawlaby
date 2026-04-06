import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Screen = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
});
