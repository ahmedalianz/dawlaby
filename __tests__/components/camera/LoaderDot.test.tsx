import LoaderDot from "@/components/camera/LoaderDot";
import { Colors } from "@/constants/colors";
import { render } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

// Reanimated usually requires a mock for the animation frame
jest.useFakeTimers();

describe("LoaderDot", () => {
  it("renders correctly with initial styles", () => {
    // We render the component. Since there's no testID,
    // we'll find it by its background color or check the tree.
    const { toJSON } = render(<LoaderDot delay={100} />);
    const json = toJSON() as any;

    // Verify the static styles from the StyleSheet
    const flattenedStyle = StyleSheet.flatten(json.props.style);

    expect(flattenedStyle.width).toBe(8);
    expect(flattenedStyle.height).toBe(8);
    expect(flattenedStyle.borderRadius).toBe(4);
    expect(flattenedStyle.backgroundColor).toBe(Colors.primary);
  });

  it("initializes with the starting opacity", () => {
    const { toJSON } = render(<LoaderDot delay={0} />);
    const json = toJSON() as any;

    const flattenedStyle = StyleSheet.flatten(json.props.style);

    // The initial value of the sharedValue is 0.3
    expect(flattenedStyle.opacity).toBe(0.3);
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<LoaderDot delay={200} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
