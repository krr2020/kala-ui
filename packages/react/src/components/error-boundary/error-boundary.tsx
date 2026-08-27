"use client";

import { AlertCircle } from "lucide-react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Button } from "../button";

// Simple logger for error boundary
const logError = (message: string, data: unknown) => {
	if (typeof window !== "undefined") {
		console.error(`[ErrorBoundary] ${message}`, data);
	}
};

export interface ErrorBoundaryProps {
	/**
	 * Fallback UI to display when an error occurs. A function receives the
	 * error and a reset callback. When omitted, a default fallback renders.
	 */
	fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
	/**
	 * Callback fired when an error is caught
	 */
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	/**
	 * When any entry changes (compared with Object.is), the boundary resets
	 * and children render again. Use e.g. a route id or retry counter so a
	 * new context recovers automatically instead of staying on the fallback.
	 */
	resetKeys?: unknown[];
	/**
	 * Children to render
	 */
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

function resetKeysDiffer(a?: unknown[], b?: unknown[]): boolean {
	const prev = a ?? [];
	const next = b ?? [];
	return (
		prev.length !== next.length ||
		prev.some((key, i) => !Object.is(key, next[i]))
	);
}

function DefaultErrorFallback({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<div
			data-kala-component="error-boundary-default-error-fallback"
			role="alert"
			className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm kala-surface-card"
		>
			<div className="flex items-start gap-2">
				<AlertCircle
					aria-hidden="true"
					className="mt-0.5 size-4 shrink-0 text-destructive"
				/>
				<div className="min-w-0 flex-1">
					<p className="font-medium text-destructive">Something went wrong</p>
					<p className="mt-1 break-words text-muted-foreground">
						{error.message}
					</p>
				</div>
			</div>
			<Button size="sm" variant="outline" className="mt-3" onClick={reset}>
				Try again
			</Button>
		</div>
	);
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI. Resets when `resetKeys`
 * change or when the fallback's `reset` callback is invoked.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback />} resetKeys={[routeId]}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		logError("ErrorBoundary caught an error", {
			error,
			context: {
				componentStack: errorInfo.componentStack,
			},
		});

		this.props.onError?.(error, errorInfo);
	}

	override componentDidUpdate(prevProps: ErrorBoundaryProps): void {
		if (
			this.state.hasError &&
			resetKeysDiffer(prevProps.resetKeys, this.props.resetKeys)
		) {
			this.setState({ hasError: false, error: null });
		}
	}

	reset = (): void => {
		this.setState({ hasError: false, error: null });
	};

	override render(): ReactNode {
		if (this.state.hasError && this.state.error) {
			const { fallback } = this.props;

			if (typeof fallback === "function") {
				return fallback(this.state.error, this.reset);
			}
			if (fallback !== undefined) {
				return fallback;
			}

			return (
				<DefaultErrorFallback error={this.state.error} reset={this.reset} />
			);
		}

		return this.props.children;
	}
}
