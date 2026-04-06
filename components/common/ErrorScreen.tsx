import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export type ErrorType = "network" | "render" | "auth" | "notFound" | "unknown";

export interface ErrorScreenProps {
  // Required
  onRetry: () => void;
  // Optional
  error?: Error | unknown;
  message?: string;
  type?: ErrorType;
  showHomeButton?: boolean;
  onGoHome?: () => void;
}

interface ErrorConfig {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  color: string;
}

// ─────────────────────────────────────────
// Error type configs
// ─────────────────────────────────────────
const getErrorConfig = (t: any, type: ErrorType): ErrorConfig => ({
  icon: {
    network: "wifi-outline",
    render: "warning-outline",
    auth: "lock-closed-outline",
    notFound: "search-outline",
    unknown: "alert-circle-outline",
  }[type] as any,

  color: {
    network: "#e67e22",
    render: Colors.errorLight,
    auth: "#9b59b6",
    notFound: Colors.secondary,
    unknown: Colors.errorLight,
  }[type],

  title: t(`error.${type}.title`),
  subtitle: t(`error.${type}.subtitle`),
});

// ─────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────

export function ErrorScreen({
  error,
  message,
  type = "unknown",
  onRetry,
  showHomeButton = false,
  onGoHome,
}: ErrorScreenProps) {
  const { t } = useTranslation();

  const [showDetails, setShowDetails] = useState(false);
  const config = getErrorConfig(t, type);

  // ── Animations ──
  const btnScale = useSharedValue(1);
  const detailsHeight = useSharedValue(0);
  const detailsOpacity = useSharedValue(0);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const detailsStyle = useAnimatedStyle(() => ({
    opacity: detailsOpacity.value,
    maxHeight: detailsHeight.value,
    overflow: "hidden",
  }));

  const handleRetryPress = () => {
    btnScale.value = withSpring(0.94, {}, () => {
      btnScale.value = withSpring(1);
    });
    onRetry();
  };

  const toggleDetails = () => {
    const next = !showDetails;
    setShowDetails(next);
    detailsHeight.value = withTiming(next ? 300 : 0, { duration: 300 });
    detailsOpacity.value = withTiming(next ? 1 : 0, { duration: 300 });
  };

  // ── Get error details string ──
  const getErrorDetails = (): string => {
    if (!error) return "No additional details.";
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\n\n${error.stack ?? ""}`.trim();
    }
    return String(error);
  };

  const displayMessage = message ?? config.subtitle;

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View
        style={[styles.glow, { backgroundColor: config.color + "10" }]}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={[config.color + "22", config.color + "08"]}
            style={styles.iconBg}
          >
            <Ionicons name={config.icon} size={52} color={config.color} />
          </LinearGradient>
          {/* Pulse ring */}
          <View
            style={[styles.iconRing, { borderColor: config.color + "30" }]}
          />
        </View>

        {/* Title */}
        <AppText style={styles.title}>{config.title}</AppText>

        {/* Subtitle / message */}
        <AppText style={styles.subtitle}>{displayMessage}</AppText>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Retry Button */}
        <Animated.View style={[styles.retryWrapper, btnStyle]}>
          <TouchableOpacity onPress={handleRetryPress} activeOpacity={0.9}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryBtn}
            >
              <Ionicons name="refresh" size={18} color={Colors.onPrimary} />
              <AppText style={styles.retryText}>
                {t("error.actions.retry")}
              </AppText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Home Button (optional) */}
        {showHomeButton && onGoHome && (
          <TouchableOpacity style={styles.homeBtn} onPress={onGoHome}>
            <Ionicons name="home-outline" size={16} color={Colors.secondary} />
            <AppText style={styles.homeBtnText}>
              {t("error.actions.goHome")}
            </AppText>
          </TouchableOpacity>
        )}

        {/* Dev Details Toggle — only in __DEV__ */}
        {__DEV__ && (
          <View style={styles.devSection}>
            <TouchableOpacity
              style={styles.detailsToggle}
              onPress={toggleDetails}
            >
              <Ionicons
                name={showDetails ? "chevron-up" : "chevron-down"}
                size={14}
                color={Colors.onSurfaceAlpha35}
              />
              <AppText style={styles.detailsToggleText}>
                {showDetails
                  ? t("error.dev.hideDetails")
                  : t("error.dev.showDetails")}
              </AppText>
            </TouchableOpacity>

            <Animated.View style={detailsStyle}>
              <ScrollView
                style={styles.detailsBox}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                <AppText style={styles.detailsText} selectable>
                  {getErrorDetails()}
                </AppText>
              </ScrollView>
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  glow: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
    gap: 16,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRing: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
  },
  title: {
    color: Colors.onSurface,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: "300",
    textAlign: "center",
    lineHeight: 23,
    opacity: 0.85,
    maxWidth: width * 0.75,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(242,202,80,0.2)",
    marginVertical: 4,
  },
  retryWrapper: { width: "100%" },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  retryText: {
    color: Colors.onPrimary,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(77,70,53,0.25)",
  },
  homeBtnText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  devSection: {
    width: "100%",
    marginTop: 8,
    gap: 8,
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  detailsToggleText: {
    color: "rgba(200,200,176,0.35)",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  detailsBox: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(77,70,53,0.2)",
    maxHeight: 300,
  },
  detailsText: {
    color: "rgba(200,200,176,0.6)",
    fontSize: 11,
    fontFamily: "monospace",
    lineHeight: 18,
  },
});
