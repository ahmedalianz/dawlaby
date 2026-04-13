import BottomNavigationButton from "@/components/common/BottomNavigationButton";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

describe("BottomNavigationButton", () => {
  it("renders label and navigates on press", () => {
    const { getByText } = render(
      <BottomNavigationButton label="nav.home" icon="home" pathName="/home" />,
    );

    expect(getByText("nav.home")).toBeTruthy();

    fireEvent.press(getByText("nav.home"));
    expect(router.push).toHaveBeenCalledWith("/home");
  });

  it("applies active styles when active prop is true", () => {
    const { getByTestId } = render(
      <BottomNavigationButton
        label="Home"
        icon="home"
        pathName="/home"
        active
      />,
    );
    const button = getByTestId("bottom-nav-button");
    expect(button.props.style.backgroundColor).toBeTruthy();
  });
});
