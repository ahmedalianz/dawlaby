import RtlArrow from "@/components/common/RtlArrow";
import RtlChevron from "@/components/common/RtlChevron";
import { useDirection } from "@/store/DirectionContext";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/store/DirectionContext", () => ({
  useDirection: jest.fn(),
}));

describe("Rtl Components", () => {
  it("renders arrow-back when LTR", () => {
    (useDirection as jest.Mock).mockReturnValue({ isRTL: false });
    render(<RtlArrow testID="back-btn" />);
    expect(
      render(<RtlArrow testID="back-btn" />).root.findByProps({
        testID: "back-btn",
      }).props.name,
    ).toBe("arrow-back");
  });

  it("renders arrow-forward when RTL (Arabic mode)", () => {
    (useDirection as jest.Mock).mockReturnValue({ isRTL: true });
    expect(
      render(<RtlArrow testID="back-btn" />).root.findByProps({
        testID: "back-btn",
      }).props.name,
    ).toBe("arrow-forward");
  });

  it("flips chevron-forward to chevron-back in RTL", () => {
    (useDirection as jest.Mock).mockReturnValue({ isRTL: true });
    render(<RtlChevron testID="back-btn" />);
    expect(
      render(<RtlChevron testID="back-btn" />).root.findByProps({
        testID: "back-btn",
      }).props.name,
    ).toBe("chevron-back");
  });
});
