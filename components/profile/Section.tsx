import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

const Section: React.FC<
  Readonly<{
    title: string;
    icon: string;
    children: React.ReactNode;
  }>
> = ({ title, icon, children }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={14} color={Colors.primary} />
        <AppText style={styles.sectionTitle}>{title}</AppText>
        <View style={styles.sectionLine} />
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
};

export default Section;
const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariantAlpha20,
  },
  sectionBody: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha15,
  },
});
