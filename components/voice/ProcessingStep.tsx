import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { ProcessingStepProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const ProcessingStep: React.FC<Readonly<ProcessingStepProps>> = ({
  label,
  done,
  active,
}) => {
  return (
    <View style={styles.stepRow}>
      <Ionicons
        name={done ? "checkmark-circle" : "ellipse-outline"}
        size={16}
        color={
          done
            ? Colors.primary
            : active
              ? Colors.secondary
              : Colors.secondaryAlpha30
        }
      />
      <AppText
        style={[styles.stepLabel, done ? { color: Colors.primary } : undefined]}
      >
        {label}
      </AppText>
    </View>
  );
};
const styles = StyleSheet.create({
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepLabel: {
    color: Colors.secondary,
    fontSize: 13,
  },
});
export default ProcessingStep;
