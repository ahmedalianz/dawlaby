import HistoryListSeparator from "@/components/history/HistoryListSeparator";
import { render } from "@testing-library/react-native";
import React from "react";

describe("HistoryListSeparator Component", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<HistoryListSeparator />);
    expect(getByTestId("history-list-separator")).toBeTruthy();
  });

  it("renders with correct height", () => {
    const { getByTestId } = render(<HistoryListSeparator />);
    const separator = getByTestId("history-list-separator");
    expect(separator.props.style).toEqual({ height: 12 });
  });
});
