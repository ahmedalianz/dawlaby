import { Colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";

const BottomNavigationButton = ({
  icon,
  label,
  pathName,
  active,
}: {
  icon: any;
  label: string;
  pathName: any;
  active?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={active ? styles.navItemActive : styles.navItem}
      onPress={() => router.push(pathName)}
    >
      <MaterialIcons name={icon} size={28} color={Colors.primary} />
      <AppText style={styles.navTextActive}>{t(label)}</AppText>
    </TouchableOpacity>
  );
};

export default BottomNavigationButton;

const styles = StyleSheet.create({
  navItemActive: {
    alignItems: "center",
    backgroundColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navTextActive: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
  },
});
