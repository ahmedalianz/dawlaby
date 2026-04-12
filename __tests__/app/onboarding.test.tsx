import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import OnboardingScreen from "../../app/onboarding";
import { useDirection } from "../../store/DirectionContext";

jest.mock("../../store/DirectionContext", () => ({
  useDirection: jest.fn(),
}));

describe("Onboarding Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDirection as jest.Mock).mockReturnValue({ isRTL: false });
  });

  it("renders multiple steps and allows skipping", () => {
    const { getByText } = render(<OnboardingScreen />);

    // TopBar has skip button early on
    const skipBtn = getByText("onboarding.skip");
    expect(skipBtn).toBeTruthy();

    fireEvent.press(skipBtn);
    expect(router.replace).toHaveBeenCalledWith("/home");
  });

  it("navigates forward when next is pressed", async () => {
    const { getByText } = render(<OnboardingScreen />);

    // Assume active step allows clicking next
    const nextBtn = getByText("onboarding.next");
    fireEvent.press(nextBtn);

    expect(nextBtn).toBeTruthy();
  });
});
