import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { APP_NAME } from "@/constants/app";
import { useTranslation } from "react-i18next";

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrapper}>
        <LinearGradient
          colors={[Colors.primaryAlpha10, "transparent"]}
          style={styles.emptyIconBg}
        >
          <Ionicons name="shirt-outline" size={48} color={Colors.primary} />
        </LinearGradient>
      </View>

      <AppText style={styles.emptyTitle}>{t("history.emptyTitle")}</AppText>

      <AppText style={styles.emptySubtitle}>
        {t("history.emptySubtitle", { appName: t(APP_NAME) })}
      </AppText>

      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => router.push("/camera")}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyBtnGradient}
        >
          <Ionicons name="camera-outline" size={18} color={Colors.onPrimary} />
          <AppText style={styles.emptyBtnText}>{t("history.capture")}</AppText>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  emptyIconWrapper: { marginBottom: 8 },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha15,
    backgroundColor: Colors.primaryAlpha10,
  },
  emptyTitle: {
    color: Colors.onSurface,
    fontSize: 22,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyBtn: {
    marginTop: 8,
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
  },
  emptyBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  emptyBtnText: { color: Colors.onPrimary, fontWeight: "700", fontSize: 15 },
});

export default EmptyState;
