import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import Screen from "@/components/common/Screen";
import TopBar from "@/components/common/TopBar";
import ActionRow from "@/components/profile/ActionRow";
import Section from "@/components/profile/Section";
import StatPill from "@/components/profile/StatPill";
import ToggleRow from "@/components/profile/ToggleRow";
import { APP_NAME } from "@/constants/app";
import {
  DEFAULT_PREFS,
  DEFAULT_PROFILE,
  PREFS_KEY,
  PROFILE_KEY,
  STYLE_GOALS,
} from "@/constants/user";
import { useConfirm } from "@/store/ConfirmContext";
import { Preferences, UserProfile } from "@/types";
import { changeLanguage } from "@/utils/i18n";
import { loadPreferences, savePreferences } from "@/utils/preferences";
import { loadProfile, saveProfile } from "@/utils/profile";
import { Storage } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { clearHistory, getHistory } from "../utils/history";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFS);
  const [stats, setStats] = useState({ looks: 0 });
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  const fadeAnim = useSharedValue(0);
  const avatarScale = useSharedValue(0.9);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));
  const init = useCallback(() => {
    const profile = loadProfile();
    const preferences = loadPreferences();
    const history = getHistory();
    setProfile(profile);
    setPreferences(preferences);
    setNameInput(profile.name);
    setBioInput(profile.bio);
    setStats({ looks: history.length });
    fadeAnim.value = withTiming(1, { duration: 500 });
    avatarScale.value = withSpring(1, {
      stiffness: 120,
      damping: 12,
      mass: 0.8,
    });
  }, []);
  useEffect(() => {
    init();
  }, [init]);

  // ── Update helpers ──
  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveProfile(updated);
  };

  const updatePreferences = (updates: Partial<Preferences>) => {
    const updated = { ...preferences, ...updates };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleLanguagePress = async (lang: string) => {
    if (i18n.language === lang) return;
    const ok = await confirm({
      icon: "language-outline",
      title: t("profile.changeLanguage"),
      subtitle: t("profile.changeLanguageSub"),
      confirmLabel: t("confirm"),
      cancelLabel: t("cancel"),
      variant: "warning",
    });
    if (ok) await changeLanguage(lang);
  };

  // ── Pick Avatar ──
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const manipulator = ImageManipulator.manipulate(result.assets[0].uri);
      manipulator.resize({ width: 500 });

      const imageRef = await manipulator.renderAsync();

      const compressedImage = await imageRef.saveAsync({
        compress: 0.7,
        format: SaveFormat.JPEG,
        base64: false,
      });

      updateProfile({ avatarUri: compressedImage.uri });
    }
  };

  // ── Save Name ──
  const saveName = () => {
    setEditingName(false);
    updateProfile({ name: nameInput.trim() || "Dawlaby user" });
  };

  // ── Save Bio ──
  const saveBio = () => {
    setEditingBio(false);
    updateProfile({ bio: bioInput.trim() });
  };

  // ── Clear History ──
  const handleClearHistory = async () => {
    const ok = await confirm({
      icon: "trash-outline",
      title: t("profile.clearHistory"),
      subtitle: t("profile.clearHistoryConfirm"),
      confirmLabel: t("clear"),
      cancelLabel: t("cancel"),
      variant: "danger",
    });
    if (ok) {
      clearHistory();
      setStats({ looks: 0 });
    }
  };

  const handleResetProfile = async () => {
    const ok = await confirm({
      icon: "person-remove-outline",
      title: t("profile.resetProfile"),
      subtitle: t("profile.resetProfileConfirm"),
      confirmLabel: t("reset"),
      cancelLabel: t("cancel"),
      variant: "danger",
    });
    if (ok) {
      Storage.remove(PROFILE_KEY);
      Storage.remove(PREFS_KEY);
      setProfile(DEFAULT_PROFILE);
      setPreferences(DEFAULT_PREFS);
      setNameInput("");
      setBioInput("");
    }
  };

  const handleShareApp = async () => {
    try {
      const message = t("profile.shareSub");

      const result = await Share.share({
        message: message,
        url:
          Platform.OS === "ios"
            ? "https://apps.apple.com/app/YOUR_APP_ID" // Replace with your real App Store link
            : "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME", // Replace with your real Play Store link
        title: `${APP_NAME} - AI Fashion Stylist`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        }
      }
    } catch (error: any) {
      console.error("Share error:", error);
      const ok = await confirm({
        icon: "share-outline",
        title: t("shareFailed"),
        subtitle: t("shareFailedMsg"),
        confirmLabel: t("confirm"),
        cancelLabel: t("cancel"),
        variant: "warning",
      });
      if (ok) {
        handleShareApp();
      }
    }
  };

  return (
    <Screen>
      {/* ── TOP BAR ── */}
      <TopBar title={t("profile.title")} />

      <AppScrollView style={fadeStyle} fullScreen>
        {/* ── AVATAR + NAME SECTION ── */}
        <LinearGradient
          colors={[Colors.primaryAlpha08, "transparent"]}
          style={styles.heroSection}
        >
          {/* Avatar */}
          <Animated.View style={[styles.avatarWrapper, scaleStyle]}>
            <TouchableOpacity onPress={pickAvatar} activeOpacity={0.85}>
              {profile.avatarUri ? (
                <Animated.Image
                  source={{ uri: profile.avatarUri }}
                  style={styles.avatar}
                />
              ) : (
                <LinearGradient
                  colors={[Colors.primaryAlpha20, Colors.secondaryAlpha05]}
                  style={styles.avatarPlaceholder}
                >
                  <Ionicons name="person" size={48} color={Colors.primary} />
                </LinearGradient>
              )}
              {/* Edit badge */}
              <View style={styles.avatarEditBadge}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryContainer]}
                  style={styles.avatarEditBadgeGradient}
                >
                  <Ionicons name="camera" size={12} color={Colors.onPrimary} />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Name */}
          {editingName ? (
            <View style={styles.inlineEditRow}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                onBlur={saveName}
                onSubmitEditing={saveName}
                placeholder={t("profile.placeholderName")}
                placeholderTextColor={Colors.secondary}
                selectionColor={Colors.primary}
                maxLength={20}
              />
              <TouchableOpacity onPress={saveName}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.nameRow}
              onPress={() => setEditingName(true)}
            >
              <AppText style={styles.nameText}>
                {profile.name || t("profile.noName")}
              </AppText>
              <Ionicons
                name="pencil-outline"
                size={15}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          )}

          {/* Bio */}
          {editingBio ? (
            <View style={styles.bioEditWrapper}>
              <TextInput
                style={styles.bioInput}
                value={bioInput}
                onChangeText={setBioInput}
                autoFocus
                multiline
                onBlur={saveBio}
                placeholder={t("profile.placeholderBio")}
                placeholderTextColor={Colors.onSurfaceAlpha35}
                selectionColor={Colors.primary}
              />
              <TouchableOpacity onPress={saveBio} style={styles.bioDone}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingBio(true)}>
              <AppText style={styles.bioText}>
                {profile.bio || t("profile.noBio")}
              </AppText>
            </TouchableOpacity>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatPill
              value={stats.looks}
              label={t("profile.looks")}
              icon="shirt-outline"
            />
            <View style={styles.statsDivider} />
            <StatPill
              value={t(`profile.${profile.styleGoal}`)}
              label={t("profile.style")}
              icon="sparkles-outline"
              isText
            />
          </View>
        </LinearGradient>

        {/* ── STYLE GOAL ── */}
        <Section title={t("profile.styleGoal")} icon="color-palette-outline">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.goalRow}>
              {STYLE_GOALS.map((goal) => {
                const active = profile.styleGoal === goal;
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => updateProfile({ styleGoal: goal })}
                    activeOpacity={0.8}
                  >
                    {active ? (
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryContainer]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.goalChip}
                      >
                        <AppText
                          style={[
                            styles.goalChipText,
                            { color: Colors.onPrimary },
                          ]}
                        >
                          {t(`profile.${goal}`)}
                        </AppText>
                      </LinearGradient>
                    ) : (
                      <View style={styles.goalChipInactive}>
                        <AppText style={styles.goalChipText}>
                          {t(`profile.${goal}`)}
                        </AppText>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Section>

        {/* ── APP LANGUAGE ── */}
        <Section title={t("profile.language")} icon="language-outline">
          <View style={styles.langRow}>
            {(["en", "ar"] as const).map((lang) => {
              const active = i18n.language === lang;
              const label =
                lang === "en" ? t("profile.english") : t("profile.arabic");
              return (
                <TouchableOpacity
                  testID="app-language-change"
                  key={lang}
                  style={[styles.langBtn, active && styles.langBtnActive]}
                  onPress={() => handleLanguagePress(lang)}
                >
                  <AppText
                    style={[
                      styles.langBtnText,
                      active && styles.langBtnTextActive,
                    ]}
                  >
                    {label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        {/* ── PREFERENCES ── */}
        <Section title={t("profile.preferences")} icon="settings-outline">
          <ToggleRow
            testID="save-history"
            label={t("profile.saveHistory")}
            sublabel={t("profile.saveHistorySub")}
            icon="time-outline"
            value={preferences.saveHistory}
            onToggle={(v) => updatePreferences({ saveHistory: v })}
          />
          <View style={styles.rowSeparator} />
          <ToggleRow
            testID="save-notifications"
            label={t("profile.notifications")}
            sublabel={t("profile.notificationsSub")}
            icon="notifications-outline"
            value={preferences.notifications}
            onToggle={(v) => updatePreferences({ notifications: v })}
          />
        </Section>

        {/* ── DATA & PRIVACY ── */}
        <Section title={t("profile.privacy")} icon="shield-outline">
          <ActionRow
            testID="clear-history"
            icon="trash-outline"
            label={t("profile.clearHistory")}
            sublabel={`${stats.looks} ${t("profile.looksStored")}`}
            onPress={handleClearHistory}
            danger
          />
          <View style={styles.rowSeparator} />
          <ActionRow
            testID="reset-profile"
            icon="person-remove-outline"
            label={t("profile.resetProfile")}
            sublabel={t("profile.resetProfileSub")}
            onPress={handleResetProfile}
            danger
          />
        </Section>

        {/* ── ABOUT ── */}
        <Section title={t("profile.about")} icon="information-circle-outline">
          <ActionRow
            icon="star-outline"
            label={t("profile.rateApp", { appName: t(APP_NAME) })}
            sublabel={t("profile.rateAppSub")}
            onPress={() => {}}
          />
          <View style={styles.rowSeparator} />
          <ActionRow
            icon="share-social-outline"
            label={t("profile.share")}
            sublabel={t("profile.shareSub")}
            onPress={handleShareApp}
          />
        </Section>

        {/* Version */}
        <AppText style={styles.version}>{t(APP_NAME)} · v1.0.0</AppText>

        {/* Gold divider */}
        <LinearGradient
          colors={["transparent", Colors.primary, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.footerLine}
        />
      </AppScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.outlineVariantAlpha30,
  },
  // ── Hero ──
  heroSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 8,
  },
  avatarWrapper: { marginBottom: 4 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha30,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  avatarEditBadgeGradient: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  // Name
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameText: {
    color: Colors.onSurface,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  inlineEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
    paddingBottom: 4,
  },
  nameInput: {
    color: Colors.onSurface,
    fontSize: 22,
    fontWeight: "700",
    minWidth: 140,
  },

  // Bio
  bioText: {
    color: Colors.secondary,
    fontSize: 13,
    textAlign: "center",
    opacity: 0.8,
  },
  bioEditWrapper: {
    width: "100%",
    position: "relative",
  },
  bioInput: {
    color: Colors.onSurface,
    fontSize: 13,
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: Colors.primaryAlpha30,
    paddingBottom: 4,
    paddingRight: 28,
  },
  bioDone: {
    position: "absolute",
    right: 0,
    bottom: 4,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 24,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },

  // Style Goal
  goalRow: { flexDirection: "row", gap: 10, padding: 14 },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  goalChipInactive: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha25,
  },
  goalChipText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: "600",
  },

  // Language
  langRow: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },
  langBtnActive: {
    backgroundColor: Colors.primaryAlpha10,
    borderColor: Colors.primaryAlpha40,
  },
  langBtnText: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: "600",
  },
  langBtnTextActive: { color: Colors.primary },

  // Pref Rows

  rowSeparator: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: Colors.outlineVariantAlpha15,
  },

  // Footer
  version: {
    color: Colors.onSurfaceAlpha35,
    fontSize: 11,
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 16,
  },
  footerLine: {
    height: 1,
    marginHorizontal: 60,
    opacity: 0.3,
  },
});
