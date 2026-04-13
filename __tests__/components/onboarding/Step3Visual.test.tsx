import Step3Visual from "@/components/onboarding/Step3Visual";
import { render } from "@testing-library/react-native";
import React from "react";

describe("Step3Visual", () => {
  it("renders the AI Stylist card with sparkles", () => {
    const { getByText } = render(<Step3Visual />);

    expect(getByText(/Stylist/i)).toBeTruthy();
  });

  it("renders the gradient border and content wrapper", () => {
    const { toJSON } = render(<Step3Visual />);
    expect(toJSON()).toMatchSnapshot();
  });
});
