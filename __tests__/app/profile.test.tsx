import ProfileScreen from "@/app/profile";
import { PROFILE_KEY } from "@/constants/user";
import { clearHistory, getHistory } from "@/utils/history";
import { changeLanguage } from "@/utils/i18n";
import { loadPreferences, savePreferences } from "@/utils/preferences";
import { loadProfile, saveProfile } from "@/utils/profile";
import { Storage } from "@/utils/storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

jest.mock("@/utils/profile", () => ({
  loadProfile: jest.fn(),
  saveProfile: jest.fn(),
}));

jest.mock("@/utils/preferences", () => ({
  loadPreferences: jest.fn(),
  savePreferences: jest.fn(),
}));

jest.mock("@/utils/history", () => ({
  getHistory: jest.fn(),
  clearHistory: jest.fn(),
}));

const mockConfirm = jest.fn();
jest.mock("@/store/ConfirmContext", () => ({
  useConfirm: () => mockConfirm,
}));

jest.mock("@/utils/i18n", () => ({
  changeLanguage: jest.fn(),
}));

jest.mock("@/utils/storage", () => ({
  Storage: {
    remove: jest.fn(),
  },
}));

describe("Profile Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockResolvedValue(true);
    (loadProfile as jest.Mock).mockReturnValue({
      name: "John Doe",
      bio: "Fashion Enthusiast",
      avatarUri: null,
      styleGoal: "casual",
    });
    (loadPreferences as jest.Mock).mockReturnValue({
      saveHistory: true,
      notifications: false,
    });
    (getHistory as jest.Mock).mockReturnValue([{ id: "1" }, { id: "2" }]);
  });

  it("loads profile data and displays properly", () => {
    const { getByText } = render(<ProfileScreen />);

    expect(loadProfile).toHaveBeenCalled();

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("Fashion Enthusiast")).toBeTruthy();
    // Verify stats: 2 looks
    expect(getByText("2")).toBeTruthy();
  });

  it("allows toggling name inline edit", () => {
    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    expect(getByText("John Doe")).toBeTruthy();

    // Press name row to trigger enter edit mode
    fireEvent.press(getByText("John Doe"));

    // Check if TextInput appears using placeholder
    const textInput = getByPlaceholderText("profile.placeholderName");
    expect(textInput).toBeTruthy();

    // Modify and blur to save
    fireEvent.changeText(textInput, "Jane Doe");
    fireEvent(textInput, "blur"); // trigers saveName

    expect(saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jane Doe" }),
    );
  });

  it("has functional stats pills and style goal selection", () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText("profile.casual")).toBeTruthy();

    const activeChip = getByText("profile.minimalist");
    fireEvent.press(activeChip);

    expect(saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ styleGoal: "minimalist" }),
    );
  });
  it("calls Confirm Modal on changing language", async () => {
    const { getAllByTestId } = render(<ProfileScreen />);
    const arabicBtn = getAllByTestId("app-language-change")[1];
    expect(arabicBtn).toBeDefined();
    fireEvent.press(arabicBtn);
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "warning" }),
    );
    await waitFor(() => {
      expect(changeLanguage).toHaveBeenCalledWith("ar");
    });
  });

  it("calls Confirm Modal on clearing history", async () => {
    const { getByTestId, getByText } = render(<ProfileScreen />);
    const clearHistoryHandler = getByTestId("clear-history");
    expect(clearHistoryHandler).toBeDefined();
    fireEvent.press(clearHistoryHandler);
    expect(mockConfirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(clearHistory).toHaveBeenCalled();
    });
    expect(getByText("profile.clearHistory")).toBeTruthy();
  });

  it("calls Confirm Modal on resetting profile", async () => {
    const { getByTestId, getByText } = render(<ProfileScreen />);
    const resetProfileHandler = getByTestId("reset-profile");
    expect(resetProfileHandler).toBeDefined();
    fireEvent.press(resetProfileHandler);
    expect(mockConfirm).toHaveBeenCalled();
    expect(getByText("profile.resetProfile")).toBeTruthy();
    await waitFor(() => {
      expect(Storage.remove as jest.Mock).toHaveBeenCalledWith(PROFILE_KEY);
    });
    expect(saveProfile).not.toHaveBeenCalled();
  });
  it("updates preferences when toggles are switched", () => {
    const { getByTestId } = render(<ProfileScreen />);

    const saveHistoryToggle = getByTestId("save-history");
    fireEvent(saveHistoryToggle, "onValueChange", true);

    expect(savePreferences).toHaveBeenCalledWith(
      expect.objectContaining({ saveHistory: true }),
    );

    const saveNotificationsToggle = getByTestId("save-notifications");
    fireEvent(saveNotificationsToggle, "onValueChange", true);

    expect(savePreferences).toHaveBeenCalledWith(
      expect.objectContaining({ notifications: true }),
    );
  });

  it("allows editing the bio", () => {
    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.press(getByText("Fashion Enthusiast"));
    const bioInput = getByPlaceholderText("profile.placeholderBio");

    fireEvent.changeText(bioInput, "New Bio Content");
    fireEvent(bioInput, "blur");

    expect(saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ bio: "New Bio Content" }),
    );
  });

  it("updates style goal by clicking a chip", async () => {
    const { getByText } = render(<ProfileScreen />);

    const minimalistChip = getByText("profile.minimalist");
    fireEvent.press(minimalistChip);

    expect(saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ styleGoal: "minimalist" }),
    );
  });
});
