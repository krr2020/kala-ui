import type { ErrorInfo, ReactNode } from "react";
import { Component as ReactComponent } from "react";
import { resetKeysDiffer } from "../../lib/error.utils";
import type {
	ErrorBoundaryProps,
	ErrorBoundaryState,
} from "./error-boundary.types";
import { ErrorFallback } from "./error-fallback";

/**
 * ErrorBoundary: catches render errors anywhere below, swaps in the
 * fallback surface and recovers via reset press or a resetKeys change.
 * Healthy children render directly — no wrapper view, so consumer
 * layouts are untouched.
 */
export class ErrorBoundary extends ReactComponent<
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
				<ErrorFallback
					variant="section"
					error={this.state.error}
					reset={this.reset}
				/>
			);
		}
		return this.props.children;
	}
}
