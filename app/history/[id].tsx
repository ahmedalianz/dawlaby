import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import BottomView from "@/components/common/BottomView";
import Screen from "@/components/common/Screen";
import TopBar from "@/components/common/TopBar";
import SuggestionSection from "@/components/suggestions/SuggestionSection";
import { APP_NAME } from "@/constants/app";
import { HistoryItem } from "@/types";
import { deleteHistoryItem, formatDate, getHistoryItem } from "@/utils/history";
import { getColorHex } from "@/utils/normalization";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../../constants/colors";

const { height } = Dimensions.get("window");

export default function HistoryDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  // ── Load item ──
  useEffect(() => {
    const load = async () => {
      try {
        if (!id) throw new Error("No ID provided");
        const found = await getHistoryItem(id);
        if (!found) throw new Error("Look not found");
        setItem(found);
        fadeAnim.value = withTiming(1, { duration: 500 });
        slideAnim.value = withTiming(0, { duration: 500 });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load look");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Delete ──
  const handleDelete = useCallback(() => {
    Alert.alert(
      t("historyDetail.removeLook"),
      t("historyDetail.removeLookConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.remove"),
          style: "destructive",
          onPress: async () => {
            if (id) await deleteHistoryItem(id);
            router.back();
          },
        },
      ],
    );
  }, [t, id]);

  // ── Share ──
  const handleShare = useCallback(async () => {
    if (!item) return;
    try {
      await Share.share({
        message: `My ${APP_NAME} Style: ${item.result.style_vibe}\n\n"${item.result.stylist_note}"`,
      });
    } catch (e) {
      console.error("Share failed:", e);
    }
  }, [item]);

  // ─────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <AppText style={styles.loadingText}>
          {t("historyDetail.loading")}
        </AppText>
      </View>
    );
  }

  // ─────────────────────────────────────────
  // Error
  // ─────────────────────────────────────────
  if (error || !item) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={Colors.primary}
        />
        <AppText style={styles.errorText}>
          {error ?? t("historyDetail.lookNotFound")}
        </AppText>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <AppText style={styles.backBtnText}>{t("common.goBack")}</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const { result } = item;

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <Screen>
      {/* TOP BAR */}
      <TopBar
        firstButtonIcon="share-outline"
        secondButtonIcon="trash-outline"
        onFirstButtonPress={handleShare}
        onSecondButtonPress={handleDelete}
        title="historyDetail.title"
      />

      <AppScrollView fullScreen>
        {/* IMAGE */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: item.imageUri as string }}
            style={styles.outfitImage}
            resizeMode="cover"
          />

          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", Colors.surfaceOverlayDark]}
            style={styles.imageGradient}
          >
            {/* Style Vibe Badge */}
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.vibeBadge}
            >
              <AppText style={styles.vibeBadgeText}>
                {result.style_vibe}
              </AppText>
            </LinearGradient>

            {/* Date */}
            <AppText style={styles.dateText}>{formatDate(item.date)}</AppText>
          </LinearGradient>
        </View>

        {/* RESULT */}
        <Animated.View style={[styles.resultWrapper, fadeStyle]}>
          {/* Detected Items */}
          <SuggestionSection
            title={t("historyDetail.detectedItems")}
            icon="scan-outline"
          >
            <View style={styles.tagsRow}>
              {result.detected_items.map((item, i) => (
                <View key={item + i} style={styles.tag}>
                  <AppText style={styles.tagText}>{item}</AppText>
                </View>
              ))}
            </View>
          </SuggestionSection>

          {/* Color Palette */}
          <SuggestionSection
            title={t("historyDetail.colorPalette")}
            icon="color-palette-outline"
          >
            <View style={styles.tagsRow}>
              {result.color_palette.map((color, i) => (
                <View key={color + i} style={styles.colorTag}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: getColorHex(color) },
                    ]}
                  />
                  <AppText style={styles.tagText}>{color}</AppText>
                </View>
              ))}
            </View>
          </SuggestionSection>

          {/* Best For */}
          <SuggestionSection
            title={t("historyDetail.bestFor")}
            icon="calendar-outline"
          >
            <View style={styles.tagsRow}>
              {result.occasions.map((occ, i) => (
                <View key={occ + i} style={[styles.tag, styles.tagGold]}>
                  <AppText style={[styles.tagText, { color: Colors.primary }]}>
                    {occ}
                  </AppText>
                </View>
              ))}
            </View>
          </SuggestionSection>

          {/* Suggestions */}
          <SuggestionSection
            title={t("historyDetail.suggestions")}
            icon="sparkles-outline"
          >
            <View style={styles.suggestionsCol}>
              {result.suggestions.map((s, i) => (
                <View key={s.title + i} style={styles.suggestionCard}>
                  <LinearGradient
                    colors={[Colors.primaryAlpha08, "transparent"]}
                    style={styles.suggestionGradient}
                  >
                    <View style={styles.suggestionHeader}>
                      <View style={styles.suggestionDot} />
                      <AppText style={styles.suggestionTitle}>
                        {s.title}
                      </AppText>
                    </View>
                    <AppText style={styles.suggestionDesc}>
                      {s.description}
                    </AppText>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </SuggestionSection>

          {/* Stylist Note */}
          <View style={styles.stylistNote}>
            <LinearGradient
              colors={[Colors.primaryAlpha12, Colors.primaryAlpha06]}
              style={styles.stylistNoteGradient}
            >
              <Ionicons name="sparkles" size={16} color={Colors.primary} />
              <AppText style={styles.stylistNoteText}>
                {`"${result.stylist_note}"`}
              </AppText>
              <AppText style={styles.stylistNoteBy}>
                {t("historyDetail.aiStylist", { appName: t(APP_NAME) })}
              </AppText>
            </LinearGradient>
          </View>
        </Animated.View>
      </AppScrollView>

      {/* BOTTOM ACTIONS */}
      <BottomView>
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={() => router.push("/camera")}
        >
          <Ionicons name="camera-outline" size={18} color={Colors.secondary} />
          <AppText style={styles.cameraBtnText}>
            {t("historyDetail.newLook")}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => router.back()}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.historyBtnGradient}
          >
            <Ionicons name="time-outline" size={18} color={Colors.onPrimary} />
            <AppText style={styles.historyBtnText}>
              {t("historyDetail.backToHistory")}
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </BottomView>
    </Screen>
  );
}

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  loadingText: { color: Colors.secondary, fontSize: 15 },
  errorText: {
    color: Colors.secondary,
    fontSize: 15,
    textAlign: "center",
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  backBtnText: { color: Colors.primary, fontWeight: "600" },

  imageCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    height: height * 0.48,
    backgroundColor: Colors.surfaceContainer,
  },
  outfitImage: { width: "100%", height: "100%" },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 60,
    gap: 8,
  },
  vibeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  vibeBadgeText: {
    color: Colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  dateText: {
    color: Colors.onSurfaceAlpha60,
    fontSize: 12,
    letterSpacing: 0.5,
  },

  resultWrapper: { gap: 0 },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },
  tagGold: {
    backgroundColor: Colors.primaryAlpha12,
    borderColor: Colors.primaryAlpha25,
  },
  tagText: { color: Colors.onSurface, fontSize: 12, fontWeight: "500" },
  colorTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5 },

  suggestionsCol: { gap: 12 },
  suggestionCard: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha12,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  suggestionGradient: { padding: 16 },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  suggestionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  suggestionTitle: {
    color: Colors.onSurface,
    fontSize: 13,
    fontWeight: "700",
  },
  suggestionDesc: {
    color: Colors.secondary,
    fontSize: 13,
    lineHeight: 20,
    paddingLeft: 16,
  },

  stylistNote: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  stylistNoteGradient: {
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha15,
    borderRadius: 16,
  },
  stylistNoteText: {
    color: Colors.onSurface,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  stylistNoteBy: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },

  cameraBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
    backgroundColor: Colors.surfaceContainerLow,
  },
  cameraBtnText: { color: Colors.secondary, fontSize: 13, fontWeight: "600" },
  historyBtn: { flex: 1, borderRadius: 14, overflow: "hidden" },
  historyBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  historyBtnText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
});
