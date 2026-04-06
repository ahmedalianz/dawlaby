import { Fonts } from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

export interface AppTextProps extends TextProps {
  /**
   * Optional weight to override the style's fontWeight.
   */
  weight?: keyof typeof Fonts;
}

const AppText: React.FC<Readonly<AppTextProps>> = ({
  style,
  weight,
  ...props
}) => {
  let fontFamily = Fonts.regular;

  // Flatten the style to inspect any passed fontWeight
  const flattenedStyle = StyleSheet.flatten(style) || {};

  // Map explicitly passed weight prop, or infer from fontWeight style
  if (weight && Fonts[weight]) {
    fontFamily = Fonts[weight];
  } else if (flattenedStyle.fontWeight) {
    const fw = flattenedStyle.fontWeight;
    if (fw === "800" || fw === "900") {
      fontFamily = Fonts.extraBold;
    } else if (fw === "700" || fw === "600") {
      fontFamily = Fonts.bold;
    } else if (fw === "500") {
      fontFamily = Fonts.medium;
    } else {
      fontFamily = Fonts.regular;
    }
  }

  // Remove fontWeight from style to avoid system font overrides
  const { fontWeight, ...restStyle } = flattenedStyle;

  return <Text style={[restStyle, { fontFamily }]} {...props} />;
};
export default AppText;
