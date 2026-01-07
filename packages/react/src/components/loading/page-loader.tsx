import * as React from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";

export interface PageLoaderProps {
	/**
	 * Loading message to display
	 */
	message?: string;
	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Full-page loading state component
 *
 * Displays a centered spinner with optional message.
 * Used for page-level loading states.
 */
const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
	({ message = "Loading...", className }, ref) => {
		return (
			// biome-ignore lint/a11y/useSemanticElements: keep div for correct ref typing and layout
			<div
				ref={ref}
				data-slot="page-loader"
				className={cn(
					"flex min-h-screen flex-col items-center justify-center gap-4 bg-background",
					className,
				)}
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
	},
);
PageLoader.displayName = "PageLoader";

export { PageLoader };
