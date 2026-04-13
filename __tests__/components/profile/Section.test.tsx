import Section from "@/components/profile/Section";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("Section Container", () => {
  it("renders title and children", () => {
    const { getByText } = render(
      <Section title="Account" icon="person">
        <Text>Child Content</Text>
      </Section>,
    );

    expect(getByText("Account")).toBeTruthy();
    expect(getByText("Child Content")).toBeTruthy();
  });
});
