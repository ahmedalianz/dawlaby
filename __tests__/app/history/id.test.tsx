import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import HistoryDetailScreen from "../../../app/history/[id]";
import { getHistoryItem } from "../../../utils/history";
import { useLocalSearchParams } from "expo-router";

jest.mock("../../../utils/history", () => ({
  getHistoryItem: jest.fn(),
  deleteHistoryItem: jest.fn(),
  formatDate: jest.fn(() => "Jan 1, 2026"),
}));

describe("History Detail Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "look1" });
  });

  it("shows loading and then displays the item info", async () => {
    (getHistoryItem as jest.Mock).mockResolvedValueOnce({
      id: "look1",
      imageUri: "file://item.jpg",
      result: {
        style_vibe: "Streetwear",
        detected_items: ["Hoodie", "Sneakers"],
        color_palette: ["Black", "White"],
        occasions: ["Casual", "Night out"],
        suggestions: [{ title: "Accessory", description: "Cap" }],
        stylist_note: "Cool look.",
      },
      date: new Date().toISOString(),
    });

    const { getByText, queryByText } = render(<HistoryDetailScreen />);

    // Initially loading
    expect(getByText("historyDetail.loading")).toBeTruthy();

    await waitFor(() => {
      expect(queryByText("historyDetail.loading")).toBeNull();
    });

    expect(getByText("Streetwear")).toBeTruthy();
    expect(getByText("Hoodie")).toBeTruthy();
    expect(getByText("Black")).toBeTruthy();
    expect(getByText("Casual")).toBeTruthy();
    expect(getByText("Accessory")).toBeTruthy();
    expect(getByText('"Cool look."')).toBeTruthy();
  });

  it("shows error if look not found", async () => {
    (getHistoryItem as jest.Mock).mockRejectedValueOnce(new Error("Look not found"));

    const { getByText } = render(<HistoryDetailScreen />);

    await waitFor(() => {
      expect(getByText("Look not found")).toBeTruthy();
      expect(getByText("common.goBack")).toBeTruthy();
    });
  });
});
