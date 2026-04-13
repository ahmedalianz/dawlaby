import DotIndicator from "@/components/onboarding/DotIndicator";
import { Colors } from "@/constants/colors";
import { render } from "@testing-library/react-native";
import React from "react";

describe("DotIndicator Component", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<DotIndicator count={3} activeIndex={0} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders the correct number of dots", () => {
    const { getAllByTestId } = render(
      <DotIndicator count={3} activeIndex={0} />,
    );
    expect(getAllByTestId(/dot-\d+/).length).toBe(3);
  });

  it("renders the active dot correctly", () => {
    const { getByTestId } = render(<DotIndicator count={3} activeIndex={0} />);
    expect(getByTestId("dot-0").props.style).toEqual([
      {
        height: 6,
        borderRadius: 3,
      },
      {
        width: 24,
        backgroundColor: Colors.primary,
      },
    ]);
  });

  it("renders the inactive dot correctly", () => {
    const { getByTestId } = render(<DotIndicator count={3} activeIndex={0} />);
    expect(getByTestId("dot-1").props.style).toEqual([
      {
        height: 6,
        borderRadius: 3,
      },
      {
        width: 6,
        backgroundColor: Colors.secondaryAlpha25,
      },
    ]);
  });
});
