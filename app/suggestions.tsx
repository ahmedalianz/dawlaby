import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import BottomView from "@/components/common/BottomView";
import Screen from "@/components/common/Screen";
import TopBar from "@/components/common/TopBar";
import SuggestionSection from "@/components/suggestions/SuggestionSection";
import { APP_NAME } from "@/constants/app";
import { useSuggestionAI } from "@/hooks/suggestions/useSuggestionAI";
import { useSuggestionAnimations } from "@/hooks/suggestions/useSuggestionAnimations";
import { OutfitResult } from "@/types";
import { getColorHex, normalizeParam } from "@/utils/normalization";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { Colors } from "../constants/colors";

const { height } = Dimensions.get("window");

export default function SuggestionScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    imageUri: string;
    context?: string;
  }>();
  const imageUri = normalizeParam(params.imageUri);
  const context = normalizeParam(params.context);

  const [result, setResult] = useState<OutfitResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const saveIcon = saved ? "bookmark" : "bookmark-outline";
  // ── Hooks ──
  const animations = useSuggestionAnimations();

  const { fetchSuggestion } = useSuggestionAI({
    imageUri,
    context,
    onLoading: setLoading,
    onResult: setResult,
    onError: setError,
    onAnimateIn: animations.animateIn,
  });

  // ── Load lang first, then fetch ──
  const init = useCallback(async () => {
    fetchSuggestion();
  }, [fetchSuggestion]);
  useEffect(() => {
    init();
  }, [init]);

  // ── Handlers ──
  const handleShare = useCallback(async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `My ${APP_NAME} Style: ${result.style_vibe}\n\n${result.stylist_note}`,
      });
    } catch (e) {
      console.error("Share failed", e);
    }
  }, [result]);

  const handleSave = useCallback(() => setSaved((s) => !s), []);

  const handleRetry = useCallback(() => {
    setError(null);
    setResult(null);
    setLoading(true);
    fetchSuggestion();
  }, [fetchSuggestion]);

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <Screen>
      {/* TOP BAR */}
      <TopBar
        firstButtonIcon={result ? saveIcon : undefined}
        secondButtonIcon={result ? "share-outline" : undefined}
        onFirstButtonPress={handleSave}
        onSecondButtonPress={handleShare}
        title={t("suggestions.topTitle")}
      />
      <AppScrollView>
        {/* IMAGE CARD */}
        {imageUri && (
          <View style={styles.imageCard}>
            <Image
              source={{ uri: imageUri }}
              style={styles.outfitImage}
              resizeMode="cover"
            />
            {result && (
              <Animated.View
                style={[styles.vibeBadge, animations.opacityStyle]}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryContainer]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.vibeBadgeGradient}
                >
                  <AppText style={styles.vibeBadgeText}>
                    {result.style_vibe}
                  </AppText>
                </LinearGradient>
              </Animated.View>
            )}
          </View>
        )}

        {/* LOADING */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <AppText style={styles.loadingText}>
              {t("suggestions.analyzing")}
            </AppText>
            <AppText style={styles.loadingSubText}>
              {t("suggestions.stylistAtWork", { appName: t(APP_NAME) })}
            </AppText>
            {[1, 2, 3].map((i) => (
              <Animated.View
                key={i}
                style={[styles.skeletonCard, animations.shimmerStyle]}
              />
            ))}
          </View>
        )}

        {/* ERROR */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={Colors.primary}
            />
            <AppText style={styles.errorText}>{error}</AppText>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={handleRetry}
              testID="retryBtn"
            >
              <AppText style={styles.retryBtnText}>
                {t("suggestions.tryAgain")}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
              <AppText style={styles.goBackText}>
                {t("suggestions.goBack")}
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* RESULT */}
        {result && (
          <Animated.View style={animations.slideStyle}>
            <SuggestionSection
              title={t("suggestions.detectedItems")}
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

            <SuggestionSection
              title={t("suggestions.colorPalette")}
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

            <SuggestionSection
              title={t("suggestions.bestFor")}
              icon="calendar-outline"
            >
              <View style={styles.tagsRow}>
                {result.occasions.map((occ, i) => (
                  <View key={occ + i} style={[styles.tag, styles.tagGold]}>
                    <AppText
                      style={[styles.tagText, { color: Colors.primary }]}
                    >
                      {occ}
                    </AppText>
                  </View>
                ))}
              </View>
            </SuggestionSection>

            <SuggestionSection
              title={t("suggestions.stylistSuggestions")}
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

            <View style={styles.stylistNote}>
              <LinearGradient
                colors={[Colors.primaryAlpha08, Colors.primaryContainerAlpha04]}
                style={styles.stylistNoteGradient}
              >
                <Ionicons name="sparkles" size={16} color={Colors.primary} />
                <AppText style={styles.stylistNoteText}>
                  {`"${result.stylist_note}"`}
                </AppText>
                <AppText style={styles.stylistNoteBy}>
                  {t("suggestions.aiStylist", { appName: t(APP_NAME) })}
                </AppText>
              </LinearGradient>
            </View>
          </Animated.View>
        )}
      </AppScrollView>

      {/* BOTTOM ACTIONS */}
      <BottomView>
        <TouchableOpacity
          style={styles.tryAnotherBtn}
          onPress={() => router.push("/camera")}
        >
          <Ionicons name="camera-outline" size={18} color={Colors.secondary} />
          <AppText style={styles.tryAnotherText}>
            {t("suggestions.tryAnother")}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.askVoiceWrapper}
          onPress={() => router.push("/voice")}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.askVoiceBtn}
          >
            <Ionicons name="mic" size={18} color={Colors.onPrimary} />
            <AppText style={styles.askVoiceText}>
              {t("suggestions.askByVoice")}
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </BottomView>
    </Screen>
  );
}

// ─────────────────────────────────────────
// Styles — unchanged
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  imageCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    height: height * 0.45,
    backgroundColor: Colors.surfaceContainer,
  },
  outfitImage: { width: "100%", height: "100%" },
  vibeBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  vibeBadgeGradient: { paddingHorizontal: 16, paddingVertical: 8 },
  vibeBadgeText: {
    color: Colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  loadingContainer: { alignItems: "center", paddingHorizontal: 24, gap: 12 },
  loadingText: { color: Colors.onSurface, fontSize: 16, fontWeight: "600" },
  loadingSubText: { color: Colors.secondary, fontSize: 13, marginBottom: 8 },
  skeletonCard: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  errorContainer: { alignItems: "center", padding: 40, gap: 12 },
  errorText: { color: Colors.secondary, fontSize: 15, textAlign: "center" },
  retryBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryBtnText: { color: Colors.primary, fontWeight: "600" },
  goBackText: {
    color: Colors.secondary,
    fontSize: 13,
    textDecorationLine: "underline",
    marginTop: 4,
  },
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
    backgroundColor: Colors.primaryAlpha10,
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
  suggestionTitle: { color: Colors.onSurface, fontSize: 13, fontWeight: "700" },
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
  tryAnotherBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha30,
    backgroundColor: Colors.surfaceContainerLow,
  },
  tryAnotherText: { color: Colors.secondary, fontSize: 13, fontWeight: "600" },
  askVoiceWrapper: { flex: 1, borderRadius: 14, overflow: "hidden" },
  askVoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  askVoiceText: { color: Colors.onPrimary, fontSize: 13, fontWeight: "700" },
});
