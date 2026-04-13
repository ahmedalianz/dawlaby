import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { SectionHeaderProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const SectionHeader: React.FC<Readonly<SectionHeaderProps>> = ({
  icon,
  title,
  color,
}) => {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons
        testID="section-header-icon"
        name={icon}
        size={15}
        color={color ?? Colors.primary}
      />
      <AppText
        testID="section-header-title"
        style={[styles.sectionTitle, color ? { color } : undefined]}
      >
        {title}
      </AppText>
      <View testID="section-header-divider" style={styles.sectionDivider} />
    </View>
  );
};
const styles = StyleSheet.create({
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariantAlpha20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
export default SectionHeader;
