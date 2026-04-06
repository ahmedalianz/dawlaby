import { router } from "expo-router";
import React from "react";
import { ErrorLogger } from "../../utils/errorLogger";
import { ErrorScreen, ErrorType } from "./ErrorScreen";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode;
  // Optional custom fallback instead of ErrorScreen
  fallback?: (error: Error, retry: () => void) => React.ReactNode;
  // Called when error is caught
  onError?: (error: Error, componentStack: string) => void;
  // Error type to show correct icon/title
  errorType?: ErrorType;
  // Show "Go Home" button
  showHomeButton?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─────────────────────────────────────────
// Class Component (required for error boundary)
// ─────────────────────────────────────────

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // ── Catch render errors ──
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // ── Log the error ──
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to our service
    ErrorLogger.logRender(error, info.componentStack ?? "");

    // Call optional onError prop
    this.props.onError?.(error, info.componentStack ?? "");
  }

  // ── Reset state to retry ──
  private readonly handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  // ── Go to home ──
  private readonly handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    router.replace("/home");
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default ErrorScreen
      return (
        <ErrorScreen
          error={this.state.error}
          type={this.props.errorType ?? "render"}
          onRetry={this.handleRetry}
          showHomeButton={this.props.showHomeButton ?? true}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

// ─────────────────────────────────────────
// HOC — wrap any screen with error boundary
// ─────────────────────────────────────────

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, "children">,
) {
  const displayName =
    WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";

  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...options}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}
