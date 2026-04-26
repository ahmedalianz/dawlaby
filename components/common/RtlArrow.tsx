import { useDirection } from "@/store/DirectionContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Colors } from "../../constants/colors";

const RtlArrow = ({
  size = 22,
  reversed,
  color = Colors.onSurface,
  testID,
}: {
  size?: number;
  reversed?: boolean;
  color?: string;
  testID?: string;
}) => {
  const { isRTL } = useDirection();
  const arrowName = isRTL ? "arrow-forward" : "arrow-back";
  const arrowNameReversed = isRTL ? "arrow-back" : "arrow-forward";
  return (
    <Ionicons
      name={reversed ? arrowNameReversed : arrowName}
      size={size}
      color={color}
      testID={testID}
    />
  );
};

export default RtlArrow;
