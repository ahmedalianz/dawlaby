import Home from "@/app/home";
import { getHistory } from "@/utils/history";
import { loadProfile } from "@/utils/profile";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

// Define mocks
jest.mock("@/utils/profile", () => ({
  loadProfile: jest.fn(),
}));

jest.mock("@/utils/history", () => ({
  getHistory: jest.fn(),
}));

describe("Home Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadProfile as jest.Mock).mockReturnValue({
      name: "Test User",
      avatarUri: "https://test.com/avatar.jpg",
    });
    (getHistory as jest.Mock).mockReturnValue([
      { id: "1", imageUri: "https://test.com/1.jpg", styleVibe: "Casual" },
      { id: "2", imageUri: "https://test.com/2.jpg", styleVibe: "Formal" },
    ]);
  });

  it("renders correctly and loads recent outfits", async () => {
    const { getByText } = render(<Home />);

    expect(loadProfile).toHaveBeenCalled();
    expect(getHistory).toHaveBeenCalled();

    expect(getByText("home.welcomeBack")).toBeTruthy();
    expect(getByText("home.recentOutfits")).toBeTruthy();

    // Verify badges for recent history
    expect(getByText("Casual")).toBeTruthy();
    expect(getByText("Formal")).toBeTruthy();
  });

  it("navigates to secondary screens correctly", async () => {
    const { getByText } = render(<Home />);
    expect(loadProfile).toHaveBeenCalled();

    // Find and interact with "Upload Photo" functionality
    const uploadBtn = getByText("home.uploadPhoto");
    fireEvent.press(uploadBtn);
    expect(router.push).toHaveBeenCalledWith("/upload");

    // Find and interact with "Voice Assistant" functionality
    const voiceBtn = getByText("home.voiceAssistant");
    fireEvent.press(voiceBtn);
    expect(router.push).toHaveBeenCalledWith("/voice");

    // Check navigation for history
    const seeAllBtn = getByText("home.viewHistory");
    fireEvent.press(seeAllBtn);
    expect(router.push).toHaveBeenCalledWith("/history");
  });
});
