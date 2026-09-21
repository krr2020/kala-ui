import type { VariantProps } from "class-variance-authority";
import type { ErrorInfo, ReactNode } from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { errorFallbackVariants } from "./error-fallback";

export interface ErrorBoundaryProps {
	/**
	 * Fallback UI to display when an error occurs. A function receives the
	 * error and a reset callback. When omitted, a default fallback renders.
	 */
	fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
	/** Callback fired when an error is caught */
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	/**
	 * When any entry changes (compared with Object.is), the boundary resets
	 * and children render again. Use e.g. a route id or retry counter so a
	 * new context recovers automatically instead of staying on the fallback.
	 */
	resetKeys?: unknown[];
	/** Children to render */
	children: ReactNode;
	/** Per-part overrides: `root` targets the default fallback surface; the healthy path renders children verbatim. */
	slotStyles?: SlotStyles;
}

export interface ErrorFallbackProps
	extends VariantProps<typeof errorFallbackVariants> {
	/** The error that was caught */
	error?: Error;
	/** Callback to reset the error boundary */
	reset?: () => void;
	/** Overrides the default title */
	title?: string;
	/** Overrides the default description */
	description?: string;
	/** Additional class name */
	className?: string;
}
