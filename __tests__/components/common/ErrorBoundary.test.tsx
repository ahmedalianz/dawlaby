import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("@/utils/errorLogger", () => ({
  ErrorLogger: { logRender: jest.fn() },
}));

const ProblematicComponent = () => {
  throw new Error("Crashing App...");
};

describe("ErrorBoundary", () => {
  it("catches error and renders ErrorScreen fallback", () => {
    // Silence console.error for this test to keep logs clean
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { getByText } = render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>,
    );

    expect(getByText("error.render.title")).toBeTruthy();
    spy.mockRestore();
  });

  it("navigates home when Go Home is pressed", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>,
    );

    fireEvent.press(getByText("error.actions.goHome"));
    expect(router.replace).toHaveBeenCalledWith("/home");
  });
});
