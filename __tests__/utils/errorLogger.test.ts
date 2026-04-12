import { ErrorLogger } from "@/utils/errorLogger";

describe("ErrorLogger", () => {
  const originalDev = global.__DEV__;
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  const consoleGroupSpy = jest.spyOn(console, "group").mockImplementation();
  const consoleGroupEndSpy = jest
    .spyOn(console, "groupEnd")
    .mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2026-04-12T12:00:00Z"));
  });

  afterAll(() => {
    global.__DEV__ = originalDev;
    jest.useRealTimers();
  });

  describe("log()", () => {
    it("should format an Error object correctly in __DEV__", () => {
      global.__DEV__ = true;
      const testError = new Error("Test Error");
      const context = { userId: "123" };

      ErrorLogger.log(testError, context, "high");

      expect(consoleGroupSpy).toHaveBeenCalledWith(
        expect.stringContaining("🔴 [HIGH] 2026-04-12T12:00:00.000Z"),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("Message:", "Test Error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Stack:",
        expect.any(String),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("Context:", context);
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it("should handle non-Error objects (strings) correctly", () => {
      global.__DEV__ = true;
      ErrorLogger.log("Something went wrong");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Message:",
        "Something went wrong",
      );
      // Should not log a stack for a string
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        "Stack:",
        expect.any(String),
      );
    });

    it("should not log to console when __DEV__ is false", () => {
      global.__DEV__ = false;
      ErrorLogger.log(new Error("Production Error"));

      expect(consoleGroupSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("Specialized Loggers", () => {
    it("logRender should call log with critical severity and component stack", () => {
      global.__DEV__ = true;
      const error = new Error("Render Fail");
      const compStack = "at Dashboard (index.tsx:10)";

      const logSpy = jest.spyOn(ErrorLogger, "log");

      ErrorLogger.logRender(error, compStack);

      expect(logSpy).toHaveBeenCalledWith(
        error,
        { componentStack: compStack },
        "critical",
      );
    });

    it("logNetwork should call log with high severity and API details", () => {
      global.__DEV__ = true;
      const error = new Error("404 Not Found");
      const logSpy = jest.spyOn(ErrorLogger, "log");

      ErrorLogger.logNetwork(error, "/api/profile", 404);

      expect(logSpy).toHaveBeenCalledWith(
        error,
        { endpoint: "/api/profile", statusCode: 404 },
        "high",
      );
    });
  });
});
