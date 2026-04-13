import { ErrorScreen } from "@/components/common/ErrorScreen";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("ErrorScreen", () => {
  const mockOnRetry = jest.fn();

  it("renders correct messages and triggers retry", () => {
    const { getByText } = render(
      <ErrorScreen
        type="network"
        message="No Internet"
        onRetry={mockOnRetry}
      />,
    );

    expect(getByText("No Internet")).toBeTruthy();
    fireEvent.press(getByText("error.actions.retry"));
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it("shows stack details only in __DEV__ mode", () => {
    // Force global __DEV__ to true for this test
    (global as any).__DEV__ = true;
    const testError = new Error("Secret Stack Trace");

    const { getByText } = render(
      <ErrorScreen error={testError} onRetry={mockOnRetry} />,
    );

    const toggle = getByText("error.dev.showDetails");
    fireEvent.press(toggle);

    expect(getByText(/Secret Stack Trace/)).toBeTruthy();
  });
});
