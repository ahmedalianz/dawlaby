import Screen from "@/components/common/Screen";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("Screen Wrapper", () => {
  it("renders children inside SafeAreaView", () => {
    const { getByText } = render(
      <Screen>
        <Text>Content</Text>
      </Screen>,
    );
    expect(getByText("Content")).toBeTruthy();
  });
});
