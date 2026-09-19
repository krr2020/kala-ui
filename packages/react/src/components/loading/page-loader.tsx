import type * as React from "react";
import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { Spinner } from "../spinner";

export interface PageLoaderProps {
	ref?: React.Ref<HTMLDivElement>;
	/**
	 * Loading message to display
	 */
	message?: string;
	/**
	 * Additional CSS classes
	 */
	className?: string;
	style?: React.CSSProperties;
	slotStyles?: SlotStyles;
}

/**
 * Full-page loading state component
 *
 * Displays a centered spinner with optional message.
 * Used for page-level loading states.
 */
function PageLoader({
	ref,
	message = "Loading...",
	className,
	style,
	slotStyles,
}: PageLoaderProps) {
	const root = applySlot(
		cn("flex min-h-screen flex-col items-center justify-center gap-4 bg-background", className),
		slotStyles?.root,
	);
	return (
		<div
			data-kala-component="loading-page-loader"
			ref={ref}
			data-slot="page-loader"
			className={root.className}
			style={mergeStyle(style, root.style)}
			role="status"
			aria-live="polite"
			aria-busy="true"
		>
			<Spinner size="lg" label={message} className="text-primary" />
			{message && (
				<p className="text-sm text-muted-foreground" aria-live="polite">
					{message}
				</p>
			)}
		</div>
	);
}

export { PageLoader };
