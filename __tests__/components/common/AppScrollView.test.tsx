import AppScrollView from "@/components/common/AppScrollView";
import { render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

describe("AppScrollView", () => {
  it("renders children correctly", () => {
    const { getByTestId } = render(
      <AppScrollView>
        <View testID="child" />
      </AppScrollView>,
    );
    expect(getByTestId("child")).toBeTruthy();
  });

  it("applies 24px padding when fullScreen is false", () => {
    const { getByTestId } = render(
      <AppScrollView fullScreen={false} testID="app-scroll-view">
        <View />
      </AppScrollView>,
    );
    const scrollView = getByTestId("app-scroll-view");
    expect(scrollView.props.contentContainerStyle).toContainEqual({
      paddingHorizontal: 24,
    });
  });

  it("removes horizontal padding when fullScreen is true", () => {
    const { getByTestId } = render(
      <AppScrollView fullScreen={true} testID="app-scroll-view">
        <View />
      </AppScrollView>,
    );
    const scrollView = getByTestId("app-scroll-view");
    expect(scrollView.props.contentContainerStyle).toContainEqual({
      paddingHorizontal: 0,
    });
  });
});
