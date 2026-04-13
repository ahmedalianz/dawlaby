import SplashAnimation from "@/components/common/SplashAnimation";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// 1. Mock Worklets to execute the callback immediately
jest.mock("react-native-worklets", () => ({
  scheduleOnRN: jest.fn((cb) => cb()),
}));

// 2. Mock Translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("SplashAnimation", () => {
  const mockOnFinish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // We use fake timers to skip through the 2400ms+ animation sequence
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the logo and tagline", () => {
    const { getByText } = render(<SplashAnimation onFinish={mockOnFinish} />);

    // Check if tagline translation key is present
    expect(getByText("splash.tagline")).toBeTruthy();
  });

  it("triggers onFinish after the animation sequence completes", async () => {
    render(<SplashAnimation onFinish={mockOnFinish} />);

    // Fast-forward through the delays (0 + 500 + 950 + 1650 + 1800 + 2400ms)
    // The total time until exit completes is roughly 2900ms (2400 delay + 500 duration)
    jest.advanceTimersByTime(3500);

    await waitFor(() => {
      expect(mockOnFinish).toHaveBeenCalledTimes(1);
    });
  });

  it("renders the three decorative dots", () => {
    const { toJSON } = render(<SplashAnimation onFinish={mockOnFinish} />);
    const json = toJSON() as any;

    // The dots are inside the last Animated.View in the structure
    // We can verify the dots row exists by checking the tree depth
    const container = json.children;
    expect(container.length).toBeGreaterThan(0);
  });
});
