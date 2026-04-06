import AppText from "@/components/common/AppText";
import { APP_NAME } from "@/constants/app";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function Step3Visual() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* ✨ Floating sparkles */}
      <View style={styles.sparkleTop}>
        <Ionicons name="sparkles" size={28} color={Colors.primary} />
      </View>

      <View style={styles.sparkleBottom}>
        <Ionicons
          name="sparkles-outline"
          size={22}
          color={Colors.primaryAlpha35}
        />
      </View>

      <View style={styles.card}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryContainer]}
          style={styles.cardBorder}
        />

        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              style={styles.cardAvatar}
            >
              <Ionicons name="sparkles" size={14} color={Colors.onPrimary} />
            </LinearGradient>

            <AppText style={styles.cardHeaderText}>
              {t(APP_NAME)} Stylist
            </AppText>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={require("@/assets/images/onboarding/step3.webp")}
              style={styles.cardImage}
              contentFit="cover"
              transition={300}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 4,
    alignItems: "center",
  },

  sparkleTop: {
    position: "absolute",
    top: -8,
    right: 16,
    zIndex: 2,
  },

  sparkleBottom: {
    position: "absolute",
    bottom: -8,
    left: 8,
    zIndex: 2,
  },

  card: {
    width: "100%",
    height: 260,
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainerHighAlpha60,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  cardBorder: {
    width: 3,
    alignSelf: "stretch",
  },

  cardContent: {
    flex: 1,
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cardAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  cardHeaderText: {
    color: Colors.onSurfaceAlpha60,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  imageWrapper: {
    flex: 1,
    marginTop: 14,
    borderRadius: 12,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },
});

export default Step3Visual;
