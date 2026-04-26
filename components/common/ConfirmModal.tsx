import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../../constants/colors";
import AppText from "./AppText";

const { width } = Dimensions.get("window");

export type ModalVariant = "danger" | "warning" | "info";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // Content
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // Style
  variant?: ModalVariant;
}

const VARIANT_CONFIG: Record<
  ModalVariant,
  { color: string; iconBg: string; gradientColors: [string, string] }
> = {
  danger: {
    color: Colors.errorLight,
    iconBg: "#ff6b6b1a",
    gradientColors: ["#ff6b6b26", "#c0392b0d"],
  },
  warning: {
    color: Colors.primary,
    iconBg: Colors.primaryAlpha10,
    gradientColors: [Colors.primaryAlpha12, Colors.primaryContainerAlpha04],
  },
  info: {
    color: Colors.primary,
    iconBg: Colors.primaryAlpha08,
    gradientColors: [Colors.primaryAlpha08, "transparent"],
  },
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  icon = "alert-circle-outline",
  title,
  subtitle,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}) => {
  const config = VARIANT_CONFIG[variant];

  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { stiffness: 200, damping: 50 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.85, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={20} tint="dark" style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Card */}
      <View style={styles.centeredView} pointerEvents="box-none">
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Top gradient accent */}
          <LinearGradient
            colors={config.gradientColors}
            style={styles.topAccent}
          />

          {/* Icon */}
          <View
            style={[styles.iconWrapper, { backgroundColor: config.iconBg }]}
          >
            <Ionicons name={icon} size={32} color={config.color} />
          </View>

          {/* Text */}
          <AppText style={styles.title}>{title}</AppText>
          {subtitle && <AppText style={styles.subtitle}>{subtitle}</AppText>}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Actions */}
          <View style={styles.actions}>
            {/* Cancel */}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <AppText style={styles.cancelText}>{cancelLabel}</AppText>
            </TouchableOpacity>

            {/* Confirm */}
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: config.color }]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <AppText style={styles.confirmText}>{confirmLabel}</AppText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000099",
  },
  centeredView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  card: {
    width: width - 64,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
    paddingBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 24,
  },
  topAccent: {
    width: "100%",
    height: 4,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(77,70,53,0.15)",
  },
  title: {
    color: Colors.onSurface,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.2,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: "300",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
    marginTop: 8,
    opacity: 0.8,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(77,70,53,0.15)",
    marginTop: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: "rgba(77,70,53,0.2)",
  },
  cancelText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ConfirmModal;
