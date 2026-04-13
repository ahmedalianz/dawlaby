import AppText from "@/components/common/AppText";
import { Fonts } from "@/constants/fonts";
import { render } from "@testing-library/react-native";
import React from "react";

describe("AppText", () => {
  it("renders children correctly", () => {
    const { getByText } = render(<AppText>Hello</AppText>);
    expect(getByText("Hello")).toBeTruthy();
  });

  it("applies regular font by default", () => {
    const { getByText } = render(<AppText>Default</AppText>);
    const text = getByText("Default");
    expect(text.props.style).toContainEqual({ fontFamily: Fonts.regular });
  });

  it("maps explicit weight prop to custom font", () => {
    const { getByText } = render(<AppText weight="bold">Bold Text</AppText>);
    const text = getByText("Bold Text");
    expect(text.props.style).toContainEqual({ fontFamily: Fonts.bold });
  });

  it("infers font from fontWeight style", () => {
    const { getByText } = render(
      <AppText style={{ fontWeight: "700" }}>Inferred Bold</AppText>,
    );
    const text = getByText("Inferred Bold");
    expect(text.props.style).toContainEqual({ fontFamily: Fonts.bold });
    // Should NOT contain fontWeight anymore
    expect(text.props.style[0].fontWeight).toBeUndefined();
  });
});
