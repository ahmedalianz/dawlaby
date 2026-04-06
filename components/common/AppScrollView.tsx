import React from "react";
import {
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

interface AppScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fullScreen?: boolean;
}
const AppScrollView = ({
  children,
  style,
  fullScreen,
  contentContainerStyle,
  ...props
}: AppScrollViewProps) => {
  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: fullScreen ? 0 : 24 },
        contentContainerStyle,
      ]}
      style={style}
      {...props}
    >
      {children}
    </Animated.ScrollView>
  );
};

export default AppScrollView;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
