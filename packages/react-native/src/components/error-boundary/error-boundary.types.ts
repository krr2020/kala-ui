import type { ErrorInfo, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export interface ErrorBoundaryProps {
	/**
	 * Fallback UI on crash: a node, or a render prop receiving the error
	 * and a reset callback. Falls back to the shared ErrorFallback surface.
	 */
	fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
	/** fires once when an error is caught */
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	/**
	 * When any entry changes (Object.is), the boundary resets and children
	 * render again — e.g. a route id or retry counter.
	 */
	resetKeys?: unknown[];
	children: ReactNode;
}

export type ErrorFallbackVariant = "page" | "section";

export interface ErrorFallbackProps {
	/** the caught error; its message renders as the description */
	error?: Error;
	/** renders the reset button when provided */
	reset?: () => void;
	title?: string;
	/** overrides the error message / default copy */
	description?: string;
	/** page (tall, standalone) vs section (compact, inline) */
	variant?: ErrorFallbackVariant;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
