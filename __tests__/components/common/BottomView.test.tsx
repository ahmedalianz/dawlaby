import BottomView from "@/components/common/BottomView";
import { render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

describe("BottomView", () => {
  it("renders children correctly", () => {
    const { getByTestId } = render(
      <BottomView testID="bottom-view-blur">
        <View testID="child" />
      </BottomView>,
    );
    expect(getByTestId("child")).toBeTruthy();
  });
  it("applies safe area insets to paddingBottom + 20 (34+20)=54 ", () => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ bottom: 34 });

    const { getByTestId } = render(
      <BottomView testID="bottom-view-blur">
        <View />
      </BottomView>,
    );
    const bottomView = getByTestId("bottom-view-blur");
    expect(bottomView.props.style).toContainEqual({
      paddingBottom: 54,
    });
  });
});
