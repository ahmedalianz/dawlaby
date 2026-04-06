import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { SectionProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const SuggestionSection: React.FC<Readonly<SectionProps>> = ({
  title,
  icon,
  children,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={16} color={Colors.primary} />
        <AppText style={styles.sectionTitle}>{title}</AppText>
        <View style={styles.sectionDivider} />
      </View>
      {children}
    </View>
  );
};
export default SuggestionSection;

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
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariantAlpha20,
  },
});
