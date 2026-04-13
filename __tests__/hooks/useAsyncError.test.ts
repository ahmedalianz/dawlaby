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
  it("categorizes 401 and 403 as auth errors", async () => {
    const { result } = renderHook(() => useAsyncError());

    await act(async () => {
      await result.current.execute(async () => {
        throw new Error("Unauthorized (401)");
      });
    });
    expect(result.current.errorType).toBe("auth");

    await act(async () => {
      await result.current.execute(async () => {
        throw new Error("Forbidden (403)");
      });
    });
    expect(result.current.errorType).toBe("auth");
  });

  it("categorizes 404 as notFound error", async () => {
    const { result } = renderHook(() => useAsyncError());

    await act(async () => {
      await result.current.execute(async () => {
        throw new Error("Resource 404 not found");
      });
    });
    expect(result.current.errorType).toBe("notFound");
  });

  it("returns unknown for errors without specific keywords", async () => {
    const { result } = renderHook(() => useAsyncError());

    await act(async () => {
      await result.current.execute(async () => {
        throw new Error("Something completely different happened");
      });
    });
    expect(result.current.errorType).toBe("unknown");
  });

  it("handles non-Error objects gracefully", async () => {
    const { result } = renderHook(() => useAsyncError());

    await act(async () => {
      // Throwing a plain string instead of an Error object
      await result.current.execute(async () => {
        throw "Critical system failure";
      });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Critical system failure");
    expect(result.current.errorType).toBe("unknown");
  });
});
