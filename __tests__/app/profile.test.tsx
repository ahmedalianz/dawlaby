import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import ProfileScreen from "../../app/profile";
import { getHistory } from "../../utils/history";
import { loadPreferences } from "../../utils/preferences";
import { loadProfile, saveProfile } from "../../utils/profile";

jest.mock("../../utils/profile", () => ({
  loadProfile: jest.fn(),
  saveProfile: jest.fn(),
}));

jest.mock("../../utils/preferences", () => ({
  loadPreferences: jest.fn(),
  savePreferences: jest.fn(),
}));

jest.mock("../../utils/history", () => ({
  getHistory: jest.fn(),
  clearHistory: jest.fn(),
}));

describe("Profile Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadProfile as jest.Mock).mockResolvedValue({
      name: "John Doe",
      bio: "Fashion Enthusiast",
      avatarUri: null,
      styleGoal: "casual",
    });
    (loadPreferences as jest.Mock).mockResolvedValue({
      saveHistory: true,
      notifications: false,
    });
    (getHistory as jest.Mock).mockResolvedValue([{ id: "1" }, { id: "2" }]);
  });

  it("loads profile data and displays properly", async () => {
    const { getByText } = render(<ProfileScreen />);

    // Wait for async load
    await waitFor(() => {
      expect(loadProfile).toHaveBeenCalled();
    });

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("Fashion Enthusiast")).toBeTruthy();
    // Verify stats: 2 looks
    expect(getByText("2")).toBeTruthy();
  });

  it("allows toggling name inline edit", async () => {
    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("John Doe")).toBeTruthy();
    });

    // Press name row to trigger enter edit mode
    fireEvent.press(getByText("John Doe"));

    // Check if TextInput appears using placeholder
    const textInput = getByPlaceholderText("profile.placeholderName");
    expect(textInput).toBeTruthy();

    // Modify and blur to save
    fireEvent.changeText(textInput, "Jane Doe");
    fireEvent(textInput, "blur"); // trigers saveName

    await waitFor(() => {
      expect(saveProfile).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Jane Doe" }),
      );
    });
  });

  it("has functional stats pills and style goal selection", async () => {
    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("profile.casual")).toBeTruthy();
    });

    // The component displays multiple STYLE_GOALS
    // By picking the text representing a non-active style goal, we can change it
    const activeChip = getByText("profile.minimalist");
    fireEvent.press(activeChip);

    await waitFor(() => {
      expect(saveProfile).toHaveBeenCalledWith(
        expect.objectContaining({ styleGoal: "minimalist" }),
      );
    });
  });
});
