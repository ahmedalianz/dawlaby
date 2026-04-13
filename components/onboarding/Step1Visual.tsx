import { Colors } from "@/constants/colors";
import { BLUR_HASH } from "@/constants/common";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
const { width } = Dimensions.get("window");

function Step1Visual() {
  return (
    <View style={step1Styles.container}>
      {/* Ambient glow */}
      <View style={step1Styles.glow} testID="glow" />

      {/* Gold ring */}
      <View style={step1Styles.ring}>
        <View style={step1Styles.ringInner}>
          <Image
            testID="step1-image"
            source={require("@/assets/images/onboarding/step1.webp")}
            placeholder={{ blurhash: BLUR_HASH }}
            style={step1Styles.image}
            contentFit="cover"
            transition={1000}
          />
        </View>
      </View>

      {/* Floating accents */}
      <View
        testID="floating-accent1"
        style={[step1Styles.dot, { top: 20, right: 20, width: 12, height: 12 }]}
      />
      <View
        testID="floating-accent2"
        style={[
          step1Styles.dot,
          { bottom: 60, left: 10, width: 6, height: 6, opacity: 0.6 },
        ]}
      />
    </View>
  );
}

const step1Styles = StyleSheet.create({
  container: {
    width: width * 0.75,
    height: width * 0.75,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: Colors.primaryAlpha07,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
  },
  ring: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha35,
    padding: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  ringInner: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainerLow,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dot: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: Colors.primaryContainer,
    opacity: 0.5,
  },
});
export default Step1Visual;
