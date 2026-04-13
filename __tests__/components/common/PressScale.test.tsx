import PressScale from "@/components/common/PressScale";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("PressScale Component", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <PressScale>
        <Text>Press Me</Text>
      </PressScale>
    );
    expect(getByText("Press Me")).toBeTruthy();
  });

  it("fires onPress when pressed", () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <PressScale onPress={mockPress}>
        <Text>Press Me</Text>
      </PressScale>
    );
    fireEvent.press(getByText("Press Me"));
    expect(mockPress).toHaveBeenCalled();
  });
});
