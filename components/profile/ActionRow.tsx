import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import RtlChevron from "../common/RtlChevron";

const ActionRow: React.FC<
  Readonly<{
    label: string;
    sublabel: string;
    icon: string;
    onPress: () => void;
    danger?: boolean;
  }>
> = ({
  label,
  sublabel,
  icon,
  onPress,
  danger = false,
}: {
  label: string;
  sublabel: string;
  icon: string;
  onPress: () => void;
  danger?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={styles.prefRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.prefIconWrapper, danger && styles.prefIconDanger]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={danger ? Colors.errorAlpha80 : Colors.primary}
        />
      </View>
      <View style={styles.prefInfo}>
        <AppText
          style={[styles.prefLabel, danger && { color: Colors.errorAlpha90 }]}
        >
          {label}
        </AppText>
        <AppText style={styles.prefSublabel}>{sublabel}</AppText>
      </View>
      <RtlChevron size={16} />
    </TouchableOpacity>
  );
};

export default ActionRow;
const styles = StyleSheet.create({
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  prefIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryAlpha10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primaryAlpha12,
  },
  prefIconDanger: {
    backgroundColor: Colors.errorAlpha08,
    borderColor: Colors.errorAlpha15,
  },
  prefInfo: { flex: 1, gap: 2 },
  prefLabel: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "500",
  },
  prefSublabel: {
    color: Colors.secondary,
    fontSize: 11,
    opacity: 0.7,
  },
});
