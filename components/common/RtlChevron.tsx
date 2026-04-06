import { useDirection } from "@/store/DirectionContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Colors } from "../../constants/colors";

const RtlChevron = ({ size = 22 }: { size?: number }) => {
  const { isRTL } = useDirection();
  return (
    <Ionicons
      name={isRTL ? "chevron-back" : "chevron-forward"}
      size={size}
      color={Colors.onSurface}
    />
  );
};

export default RtlChevron;
