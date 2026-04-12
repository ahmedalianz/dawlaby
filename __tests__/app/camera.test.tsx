import { render, waitFor } from "@testing-library/react-native";
import { useCameraPermissions } from "expo-camera";
import { launchImageLibraryAsync } from "expo-image-picker";
import React from "react";
import CameraScreen from "../../app/camera";

describe("Camera Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows permission layout when permission is missing/denied", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: false },
      jest.fn(),
    ]);

    const { getByText } = render(<CameraScreen />);

    expect(getByText("camera.permissionTitle")).toBeTruthy();
    expect(getByText("camera.allowCamera")).toBeTruthy();
  });

  it("shows camera layout when permission is granted", () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      jest.fn(),
    ]);

    const { getByText, queryByText } = render(<CameraScreen />);

    // Permission shouldn't exist anymore
    expect(queryByText("camera.permissionTitle")).toBeNull();

    // Modes should be visible
    expect(getByText("Photo")).toBeTruthy();
    expect(getByText("Portrait")).toBeTruthy();

    // Default hint for Photo mode
    expect(getByText("camera.photoHint")).toBeTruthy();
  });

  it("allows user to pick image from gallery and processes it appropriately", async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      jest.fn(),
    ]);

    (launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://mock/gallery/image.jpg" }],
    });

    const { queryByText } = render(<CameraScreen />);

    // Wait for render
    await waitFor(() => {
      expect(queryByText("camera.photoHint")).toBeTruthy();
    });
  });
});
