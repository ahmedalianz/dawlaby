import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";

const ToggleRow: React.FC<
  Readonly<{
    label: string;
    sublabel: string;
    icon: string;
    value: boolean;
    onToggle: (v: boolean) => void;
  }>
> = ({
  label,
  sublabel,
  icon,
  value,
  onToggle,
}: {
  label: string;
  sublabel: string;
  icon: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) => {
  return (
    <View style={styles.prefRow}>
      <View style={styles.prefIconWrapper}>
        <Ionicons name={icon as any} size={18} color={Colors.primary} />
      </View>
      <View style={styles.prefInfo}>
        <AppText style={styles.prefLabel}>{label}</AppText>
        <AppText style={styles.prefSublabel}>{sublabel}</AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: Colors.surfaceContainerHigh,
          true: Colors.primaryAlpha40,
        }}
        thumbColor={value ? Colors.primary : Colors.secondary}
        ios_backgroundColor={Colors.surfaceContainerHigh}
      />
    </View>
  );
};

export default ToggleRow;
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
