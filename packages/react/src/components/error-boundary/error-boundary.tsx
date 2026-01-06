'use client';

import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

// Simple logger for error boundary
const logError = (message: string, data: unknown) => {
  if (typeof window !== 'undefined') {
    console.error(`[ErrorBoundary] ${message}`, data);
  }
};

export interface ErrorBoundaryProps {
  /**
   * Fallback UI to display when an error occurs
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /**
   * Callback fired when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Children to render
   */
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    logError('ErrorBoundary caught an error', {
      error,
      context: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;

      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset);
      }

      return fallback;
    }

    return this.props.children;
  }
}
