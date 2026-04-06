import AppText from "@/components/common/AppText";
import RtlArrow from "@/components/common/RtlArrow";
import { Colors } from "@/constants/colors";
import { TopBarProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const TopBar = ({
  firstButtonIcon,
  secondButtonIcon,
  onFirstButtonPress,
  onSecondButtonPress,
  secondButtonColor = Colors.onSurface,
  title,
}: TopBarProps) => {
  const { t } = useTranslation();

  return (
    <BlurView
      intensity={60}
      tint="dark"
      // style={[styles.topBar, { paddingTop: insets.top + 16 }]}
      style={styles.topBar}
    >
      <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
        <RtlArrow />
      </TouchableOpacity>

      <AppText style={styles.topBarTitle}>{t(title)}</AppText>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {!firstButtonIcon && !secondButtonIcon && (
          <View style={{ width: 40 }} />
        )}
        {firstButtonIcon && (
          <TouchableOpacity style={styles.iconBtn} onPress={onFirstButtonPress}>
            <Ionicons
              name={firstButtonIcon}
              size={22}
              color={Colors.onSurface}
            />
          </TouchableOpacity>
        )}
        {secondButtonIcon && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onSecondButtonPress}
          >
            <Ionicons
              name={secondButtonIcon}
              size={22}
              color={secondButtonColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
};
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceOverlayContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 4,
  },
});

export default TopBar;
