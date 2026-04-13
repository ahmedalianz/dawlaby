import SectionHeader from "@/components/voice/SectionHeader";
import { render } from "@testing-library/react-native";
import React from "react";

describe("SectionHeader Container", () => {
  it("renders title and children", () => {
    const { getByTestId } = render(
      <SectionHeader title="Account" icon="person" color="red" />,
    );
    const icon = getByTestId("section-header-icon");
    const title = getByTestId("section-header-title");
    const divider = getByTestId("section-header-divider");
    expect(icon.props.color).toBe("red");
    expect(title.props.children).toBe("Account");
    expect(divider).toBeTruthy();
  });
});
