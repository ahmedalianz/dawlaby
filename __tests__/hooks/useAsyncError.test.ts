import { useAsyncError } from "@/hooks/useAsyncError";
import { ErrorLogger } from "@/utils/errorLogger";
import { act, renderHook } from "@testing-library/react-native";

jest.mock("@/utils/errorLogger", () => ({
  ErrorLogger: {
    log: jest.fn(),
  },
}));

describe("useAsyncError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles successful execution successfully", async () => {
    const { result } = renderHook(() => useAsyncError());

    let answer;
    await act(async () => {
      answer = await result.current.execute(async () => "success");
    });

    expect(answer).toBe("success");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles errors and categorizes network errors automatically", async () => {
    const { result } = renderHook(() => useAsyncError());

    await act(async () => {
      await result.current.execute(async () => {
        throw new TypeError("Network failed");
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorType).toBe("network");
    expect(ErrorLogger.log).toHaveBeenCalled();
  });

  it("clears error", () => {
    const { result } = renderHook(() => useAsyncError());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.errorType).toBe("unknown");
  });
});
