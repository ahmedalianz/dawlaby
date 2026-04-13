import Step2Visual from "@/components/onboarding/Step2Visual";
import { useDirection } from "@/store/DirectionContext";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/store/DirectionContext", () => ({
  useDirection: jest.fn(),
}));

describe("Step2Visual", () => {
  it("positions the Vibe Card on the right in LTR", () => {
    (useDirection as jest.Mock).mockReturnValue({ isRTL: false });
    const { getByTestId } = render(<Step2Visual />);

    // Find the card container via text
    const blurView = getByTestId("step2-blur");

    expect(blurView?.parent.props.style).toContainEqual({ right: 12 });
  });

  it("positions the Vibe Card on the left in RTL (Arabic)", () => {
    (useDirection as jest.Mock).mockReturnValue({ isRTL: true });
    const { getByTestId } = render(<Step2Visual />);

    // Find the card container via text
    const blurView = getByTestId("step2-blur");

    expect(blurView?.parent.props.style).toContainEqual({ left: 12 });
  });
  it("renders texts inside", () => {
    const { getByText } = render(<Step2Visual />);

    expect(getByText("onboarding.analysisComplete")).toBeDefined();
    expect(getByText("onboarding.styleVibe")).toBeDefined();
    expect(getByText("onboarding.cozyMinimal")).toBeDefined();
  });
});
