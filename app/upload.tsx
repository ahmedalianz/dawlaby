import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import BottomView from "@/components/common/BottomView";
import Screen from "@/components/common/Screen";
import TopBar from "@/components/common/TopBar";
import { APP_NAME } from "@/constants/app";
import { OCCASIONS } from "@/constants/common";
import { UploadType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Colors } from "../constants/colors";

const { height } = Dimensions.get("window");

export default function UploadScreen() {
  const { t } = useTranslation();

  const [image, setImage] = useState<{
    uri: string;
    base64: string;
  } | null>(null);
  const [uploadType, setUploadType] = useState<UploadType>("outfit");
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [extraNote, setExtraNote] = useState("");

  // Animations
  const imageScale = useSharedValue(0.92);
  const imageOpacity = useSharedValue(0);
  const analyzeScale = useSharedValue(1);
  const placeholderPulse = useSharedValue(1);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: placeholderPulse.value }],
  }));
  const imageOpacityStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));
  const analyzeScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: analyzeScale.value }],
  }));

  // Placeholder pulse
  useEffect(() => {
    placeholderPulse.value = withRepeat(
      withTiming(1.04, { duration: 1400 }),
      -1,
      true,
    );
  }, []);

  // ── Pick Image ──
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.85,
      base64: true,
      allowsEditing: true,
      aspect: uploadType === "item" ? [3, 4] : undefined,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const manipulator = ImageManipulator.manipulate(asset.uri);
      manipulator.resize({ width: 1080 });

      const imageRef = await manipulator.renderAsync();

      const compressedImage = await imageRef.saveAsync({
        compress: 0.7,
        format: SaveFormat.JPEG,
        base64: true,
      });
      setImage({
        uri: compressedImage.uri,
        base64: compressedImage.base64 ?? "",
      });

      // Animate image in
      imageScale.value = 0.88;
      imageOpacity.value = 0;

      imageScale.value = withSpring(1, {
        stiffness: 120,
        damping: 12,
      });

      imageOpacity.value = withTiming(1, { duration: 350 });
    }
  };

  const goToSuggestions = () => {
    if (!image) return;
    // Build context string
    const context = [
      uploadType === "item"
        ? "This image contains a single clothing item."
        : "This image shows a complete outfit.",

      selectedOccasion
        ? `The outfit is intended for: ${t(selectedOccasion)}.`
        : "",

      extraNote.trim() ? `Additional user input: ${extraNote.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    router.push({
      pathname: "/suggestions",
      params: {
        imageUri: image.uri,
        context,
      },
    });
  };

  // ── Analyze ──
  const handleAnalyze = () => {
    if (!image) return;
    // Animate button press
    analyzeScale.value = withSequence(
      withTiming(0.96, { duration: 100 }),
      withSpring(1, {}, (finished) => {
        if (finished) {
          scheduleOnRN(goToSuggestions);
        }
      }),
    );
  };

  const clearImage = () => {
    setImage(null);
    setSelectedOccasion(null);
    setExtraNote("");
  };

  const canAnalyze = !!image;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Screen>
        {/* ── TOP BAR ── */}
        <TopBar
          firstButtonIcon={image ? "trash-outline" : undefined}
          onFirstButtonPress={image ? clearImage : undefined}
          title={t("upload.title")}
        />
        <AppScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── UPLOAD TYPE TOGGLE ── */}
          <View style={styles.typeToggle}>
            {(["outfit", "item"] as UploadType[]).map((type) => {
              const active = uploadType === type;
              const label =
                type === "outfit"
                  ? "upload.fullOutfitToggle"
                  : "upload.singleItemToggle";
              const icon = type === "outfit" ? "body-outline" : "shirt-outline";
              return (
                <TouchableOpacity
                  key={type}
                  style={styles.typeBtn}
                  onPress={() => setUploadType(type)}
                  activeOpacity={0.8}
                >
                  {active ? (
                    <LinearGradient
                      colors={[Colors.primary, Colors.primaryContainer]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.typeBtnInner}
                    >
                      <Ionicons
                        name={icon as any}
                        size={16}
                        color={Colors.onPrimary}
                      />
                      <AppText
                        style={[
                          styles.typeBtnText,
                          { color: Colors.onPrimary },
                        ]}
                      >
                        {t(label)}
                      </AppText>
                    </LinearGradient>
                  ) : (
                    <View style={styles.typeBtnInnerInactive}>
                      <Ionicons
                        name={icon as any}
                        size={16}
                        color={Colors.secondary}
                      />
                      <AppText style={styles.typeBtnText}>{t(label)}</AppText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── IMAGE AREA ── */}
          {image ? (
            // Image preview
            <View style={styles.previewWrapper}>
              <Animated.View style={[styles.previewCard, imageOpacityStyle]}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />

                {/* Overlay top-right: retake button */}
                <TouchableOpacity style={styles.retakeBtn} onPress={pickImage}>
                  <BlurView
                    intensity={60}
                    tint="dark"
                    style={styles.retakeBtnInner}
                  >
                    <Ionicons
                      name="swap-horizontal"
                      size={16}
                      color={Colors.primary}
                    />
                    <AppText style={styles.retakeBtnText}>
                      {t("upload.changeBtn")}
                    </AppText>
                  </BlurView>
                </TouchableOpacity>

                {/* Bottom badge */}
                <View style={styles.previewBadge}>
                  <LinearGradient
                    colors={["transparent", Colors.surfaceOverlayHigh]}
                    style={styles.previewBadgeGradient}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={Colors.primary}
                    />
                    <AppText style={styles.previewBadgeText}>
                      {uploadType === "outfit"
                        ? t("upload.outfitReady")
                        : t("upload.itemReady")}{" "}
                      ·{t("upload.analyzeMsg", { appName: t(APP_NAME) })}
                    </AppText>
                  </LinearGradient>
                </View>
              </Animated.View>
            </View>
          ) : (
            // Empty state - tap to pick
            <Animated.View style={scaleStyle}>
              <TouchableOpacity
                style={styles.dropzone}
                onPress={pickImage}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[
                    Colors.primaryAlpha05,
                    Colors.primaryContainerAlpha05,
                  ]}
                  style={styles.dropzoneInner}
                >
                  {/* Dashed border effect via corners */}
                  <View style={[styles.dzCorner, styles.dzTL]} />
                  <View style={[styles.dzCorner, styles.dzTR]} />
                  <View style={[styles.dzCorner, styles.dzBL]} />
                  <View style={[styles.dzCorner, styles.dzBR]} />

                  <View style={styles.dropzoneContent}>
                    <LinearGradient
                      colors={[
                        Colors.primaryAlpha15,
                        Colors.primaryContainerAlpha10,
                      ]}
                      style={styles.uploadIconWrapper}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={44}
                        color={Colors.primary}
                      />
                    </LinearGradient>

                    <AppText style={styles.dropzoneTitle}>
                      {uploadType === "outfit"
                        ? t("upload.uploadOutfitBtn")
                        : t("upload.uploadItemBtn")}
                    </AppText>
                    <AppText style={styles.dropzoneSubtitle}>
                      {t("upload.browseGallerySubtitle")}
                    </AppText>

                    <View style={styles.dropzonePill}>
                      <Ionicons
                        name="images-outline"
                        size={13}
                        color={Colors.primary}
                      />
                      <AppText style={styles.dropzonePillText}>
                        JPG · PNG · WEBP
                      </AppText>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ── OCCASION (only when image selected) ── */}
          {image && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Colors.primary}
                />
                <AppText style={styles.sectionTitle}>
                  {t("upload.occasionHeader")}
                </AppText>
                <View style={styles.sectionLine} />
                <AppText style={styles.sectionOptional}>
                  {t("upload.optional")}
                </AppText>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.occasionRow}
              >
                {OCCASIONS.map((occ) => {
                  const active = selectedOccasion === occ.label;
                  return (
                    <TouchableOpacity
                      key={occ.label}
                      onPress={() =>
                        setSelectedOccasion(active ? null : occ.label)
                      }
                      activeOpacity={0.8}
                    >
                      {active ? (
                        <LinearGradient
                          colors={[Colors.primaryAlpha20, Colors.border]}
                          style={styles.occasionChipActive}
                        >
                          <Ionicons
                            name={occ.icon as any}
                            size={14}
                            color={Colors.primary}
                          />
                          <AppText
                            style={[
                              styles.occasionText,
                              { color: Colors.primary },
                            ]}
                          >
                            {t(occ.label)}
                          </AppText>
                        </LinearGradient>
                      ) : (
                        <View style={styles.occasionChip}>
                          <Ionicons
                            name={occ.icon as any}
                            size={14}
                            color={Colors.secondary}
                          />
                          <AppText style={styles.occasionText}>
                            {t(occ.label)}
                          </AppText>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* ── EXTRA NOTE ── */}
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="chatbubble-outline"
                  size={14}
                  color={Colors.primary}
                />
                <AppText style={styles.sectionTitle}>
                  {t("upload.noteHeader")}
                </AppText>
                <View style={styles.sectionLine} />
                <AppText style={styles.sectionOptional}>
                  {t("upload.optional")}
                </AppText>
              </View>

              <View style={styles.noteWrapper}>
                <TextInput
                  style={styles.noteInput}
                  value={extraNote}
                  onChangeText={setExtraNote}
                  placeholder={
                    uploadType === "item"
                      ? t("upload.notePlaceholderItem")
                      : t("upload.notePlaceholderOutfit")
                  }
                  placeholderTextColor={Colors.secondaryAlpha30}
                  multiline
                  maxLength={160}
                  selectionColor={Colors.primary}
                />
                <AppText style={styles.noteCount}>
                  {extraNote.length}/160
                </AppText>
              </View>
            </>
          )}

          {/* ── TIPS (when no image) ── */}
          {!image && (
            <View style={styles.tipsSection}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color={Colors.primary}
                />
                <AppText style={styles.sectionTitle}>
                  {t("upload.tipsHeader")}
                </AppText>
                <View style={styles.sectionLine} />
              </View>
              {[
                {
                  icon: "sunny-outline",
                  tip: "tip1",
                },
                {
                  icon: "expand-outline",
                  tip: "tip2",
                },
                {
                  icon: "contrast-outline",
                  tip: "tip3",
                },
                {
                  icon: "image-outline",
                  tip: "tip4",
                },
              ].map((type, i) => (
                <View key={type.icon + i} style={styles.tipRow}>
                  <View style={styles.tipIconWrapper}>
                    <Ionicons
                      name={type.icon as any}
                      size={16}
                      color={Colors.primary}
                    />
                  </View>
                  <AppText style={styles.tipText}>
                    {t(`upload.${type.tip}`)}
                  </AppText>
                </View>
              ))}
            </View>
          )}
        </AppScrollView>

        {/* ── ANALYZE BUTTON ── */}
        <BottomView>
          {image ? (
            <Animated.View style={[styles.analyzeWrapper, analyzeScaleStyle]}>
              <TouchableOpacity
                onPress={handleAnalyze}
                activeOpacity={0.9}
                disabled={!canAnalyze}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryContainer]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.analyzeBtn}
                >
                  <AppText style={styles.analyzeBtnText}>
                    {t("upload.analyzeActionBtn", { appName: t(APP_NAME) })}
                  </AppText>
                  <Ionicons
                    name="sparkles"
                    size={20}
                    color={Colors.onPrimary}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <TouchableOpacity style={styles.galleryBtn} onPress={pickImage}>
              <Ionicons
                name="images-outline"
                size={20}
                color={Colors.secondary}
              />
              <AppText style={styles.galleryBtnText}>
                {t("upload.browseGalleryBtn")}
              </AppText>
            </TouchableOpacity>
          )}
        </BottomView>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Type Toggle
  typeToggle: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  typeBtn: { flex: 1, borderRadius: 14, overflow: "hidden" },
  typeBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  typeBtnInnerInactive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha25,
    borderRadius: 14,
  },
  typeBtnText: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 20,
  },
  // Dropzone
  dropzone: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
    height: height * 0.38,
  },
  dropzoneInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha15,
    borderStyle: "dashed",
  },
  dzCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: Colors.primaryAlpha45,
  },
  dzTL: {
    top: 12,
    left: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 6,
  },
  dzTR: {
    top: 12,
    right: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 6,
  },
  dzBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 6,
  },
  dzBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 6,
  },
  dropzoneContent: { alignItems: "center", gap: 12 },
  uploadIconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha20,
    marginBottom: 4,
  },
  dropzoneTitle: {
    color: Colors.onSurface,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  dropzoneSubtitle: {
    color: Colors.secondary,
    fontSize: 13,
    opacity: 0.7,
  },
  dropzonePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryAlpha10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha15,
  },
  dropzonePillText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },

  // Preview
  previewWrapper: { marginBottom: 28 },
  previewCard: {
    borderRadius: 20,
    overflow: "hidden",
    height: height * 0.45,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  previewImage: { width: "100%", height: "100%" },
  retakeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    borderRadius: 12,
    overflow: "hidden",
  },
  retakeBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retakeBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  previewBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  previewBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  previewBadgeText: {
    color: Colors.onSurfaceAlpha75,
    fontSize: 12,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariantAlpha20,
  },
  sectionOptional: {
    color: Colors.secondaryAlpha30,
    fontSize: 10,
  },

  // Occasions
  occasionRow: {
    gap: 8,
    paddingBottom: 24,
    paddingRight: 8,
  },
  occasionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },
  occasionChipActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha35,
  },
  occasionText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: "500",
  },

  // Note
  noteWrapper: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
    marginBottom: 8,
  },
  noteInput: {
    color: Colors.onSurface,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 72,
  },
  noteCount: {
    color: Colors.secondaryAlpha25,
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },

  // Tips
  tipsSection: { marginTop: 8, gap: 10 },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha15,
  },
  tipIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryAlpha10,
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    color: Colors.secondary,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },

  galleryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha30,
    backgroundColor: Colors.surfaceContainerLow,
  },
  galleryBtnText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: "600",
  },
  analyzeWrapper: { width: "100%" },
  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 14,
  },
  analyzeBtnText: {
    color: Colors.onPrimary,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
});
