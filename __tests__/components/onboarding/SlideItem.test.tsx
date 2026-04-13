import SlideItem from "@/components/onboarding/SlideItem";
import { useDirection } from "@/store/DirectionContext";
import { render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

jest.mock("@/store/DirectionContext", () => ({
  useDirection: jest.fn(),
}));

describe("SlideItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const MockVisual = () => <View testID="mock-visual" />;
  (useDirection as jest.Mock).mockReturnValue({ isRTL: false });

  const createMockStep = (id: string) => ({
    id,
    visual: MockVisual,
    title: `title${id}`,
    description: `desc${id}`,
  });

  it("renders the visual component correctly", () => {
    const step = createMockStep("1");
    const { getByTestId } = render(<SlideItem item={step} />);

    expect(getByTestId("mock-visual")).toBeTruthy();
  });

  it("renders correct headline and highlight for Step 1", () => {
    const step = createMockStep("1");
    const { getByText } = render(<SlideItem item={step} />);

    expect(getByText(/onboarding.title1/i)).toBeTruthy();
    expect(getByText(/onboarding.titleHighlight1/i)).toBeTruthy();
  });

  it("renders correct headline and highlight for Step 2", () => {
    const step = createMockStep("2");
    const { getByText } = render(<SlideItem item={step} />);

    expect(getByText(/onboarding.title2/i)).toBeTruthy();
    expect(getByText(/onboarding.titleHighlight2/i)).toBeTruthy();
  });

  it("renders correct headline and highlight for Step 3", () => {
    const step = createMockStep("3");
    const { getByText } = render(<SlideItem item={step} />);

    expect(getByText(/onboarding.title3/i)).toBeTruthy();
    expect(getByText(/onboarding.titleHighlight3/i)).toBeTruthy();
  });

  it("renders the correct subtitle/description based on ID", () => {
    const step = createMockStep("2");
    const { getByText } = render(<SlideItem item={step} />);

    expect(getByText("onboarding.desc2")).toBeTruthy();
  });

  it("adjusts text alignment based on RTL status", () => {
    // Force RTL for this test case
    (useDirection as jest.Mock).mockReturnValue({ isRTL: true });

    const step = createMockStep("1");
    const { getByText } = render(<SlideItem item={step} />);

    const headline = getByText(/onboarding.title1/i);
    // Flatten styles to check textAlign
    const flattenedStyle = Object.assign({}, ...[headline.props.style].flat());

    expect(flattenedStyle.textAlign).toBe("right");
  });
});
