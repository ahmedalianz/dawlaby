import { render, waitFor } from "@testing-library/react-native";
import { useFonts } from "expo-font";
import React from "react";
import Layout from "../../app/_layout";
import { initI18n } from "../../utils/i18n";

jest.mock("../../utils/i18n", () => ({
  initI18n: jest.fn().mockResolvedValue(true),
}));

jest.mock("expo-router", () => ({
  Stack: Object.assign(
    ({ children }: any) => {
      const { View } = require("react-native");
      return <View testID="mocked-stack">{children}</View>;
    },
    {
      Screen: () => null,
    },
  ),
}));

jest.mock("expo-font", () => ({
  useFonts: jest.fn(),
}));

describe("App Layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly after i18n initializes", async () => {
    (useFonts as jest.Mock).mockReturnValue([true, null]);

    const { getByTestId } = render(<Layout />);

    // initially might be null before effect resolves
    // Wait for internal state update to render stack
    await waitFor(() => {
      expect(initI18n).toHaveBeenCalled();
      expect(getByTestId("mocked-stack")).toBeTruthy();
    });
  });
});
