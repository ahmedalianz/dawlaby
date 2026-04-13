import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { BLUR_HASH } from "@/constants/common";
import { useDirection } from "@/store/DirectionContext";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

function Step2Visual() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  return (
    <View style={step2Styles.container}>
      {/* Ambient glow */}
      <View style={step2Styles.glow} />

      {/* Phone mockup — slight tilt */}
      <View style={step2Styles.phone}>
        <View style={step2Styles.phoneInner}>
          <Image
            source={require("../../assets/images/onboarding/step2.webp")}
            placeholder={{ blurhash: BLUR_HASH }}
            style={step2Styles.image}
            contentFit="cover"
            transition={1000}
          />

          {/* Viewfinder corners */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View
              style={[
                step2Styles.corner,
                isRTL ? step2Styles.cornerTR : step2Styles.cornerTL,
              ]}
            />
            <View
              style={[
                step2Styles.corner,
                isRTL ? step2Styles.cornerTL : step2Styles.cornerTR,
              ]}
            />
            <View style={[step2Styles.corner, step2Styles.cornerBL]} />
            <View style={[step2Styles.corner, step2Styles.cornerBR]} />
          </View>

          {/* Style Vibe card */}
          <View
            style={[step2Styles.vibeCard, isRTL ? { left: 12 } : { right: 12 }]}
          >
            <BlurView
              intensity={40}
              tint="dark"
              style={step2Styles.vibeBlur}
              testID="step2-blur"
            >
              <AppText style={step2Styles.vibeLabel}>
                {t("onboarding.analysisComplete")}
              </AppText>
              <View style={step2Styles.vibeRow}>
                <AppText style={step2Styles.vibeTitle}>
                  {t("onboarding.styleVibe")}{" "}
                </AppText>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryContainer]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={step2Styles.vibePill}
                >
                  <AppText style={step2Styles.vibePillText}>
                    {t("onboarding.cozyMinimal")}
                  </AppText>
                </LinearGradient>
              </View>
            </BlurView>
          </View>
        </View>
      </View>
    </View>
  );
}

const step2Styles = StyleSheet.create({
  container: {
    width: width * 0.58,
    height: height * 0.38,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "150%",
    height: "150%",
    borderRadius: 999,
    backgroundColor: Colors.primaryAlpha04,
  },
  phone: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
    transform: [{ rotate: "-2deg" }],
  },
  phoneInner: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: Colors.primaryAlpha60,
  },
  cornerTL: {
    top: 20,
    left: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 20,
    right: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 60,
    left: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 60,
    right: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  vibeCard: {
    position: "absolute",
    bottom: 20,

    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha15,
  },
  vibeBlur: {
    padding: 10,
    alignItems: "center",
    gap: 6,
  },
  vibeLabel: {
    color: Colors.onSurfaceAlpha50,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  vibeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vibeTitle: {
    color: Colors.onSurface,
    fontSize: 10,
    fontWeight: "700",
  },
  vibePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  vibePillText: {
    color: Colors.onPrimary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

export default Step2Visual;
