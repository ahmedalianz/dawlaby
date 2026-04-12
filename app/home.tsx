import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import BottomNavigationButton from "@/components/common/BottomNavigationButton";
import BottomView from "@/components/common/BottomView";
import FadeIn from "@/components/common/FadeIn";
import PressScale from "@/components/common/PressScale";
import Screen from "@/components/common/Screen";
import { APP_NAME_LARGE } from "@/constants/app";
import { DEFAULT_PROFILE } from "@/constants/user";
import { HistoryItem, UserProfile } from "@/types";
import { getHistory } from "@/utils/history";
import { loadProfile } from "@/utils/profile";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

export default function Home() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [recentLooks, setRecentLooks] = useState<HistoryItem[]>([]);

  const init = useCallback(async () => {
    const [profile, history] = await Promise.all([loadProfile(), getHistory()]);
    setProfile(profile);
    setRecentLooks(history.slice(0, 2));
  }, []);

  useEffect(() => {
    init();
  }, [init]);
  return (
    <Screen>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={{ width: 40 }} />
        <AppText style={styles.logo}>{t(APP_NAME_LARGE)}</AppText>
        <TouchableOpacity>
          <Image
            source={
              profile.avatarUri
                ? { uri: profile.avatarUri }
                : require("../assets/images/avatar.webp")
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      <AppScrollView fullScreen>
        {/* Hero Section */}
        <View style={styles.hero}>
          <FadeIn delay={100}>
            <AppText style={styles.heroTitle}>
              {t("home.hello")}
              <AppText style={styles.highlight}>
                {t("home.helloHighlight")}
              </AppText>
            </AppText>
          </FadeIn>
          <AppText style={styles.heroSubtitle}>{t("home.welcomeBack")}</AppText>
        </View>

        {/* Big Camera Button */}
        <View style={styles.cameraContainer}>
          <FadeIn delay={300} fromY={40}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              style={styles.cameraButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <PressScale
                activeOpacity={0.9}
                onPress={() => router.push("/camera")}
                style={styles.cameraInner}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={90}
                  color={Colors.onPrimary}
                  style={{ fontWeight: "700" }}
                />
              </PressScale>
            </LinearGradient>
          </FadeIn>

          {/* Glow effect */}
          <BlurView intensity={30} style={styles.glow} />
        </View>

        {/* Secondary Buttons */}
        <View style={styles.secondaryButtons}>
          <FadeIn delay={450}>
            <TouchableOpacity
              style={styles.secButton}
              onPress={() => router.push("/upload")}
            >
              <MaterialIcons
                name="file-upload"
                size={24}
                color={Colors.secondary}
              />
              <AppText style={styles.secButtonText}>
                {t("home.uploadPhoto")}
              </AppText>
            </TouchableOpacity>
          </FadeIn>
          <FadeIn delay={550}>
            <TouchableOpacity
              style={styles.secButton}
              onPress={() => router.push("/voice")}
            >
              <MaterialIcons name="mic" size={24} color={Colors.secondary} />
              <AppText style={styles.secButtonText}>
                {t("home.voiceAssistant")}
              </AppText>
            </TouchableOpacity>
          </FadeIn>
        </View>

        {/* Recently Curated */}
        {recentLooks.length > 0 && (
          <FadeIn delay={650} fromY={30}>
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <AppText style={styles.recentTitle}>
                  {t("home.recentOutfits")}
                </AppText>
                <View style={styles.divider} />
                <TouchableOpacity onPress={() => router.push("/history")}>
                  <AppText style={styles.seeAll}>
                    {t("home.viewHistory")}
                  </AppText>
                </TouchableOpacity>
              </View>

              <View style={styles.recentGrid}>
                {recentLooks.map((look, i) => (
                  <TouchableOpacity
                    key={look.id}
                    style={[styles.recentCard, i === 1 && { marginTop: 32 }]}
                    onPress={() =>
                      router.push({
                        pathname: "/suggestions",
                        params: { imageUri: look.imageUri },
                      })
                    }
                  >
                    <Image
                      source={{ uri: look.imageUri as string }}
                      style={styles.recentImage}
                    />
                    <View style={styles.recentBadge}>
                      <AppText style={styles.recentBadgeText}>
                        {look.styleVibe}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </FadeIn>
        )}
      </AppScrollView>

      {/* Bottom Navigation */}
      <BottomView>
        <BottomNavigationButton
          icon="home"
          label="home.tabHome"
          pathName="/home"
          active
        />
        <BottomNavigationButton
          icon="photo-camera"
          label="home.tabCamera"
          pathName="/camera"
        />

        <BottomNavigationButton
          icon="history"
          label="home.tabHistory"
          pathName="/history"
        />

        <BottomNavigationButton
          icon="person"
          label="home.tabProfile"
          pathName="/profile"
        />
      </BottomView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 4,
    color: Colors.primary,
    fontFamily: "System",
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 50,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 52,
    color: Colors.onSurface,
    letterSpacing: -1.5,
  },
  highlight: {
    color: Colors.primary,
  },
  heroSubtitle: {
    fontSize: 18,
    color: Colors.secondary,
    marginTop: 8,
    opacity: 0.9,
  },
  cameraContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  cameraButton: {
    width: 220,
    height: 220,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  cameraInner: {
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: Colors.whiteAlpha15,
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    width: 240,
    height: 240,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    opacity: 0.15,
    zIndex: -1,
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  secButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.secondaryTintAlpha20,
  },
  secButtonText: {
    color: Colors.onSurface,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  recentSection: {
    marginTop: 60,
    paddingHorizontal: 24,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    color: Colors.secondary,
    textTransform: "uppercase",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.secondaryTintAlpha15,
    marginLeft: 12,
  },
  recentGrid: {
    flexDirection: "row",
    gap: 16,
  },
  recentCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainerLow,
  },
  recentImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    resizeMode: "cover",
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginLeft: 8,
  },
  recentBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#0a0e14bf",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f2ca5033",
  },
  recentBadgeText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
