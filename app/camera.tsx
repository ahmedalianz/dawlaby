import LoaderDot from "@/components/camera/LoaderDot";
import AppText from "@/components/common/AppText";
import Screen from "@/components/common/Screen";
import { APP_NAME } from "@/constants/app";
import { Mode } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { launchImageLibraryAsync } from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/colors";

export default function CameraScreen() {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [mode, setMode] = useState<Mode>(Mode.Photo);
  const [flash, setFlash] = useState<FlashMode>("off");
  const [capturing, setCapturing] = useState(false); // loader state

  const cameraRef = useRef<CameraView | null>(null);
  const pulseAnim = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      true,
    );
  }, []);
  // ── Take Photo ──
  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true); // show loader immediately
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (photo) {
        const manipulator = ImageManipulator.manipulate(photo.uri);
        manipulator.resize({ width: 1080 });

        const imageRef = await manipulator.renderAsync();

        const compressedImage = await imageRef.saveAsync({
          compress: 0.7,
          format: SaveFormat.JPEG,
          base64: false,
        });
        router.push({
          pathname: "/suggestions",
          params: { imageUri: compressedImage.uri },
        });
      }
    } catch (e) {
      console.error(e);
      setCapturing(false);
    }
  }, [capturing]);

  // ── Pick from Gallery ──
  const pickFromGallery = useCallback(async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
      base64: false,
    });
    if (!result.canceled) {
      setCapturing(true);
      const asset = result.assets[0];
      const manipulator = ImageManipulator.manipulate(asset.uri);
      manipulator.resize({ width: 1080 });

      const imageRef = await manipulator.renderAsync();

      const compressedImage = await imageRef.saveAsync({
        compress: 0.7,
        format: SaveFormat.JPEG,
        base64: false,
      });

      router.push({
        pathname: "/suggestions",
        params: { imageUri: compressedImage.uri },
      });
    }
  }, []);

  // ── Toggle Flash ──
  const toggleFlash = useCallback(() => {
    setFlash((f) => {
      if (f === "off") return "on";
      if (f === "on") return "auto";
      return "off";
    });
  }, []);

  const flashIcon = () => {
    if (flash === "on") return "flash";
    if (flash === "auto") return "flash-outline"; // will show "A" label
    return "flash-off-outline";
  };

  // ── Flip Camera ──
  const flipCamera = () => {
    setFacing((f) => (f === "back" ? "front" : "back"));
  };

  useFocusEffect(
    useCallback(() => {
      setCapturing(false);
    }, []),
  );
  // ── Permission Check ──
  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionScreen]}>
        <Ionicons name="camera-outline" size={64} color={Colors.primary} />
        <AppText style={styles.permissionTitle}>
          {t("camera.permissionTitle")}
        </AppText>
        <AppText style={styles.permissionSub}>
          {t("camera.permissionSub", { appName: t(APP_NAME) })}
        </AppText>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryContainer]}
            style={styles.permissionBtnInner}
          >
            <AppText style={styles.permissionBtnText}>
              {t("camera.allowCamera")}
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => Linking.openSettings()}
        >
          <AppText style={styles.settingsBtnText}>
            {t("camera.openSettings")}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Screen>
      {/* ── CAMERA VIEW ── */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      />

      {/* ── GRADIENT OVERLAY ── */}
      <View style={styles.gradientOverlay} pointerEvents="none">
        <LinearGradient
          colors={[
            Colors.surfaceOverlayMedium,
            "transparent",
            "transparent",
            Colors.surfaceOverlayHigh,
          ]}
          locations={[0, 0.2, 0.72, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* ── FRAME CORNERS (Portrait = tighter frame hint) ── */}
      <View
        style={[
          styles.frameContainer,
          mode === Mode.Portrait && styles.frameContainerPortrait,
        ]}
        pointerEvents="none"
      >
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Portrait mode: face oval guide */}
        {mode === Mode.Portrait && <View style={styles.ovalGuide} />}
      </View>

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={Colors.onSurface} />
        </TouchableOpacity>

        <BlurView intensity={40} tint="dark" style={styles.modeBadge}>
          <AppText style={styles.modeBadgeText}>
            {mode === Mode.Portrait
              ? t("camera.portraitMode")
              : t("camera.previewMode")}
          </AppText>
        </BlurView>

        {/* Flash Button */}
        <TouchableOpacity
          style={[styles.iconBtn, flash !== "off" && styles.iconBtnActive]}
          onPress={toggleFlash}
        >
          <Ionicons
            name={flashIcon()}
            size={22}
            color={flash === "off" ? Colors.onSurface : Colors.primary}
          />
          {flash === "auto" && (
            <View style={styles.flashAutoLabel}>
              <AppText style={styles.flashAutoText}>A</AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── CENTER LABEL ── */}
      <View style={styles.centerLabel} pointerEvents="none">
        <AppText style={styles.centerLabelText}>
          {mode === Mode.Portrait
            ? t("camera.faceCapture")
            : t("camera.outfitAnalysis")}
        </AppText>
        <View style={styles.centerLabelLine} />
        {mode === Mode.Portrait && (
          <AppText style={styles.centerHint}>{t("camera.centerFace")}</AppText>
        )}
      </View>

      {/* ── BOTTOM CONTROLS ── */}
      <View style={styles.bottomControls}>
        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          {[Mode.Photo, Mode.Portrait].map((m) => (
            <TouchableOpacity key={m} onPress={() => setMode(m)}>
              <AppText
                style={[styles.modeText, mode === m && styles.modeTextActive]}
              >
                {m}
              </AppText>
              {mode === m && <View style={styles.modeUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Actions Row */}
        <View style={styles.actionsRow}>
          {/* Gallery */}
          <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery}>
            <Ionicons name="images-outline" size={26} color="white" />
          </TouchableOpacity>

          {/* Capture Button */}
          <View style={styles.captureWrapper}>
            <Animated.View style={[styles.captureRing, pulseStyle]} />
            <TouchableOpacity
              onPress={takePhoto}
              activeOpacity={0.85}
              disabled={capturing}
            >
              <LinearGradient
                colors={
                  capturing
                    ? [Colors.primaryAlpha40, Colors.primaryContainerAlpha40]
                    : [Colors.primary, Colors.primaryContainer]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.captureBtn}
              >
                <View style={styles.captureBtnInner}>
                  <Ionicons
                    name={capturing ? "hourglass-outline" : "camera"}
                    size={30}
                    color={Colors.onPrimary}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Flip */}
          <TouchableOpacity style={styles.iconBtn} onPress={flipCamera}>
            <Ionicons
              name="camera-reverse-outline"
              size={26}
              color={Colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Hint */}
        <BlurView intensity={30} tint="dark" style={styles.hintContainer}>
          <AppText style={styles.hintText}>
            {mode === Mode.Portrait
              ? t("camera.portraitHint")
              : t("camera.photoHint")}
          </AppText>
        </BlurView>
      </View>

      {/* ── CAPTURE LOADER OVERLAY ── */}
      {capturing && (
        <View style={styles.loaderOverlay}>
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          {/* Shutter flash effect */}
          <View style={styles.loaderContent}>
            <View style={styles.loaderSpinnerWrapper}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loaderRing}
              />
              <View style={styles.loaderCenter}>
                <Ionicons name="sparkles" size={28} color={Colors.primary} />
              </View>
            </View>
            <AppText style={styles.loaderTitle}>
              {t("camera.capturing")}
            </AppText>
            <AppText style={styles.loaderSubtitle}>
              {t("camera.preparing", { appName: t(APP_NAME) })}
            </AppText>
            <View style={styles.loaderDots}>
              {[0, 1, 2].map((i) => (
                <LoaderDot key={i} delay={i * 200} />
              ))}
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },

  permissionScreen: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 40,
  },
  permissionTitle: {
    color: Colors.onSurface,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  permissionSub: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  permissionBtn: {
    marginTop: 8,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  permissionBtnInner: { paddingVertical: 16, alignItems: "center" },
  permissionBtnText: {
    color: Colors.onPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  settingsBtn: {
    marginTop: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  settingsBtnText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  gradientOverlay: { ...StyleSheet.absoluteFillObject },

  // Frame
  frameContainer: {
    position: "absolute",
    top: 100,
    left: 24,
    right: 24,
    bottom: 180,
  },
  frameContainerPortrait: {
    top: 120,
    left: 48,
    right: 48,
    bottom: 220,
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: Colors.primaryAlpha55,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 6,
  },
  ovalGuide: {
    position: "absolute",
    alignSelf: "center",
    top: "10%",
    width: "55%",
    height: "45%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha25,
    borderStyle: "dashed",
  },

  // Top Bar
  topBar: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceOverlayMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnActive: {
    backgroundColor: Colors.primaryAlpha15,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha30,
  },
  flashAutoLabel: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 3,
  },
  flashAutoText: { fontSize: 8, fontWeight: "800", color: Colors.onPrimary },

  modeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },
  modeBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  // Center Label
  centerLabel: {
    position: "absolute",
    top: "44%",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 8,
  },
  centerLabelText: {
    color: Colors.onSurfaceAlpha60,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  centerLabelLine: {
    width: 32,
    height: 1,
    backgroundColor: Colors.primary,
  },
  centerHint: {
    color: Colors.onSurfaceAlpha40,
    fontSize: 11,
    letterSpacing: 1,
  },

  // Bottom
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 44,
    alignItems: "center",
    gap: 24,
  },
  modeSelector: { flexDirection: "row", gap: 40 },
  modeText: {
    color: Colors.onSurfaceAlpha40,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
  },
  modeTextActive: { color: Colors.primary },
  modeUnderline: {
    marginTop: 4,
    height: 1,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 48,
  },
  galleryBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.whiteAlpha20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceOverlayLow,
  },
  galleryThumb: { width: "100%", height: "100%" },

  captureWrapper: { alignItems: "center", justifyContent: "center" },
  captureRing: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha35,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  captureBtnInner: {
    flex: 1,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.onPrimaryAlpha30,
    alignItems: "center",
    justifyContent: "center",
  },

  hintContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha10,
  },
  hintText: {
    color: Colors.onSurfaceAlpha80,
    fontSize: 12,
    textAlign: "center",
  },

  // ── Capture Loader Overlay ──
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  loaderContent: {
    alignItems: "center",
    gap: 16,
  },
  loaderSpinnerWrapper: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
  },
  loaderCenter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceOverlayContainerStrong,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha30,
  },
  loaderTitle: {
    color: Colors.onSurface,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  loaderSubtitle: {
    color: Colors.secondary,
    fontSize: 13,
  },
  loaderDots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
});
