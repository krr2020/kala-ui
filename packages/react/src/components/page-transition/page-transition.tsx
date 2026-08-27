"use client";

/**
 * PageTransition Component
 *
 * Provides smooth fade-in transitions for page route changes in Next.js.
 * Automatically handles page transitions with proper timing.
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PageTransitionProps extends React.ComponentProps<"div"> {
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

/**
 * Wraps page content with fade-in transition on route changes.
 *
 * @example
 * ```tsx
 * // In your layout
 * <PageTransition pageKey={pathname}>
 *   {children}
 * </PageTransition>
 * ```
 */
export function PageTransition({
	children,
	className,
	duration = 300,
	pageKey,
	ref,
	...props
}: PageTransitionProps) {
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		// Reset visibility on route change
		setIsVisible(false);
		const timeout = setTimeout(() => {
			setIsVisible(true);
		}, 10); // Small delay to ensure CSS transition triggers

		return () => clearTimeout(timeout);
	}, [pageKey]);

	return (
		<div
			data-slot="page-transition"
			ref={ref}
			className={cn(
				"transition-opacity ease-in-out",
				isVisible ? "opacity-100" : "opacity-0",
				className,
			)}
			style={{ transitionDuration: `${duration}ms` }}
			{...props}
		>
			{children}
		</div>
	);
}
