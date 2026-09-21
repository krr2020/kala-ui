import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import { Spinner } from "../spinner";
import type { SectionLoaderProps } from "./loading.types";

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
	style,
	slotStyles: slotStylesRaw,
	minHeight = "200px",
}: SectionLoaderProps) {
	const slotStyles = useSlotStyles("loading", slotStylesRaw);
	const root = applySlot(
		cn("flex flex-col items-center justify-center gap-3 py-8", className),
		slotStyles?.root,
	);
	return (
		<div
			data-kala-component="loading-section-loader"
			ref={ref}
			data-slot="section-loader"
			className={root.className}
			style={{ minHeight, ...mergeStyle(style, root.style) }}
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
