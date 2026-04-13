import FadeIn from "@/components/common/FadeIn";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("Animation Wrappers", () => {
  it("FadeIn renders children", () => {
    const { getByText } = render(
      <FadeIn>
        <Text>Fading In</Text>
      </FadeIn>,
    );
    expect(getByText("Fading In")).toBeTruthy();
  });
});
