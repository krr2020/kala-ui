import type * as React from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";

export interface SectionLoaderProps {
	ref?: React.Ref<HTMLDivElement>;
	/**
	 * Loading message to display
	 */
	message?: string;
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Minimum height for the loading container
	 */
	minHeight?: string;
}

/**
 * Section-level loading state component
 *
 * Displays a centered spinner within a section/container.
 * Used for component-level or section-level loading states.
 */
function SectionLoader({
	ref,
	message = "Loading...",
	className,
	minHeight = "200px",
}: SectionLoaderProps) {
	return (
		<div
			data-kala-component="loading-section-loader"
			ref={ref}
			data-slot="section-loader"
			className={cn(
				"flex flex-col items-center justify-center gap-3 py-8",
				className,
			)}
			style={{ minHeight }}
			role="status"
			aria-live="polite"
			aria-busy="true"
		>
			<Spinner size="md" label={message} className="text-primary" />
			{message && (
				<p className="text-sm text-muted-foreground" aria-live="polite">
					{message}
				</p>
			)}
		</div>
	);
}

export { SectionLoader };
