import ProcessingStep from "@/components/voice/ProcessingStep";
import { Colors } from "@/constants/colors";
import { render } from "@testing-library/react-native";
import React from "react";

describe("ProcessingStep Container", () => {
  it("renders title and children when done and active are false", () => {
    const { getByTestId } = render(
      <ProcessingStep label="Account" done={false} active={false} />,
    );
    const icon = getByTestId("processing-step-icon");
    expect(icon.props.name).toBe("ellipse-outline");
    expect(icon.props.color).toBe(Colors.secondaryAlpha30);
  });
  it("renders title and children when done is false and active is true", () => {
    const { getByTestId } = render(
      <ProcessingStep label="Account" done={false} active={true} />,
    );
    const icon = getByTestId("processing-step-icon");
    expect(icon.props.name).toBe("ellipse-outline");
    expect(icon.props.color).toBe(Colors.secondary);
  });
  it("renders title and children when done is true and active is false", () => {
    const { getByTestId } = render(
      <ProcessingStep label="Account" done={true} active={false} />,
    );
    const icon = getByTestId("processing-step-icon");
    expect(icon.props.name).toBe("checkmark-circle");
    expect(icon.props.color).toBe(Colors.primary);
  });
});
