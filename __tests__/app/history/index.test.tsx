import HistoryScreen from "@/app/history/index";
import { clearHistory, deleteHistoryItem, getHistory } from "@/utils/history";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

// 1. Mock the history utils
jest.mock("@/utils/history", () => ({
  getHistory: jest.fn(),
  clearHistory: jest.fn(),
  deleteHistoryItem: jest.fn(),
}));

// 2. Mock HistoryContent with a named component
jest.mock("@/components/history/HistoryContent", () => {
  const { Text, TouchableOpacity } = require("react-native");

  const MockHistoryContent = (props: any) => (
    <TouchableOpacity
      testID="mock-delete-trigger"
      onLongPress={() => props.handleDelete("h1")}
    >
      <Text>ViewMode: {props.view}</Text>
      {props.items.map((i: any) => (
        <Text key={i.id}>{i.result.style_vibe}</Text>
      ))}
    </TouchableOpacity>
  );

  MockHistoryContent.displayName = "MockHistoryContent";
  return MockHistoryContent;
});

// 3. Mock TopBar with a named component
jest.mock("@/components/common/TopBar", () => {
  const { View } = require("react-native");

  const MockTopBar = (props: any) => (
    <View
      testID="TopBar"
      onFirstButtonPress={props.onFirstButtonPress}
      onSecondButtonPress={props.onSecondButtonPress}
    />
  );

  MockTopBar.displayName = "MockTopBar";
  return MockTopBar;
});

describe("History Screen", () => {
  const mockItems = [
    {
      id: "h1",
      imageUri: "u1",
      result: { style_vibe: "Formal" },
      date: "2026-01-01",
    },
    {
      id: "h2",
      imageUri: "u2",
      result: { style_vibe: "Casual" },
      date: "2026-01-02",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getHistory as jest.Mock).mockResolvedValue(mockItems);
  });

  it("loads and displays history count and items", async () => {
    const { getByText } = render(<HistoryScreen />);

    await waitFor(() => {
      expect(getHistory).toHaveBeenCalled();
      // Verifies t("history.count") was called
      expect(getByText("history.count")).toBeTruthy();
      expect(getByText("Formal")).toBeTruthy();
      expect(getByText("Casual")).toBeTruthy();
    });
  });

  it("toggles view mode between Grid and List", async () => {
    const { getByText, getByTestId } = render(<HistoryScreen />);

    await waitFor(() => expect(getByText("ViewMode: grid")).toBeTruthy());

    // In our TopBar global mock, firstButtonIcon changes.
    // We trigger the onPress of the first button (View Toggle)
    const topBar = getByTestId("TopBar");
    fireEvent(topBar, "firstButtonPress");

    expect(getByText("ViewMode: list")).toBeTruthy();
  });

  it("shows Alert and clears history on confirmation", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByTestId, queryByText } = render(<HistoryScreen />);

    await waitFor(() => expect(getHistory).toHaveBeenCalled());

    // Trigger Trash icon (second button)
    const topBar = getByTestId("TopBar");
    fireEvent(topBar, "secondButtonPress");

    // Check if Alert was called with correct title/message
    expect(alertSpy).toHaveBeenCalledWith(
      "history.clearTitle",
      "history.clearDesc",
      expect.any(Array),
    );

    // Simulate clicking "Clear All" in the Alert
    const clearOption = alertSpy.mock.calls[0][2]?.[1]; // Second button in alert array

    await act(async () => {
      if (clearOption?.onPress) await clearOption.onPress();
    });

    expect(clearHistory).toHaveBeenCalled();
    // Items should be gone from UI
    expect(queryByText("Formal")).toBeNull();
  });

  it("handles individual item deletion via HistoryContent", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByTestId, getByText, queryByText } = render(<HistoryScreen />);

    await waitFor(() => expect(getByText("Formal")).toBeTruthy());

    // Trigger long press delete from our mocked HistoryContent
    fireEvent(getByTestId("mock-delete-trigger"), "longPress");

    // Confirm the delete alert showed up
    expect(alertSpy).toHaveBeenCalledWith(
      "historyDetail.removeTitle",
      "historyDetail.removeDesc",
      expect.any(Array),
    );

    const deleteConfirm = alertSpy.mock.calls[0][2]?.[1];
    await act(async () => {
      if (deleteConfirm?.onPress) await deleteConfirm.onPress();
    });

    expect(deleteHistoryItem).toHaveBeenCalledWith("h1");
    expect(queryByText("Formal")).toBeNull();
  });
});
