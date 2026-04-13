import StatPill from "@/components/profile/StatPill";
import { render } from "@testing-library/react-native";
import React from "react";

describe("StatPill", () => {
  it("renders numerical values as strings", () => {
    const { getByText } = render(
      <StatPill label="Outfits" value={25} icon="shirt" />,
    );
    expect(getByText("25")).toBeTruthy();
    expect(getByText("Outfits")).toBeTruthy();
  });

  it("renders text values when isText is true", () => {
    const { getByText } = render(
      <StatPill label="Vibe" value="Chic" icon="flash" isText={true} />,
    );
    expect(getByText("Chic")).toBeTruthy();
  });
});
