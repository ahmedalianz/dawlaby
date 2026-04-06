import { useCallback, useState } from "react";
import { ErrorType } from "../components/common/ErrorScreen";
import { ErrorLogger, ErrorSeverity } from "../utils/errorLogger";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

interface AsyncErrorState {
  error: Error | null;
  errorType: ErrorType;
  isLoading: boolean;
}

interface UseAsyncErrorReturn extends AsyncErrorState {
  execute: <T>(fn: () => Promise<T>) => Promise<T | null>;
  clearError: () => void;
}

// ── Detect error type from error ──
const detectErrorType = (error: unknown): ErrorType => {
  if (error instanceof TypeError && error.message.includes("Network")) {
    return "network";
  }
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("network")) return "network";
    if (error.message.toLowerCase().includes("401")) return "auth";
    if (error.message.toLowerCase().includes("403")) return "auth";
    if (error.message.toLowerCase().includes("404")) return "notFound";
  }
  return "unknown";
};

// ─────────────────────────────────────────
// Hook
// ─────────────────────────────────────────

export function useAsyncError(options?: {
  context?: string;
  severity?: ErrorSeverity;
}): UseAsyncErrorReturn {
  const [state, setState] = useState<AsyncErrorState>({
    error: null,
    errorType: "unknown",
    isLoading: false,
  });

  const execute = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await fn();
        setState((prev) => ({ ...prev, isLoading: false }));
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const errorType = detectErrorType(err);

        // Log it
        ErrorLogger.log(
          error,
          { context: options?.context },
          options?.severity ?? "medium",
        );

        setState({ error, errorType, isLoading: false });
        return null;
      }
    },
    [options?.context, options?.severity],
  );

  const clearError = useCallback(() => {
    setState({ error: null, errorType: "unknown", isLoading: false });
  }, []);

  return { ...state, execute, clearError };
}
