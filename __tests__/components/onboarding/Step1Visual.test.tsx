import Step1Visual from "@/components/onboarding/Step1Visual";
import { render } from "@testing-library/react-native";
import React from "react";

describe("Step1Visual", () => {
  it("renders correctly with image and accents", () => {
    const { getByTestId } = render(<Step1Visual />);

    const glow = getByTestId("glow");
    const image = getByTestId("step1-image");
    const floatingAccent1 = getByTestId("floating-accent1");
    const floatingAccent2 = getByTestId("floating-accent2");
    expect(glow).toBeDefined();
    expect(image).toBeDefined();
    expect(floatingAccent1).toBeDefined();
    expect(floatingAccent2).toBeDefined();
  });
});
