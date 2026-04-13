import SuggestionSection from "@/components/suggestions/SuggestionSection";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("SuggestionSection Container", () => {
  it("renders title and children", () => {
    const { getByText } = render(
      <SuggestionSection title="Account" icon="person">
        <Text>Child Content</Text>
      </SuggestionSection>,
    );

    expect(getByText("Account")).toBeTruthy();
    expect(getByText("Child Content")).toBeTruthy();
  });
});
