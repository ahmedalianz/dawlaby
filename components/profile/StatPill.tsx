import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

const StatPill: React.FC<
  Readonly<{
    value: number | string;
    label: string;
    icon: string;
    isText?: boolean;
  }>
> = ({ value, label, icon, isText = false }) => {
  return (
    <View style={styles.statPill}>
      <Ionicons name={icon as any} size={15} color={Colors.primary} />
      <AppText style={styles.statValue}>
        {isText ? value : value.toString()}
      </AppText>
      <AppText style={styles.statLabel}>{label}</AppText>
    </View>
  );
};

export default StatPill;
const styles = StyleSheet.create({
  statPill: { alignItems: "center", gap: 4, flex: 1 },
  statValue: {
    color: Colors.onSurface,
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    color: Colors.secondary,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
