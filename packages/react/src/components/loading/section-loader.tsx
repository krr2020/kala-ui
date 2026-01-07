import * as React from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";

export interface SectionLoaderProps {
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
const SectionLoader = React.forwardRef<HTMLDivElement, SectionLoaderProps>(
	({ message = "Loading...", className, minHeight = "200px" }, ref) => {
		return (
			// biome-ignore lint/a11y/useSemanticElements: keep div for correct ref typing and layout
			<div
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
	},
);
SectionLoader.displayName = "SectionLoader";

export { SectionLoader };
