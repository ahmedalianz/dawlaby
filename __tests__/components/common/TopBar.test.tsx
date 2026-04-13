import TopBar from "@/components/common/TopBar";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

describe("TopBar", () => {
  it("navigates back when back button is pressed", () => {
    const { getByTestId } = render(<TopBar title="settings.title" />);
    const backBtn = getByTestId("back-btn");

    fireEvent.press(backBtn);
    expect(router.back).toHaveBeenCalled();
  });

  it("renders action buttons when icons are provided", () => {
    const onFirstPress = jest.fn();
    const onSecondPress = jest.fn();
    const { getByTestId } = render(
      <TopBar
        title="Title"
        firstButtonIcon="add"
        onFirstButtonPress={onFirstPress}
        secondButtonIcon="share-social"
        onSecondButtonPress={onSecondPress}
      />,
    );
    const firstBtn = getByTestId("first-btn");
    fireEvent.press(firstBtn);
    expect(onFirstPress).toHaveBeenCalled();

    const secondBtn = getByTestId("second-btn");
    fireEvent.press(secondBtn);
    expect(onSecondPress).toHaveBeenCalled();
  });
});
