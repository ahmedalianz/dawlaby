import AppButton from "@/components/common/AppButton";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

const mockOnPress = jest.fn();
describe("AppButton", () => {
  it("renders text correctly", () => {
    const { getByText } = render(
      <AppButton onPress={mockOnPress} text="Hello" />,
    );
    expect(getByText("Hello")).toBeTruthy();
  });
  it("renders arrow icon when hasArrow is true", () => {
    const { getByText, getByTestId } = render(
      <AppButton onPress={mockOnPress} text="Hello" hasArrow />,
    );
    expect(getByText("Hello")).toBeTruthy();
    expect(getByTestId("arrow-icon")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByTestId } = render(
      <AppButton onPress={mockOnPress} text="button" />,
    );
    fireEvent.press(getByTestId("app-button"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
