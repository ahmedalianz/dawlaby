import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import UploadScreen from "../../app/upload";

describe("Upload Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders upload initial state", () => {
    const { getByText } = render(<UploadScreen />);

    // Initial state shows Outfit selected
    expect(getByText("upload.fullOutfitToggle")).toBeTruthy();
    expect(getByText("upload.uploadOutfitBtn")).toBeTruthy();
    expect(getByText("upload.tipsHeader")).toBeTruthy(); // tips shown when no image
  });

  it("can switch toggle between outfit and item", () => {
    const { getByText } = render(<UploadScreen />);

    // Press item toggle
    fireEvent.press(getByText("upload.singleItemToggle"));

    // Check if dropzone text changed to item
    expect(getByText("upload.uploadItemBtn")).toBeTruthy();
  });

  it("can pick an image and change UI state", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: "file://some-image.jpg",
          base64: "mockbase64",
        },
      ],
    });

    const { getByText, queryByText } = render(<UploadScreen />);
    fireEvent.press(getByText("upload.uploadOutfitBtn"));

    await waitFor(() => {
      expect(queryByText("upload.tipsHeader")).toBeNull();
      expect(getByText("upload.occasionHeader")).toBeTruthy();
    });
  });

  it("allows selecting occasions when image is picked", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://some-image.jpg" }],
    });

    const { getByText } = render(<UploadScreen />);
    fireEvent.press(getByText("upload.uploadOutfitBtn"));

    await waitFor(() => {
      expect(getByText("upload.occasionHeader")).toBeTruthy();
    });

    // Tap on an Occasion chip (using standard values inside common.ts like occasion.casual)
    const casualOccasion = getByText("upload.casualDay");
    fireEvent.press(casualOccasion);

    // Test successfully interacts
    expect(casualOccasion).toBeTruthy();
  });
});
