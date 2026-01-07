import type * as React from "react";

export interface PageTransitionProps {
	/**
	 * Children to render with transition
	 */
	children: React.ReactNode;
	/**
	 * Additional className for the transition wrapper
	 */
	className?: string;
	/**
	 * Transition duration in milliseconds (default: 300)
	 */
	duration?: number;
	/**
	 * Unique key for the current page (e.g., pathname)
	 * When this changes, the transition will re-trigger
	 */
	pageKey?: string;
}
