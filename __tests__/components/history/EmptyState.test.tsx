import EmptyState from "@/components/history/EmptyState";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

describe("EmptyState", () => {
  it("renders the empty state message and capture button", () => {
    const { getByText } = render(<EmptyState />);

    expect(getByText("history.emptyTitle")).toBeTruthy();
    expect(getByText("history.capture")).toBeTruthy();
  });

  it("navigates to the camera when the capture button is pressed", () => {
    const { getByText } = render(<EmptyState />);
    const captureBtn = getByText("history.capture");

    fireEvent.press(captureBtn);
    expect(router.push).toHaveBeenCalledWith("/camera");
  });
});
