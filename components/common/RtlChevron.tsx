import { useDirection } from "@/store/DirectionContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Colors } from "../../constants/colors";

const RtlChevron = ({
  size = 22,
  testID,
}: {
  size?: number;
  testID?: string;
}) => {
  const { isRTL } = useDirection();
  return (
    <Ionicons
      name={isRTL ? "chevron-back" : "chevron-forward"}
      size={size}
      color={Colors.onSurface}
      testID={testID}
    />
  );
};

export default RtlChevron;
