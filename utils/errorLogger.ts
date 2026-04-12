// ─────────────────────────────────────────
// Error Logger — swap console with Sentry/
// Crashlytics/Datadog when ready
// ─────────────────────────────────────────

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface LoggedError {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  severity: ErrorSeverity;
  timestamp: string;
}

const formatError = (
  error: unknown,
  context?: Record<string, unknown>,
  severity: ErrorSeverity = "medium",
): LoggedError => {
  const isError = error instanceof Error;
  return {
    message: isError ? error.message : String(error),
    stack: isError ? error.stack : undefined,
    context,
    severity,
    timestamp: new Date().toISOString(),
  };
};

export const ErrorLogger = {
  // ── Log any error ──
  log: (
    error: unknown,
    context?: Record<string, unknown>,
    severity: ErrorSeverity = "medium",
    forceDev = __DEV__,
  ) => {
    const isDevMode = forceDev ?? __DEV__;
    const formatted = formatError(error, context, severity);

    // 👇 Replace with Sentry:
    // Sentry.captureException(error, { extra: context, level: severity });

    // 👇 Replace with Firebase Crashlytics:
    // crashlytics().recordError(error as Error);

    // 👇 Replace with Datadog:
    // DdLogs.error(formatted.message, formatted);

    if (isDevMode) {
      console.group(`🔴 [${severity.toUpperCase()}] ${formatted.timestamp}`);
      console.error("Message:", formatted.message);
      if (formatted.stack) console.error("Stack:", formatted.stack);
      if (formatted.context) console.error("Context:", formatted.context);
      console.groupEnd();
    }
  },

  // ── Log render error (from ErrorBoundary) ──
  logRender: (error: Error, componentStack: string) => {
    ErrorLogger.log(error, { componentStack }, "critical");
  },

  // ── Log network/API error ──
  logNetwork: (error: unknown, endpoint: string, statusCode?: number) => {
    ErrorLogger.log(error, { endpoint, statusCode }, "high");
  },
};
