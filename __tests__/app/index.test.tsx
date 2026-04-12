import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import IndexScreen from "../../app/index";

// Mock SplashAnimation to test its onFinish
jest.mock("../../components/common/SplashAnimation", () => {
  const { View, Button } = require("react-native");
  return function MockSplash({ onFinish }: any) {
    return (
      <View testID="splash-animation">
        <Button testID="finish-splash" title="Finish" onPress={onFinish} />
      </View>
    );
  };
});

// Mock Redirect from expo-router
jest.mock("expo-router", () => ({
  __esModule: true,
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require("react-native");
    return <Text testID="redirect-mock">{href}</Text>;
  },
}));

describe("Index Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders splash screen initially", () => {
    const { getByTestId } = render(<IndexScreen />);
    expect(getByTestId("splash-animation")).toBeTruthy();
  });

  it("redirects to /home if onboarding is completed", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");

    const { getByTestId, queryByTestId, getByText } = render(<IndexScreen />);

    // Simulate splash finishing
    fireEvent.press(getByTestId("finish-splash"));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "hasCompletedOnboarding",
      );
    });

    // Expect redirect
    await waitFor(() => {
      expect(queryByTestId("splash-animation")).toBeNull();
      expect(getByTestId("redirect-mock")).toBeTruthy();
      expect(getByText("/home")).toBeTruthy();
    });
  });

  it("redirects to /onboarding if onboarding is not completed", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("false");

    const { getByTestId, getByText } = render(<IndexScreen />);

    fireEvent.press(getByTestId("finish-splash"));

    await waitFor(() => {
      expect(getByText("/onboarding")).toBeTruthy();
    });
  });
});
