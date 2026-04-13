import HistoryContent from "@/components/history/HistoryContent";
import { HistoryContentView } from "@/types";
import { render } from "@testing-library/react-native";
import React from "react";

describe("HistoryContent", () => {
  const mockItems = [
    {
      id: "1",
      styleVibe: "Chic",
      date: "2026-04-12",
      imageUri: "",
      detectedItems: [],
      stylistNote: "",
      occasions: [],
      result: {
        detected_items: [],
        style_vibe: "",
        color_palette: [],
        occasions: [],
        suggestions: [],
        stylist_note: "",
      },
    },
  ];
  const fadeAnim: any = jest.fn();

  it("shows loading skeletons when loading is true", () => {
    const { getAllByTestId } = render(
      <HistoryContent
        loading={true}
        items={[]}
        view={HistoryContentView.Grid}
        fadeAnim={fadeAnim}
        handleDelete={() => {}}
      />,
    );
    expect(getAllByTestId("skeleton")).toHaveLength(4);
  });

  it("renders EmptyState when items are empty and not loading", () => {
    const { getByText } = render(
      <HistoryContent
        loading={false}
        items={[]}
        view={HistoryContentView.Grid}
        fadeAnim={fadeAnim}
        handleDelete={() => {}}
      />,
    );
    expect(getByText("history.emptyTitle")).toBeTruthy();
  });

  it("switches to Grid view correctly", () => {
    const { getByText } = render(
      <HistoryContent
        loading={false}
        items={mockItems}
        view={HistoryContentView.Grid}
        fadeAnim={fadeAnim}
        handleDelete={() => {}}
      />,
    );
    expect(getByText("Chic")).toBeTruthy();
  });
});
