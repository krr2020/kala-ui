/**
 * Accordion Skeleton Component
 *
 * Loading placeholder for the Accordion component.
 * Supports multiple items with expanded state.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

export interface AccordionSkeletonConfig {
	/**
	 * Number of accordion items
	 * @default 3
	 */
	itemCount?: number;
	/**
	 * Show expanded content
	 * @default false
	 */
	defaultExpanded?: boolean;
	/**
	 * Number of content rows when expanded
	 * @default 3
	 */
	contentRows?: number;
}

export interface AccordionSkeletonProps extends AccordionSkeletonConfig {
	/**
	 * Additional className for the skeleton container
	 */
	className?: string;
	/**
	 * Test ID for querying the element
	 */
	"data-testid"?: string;
}

/**
 * Accordion skeleton component
 *
 * @example
 * ```tsx
 * <AccordionSkeleton itemCount={3} />
 *
 * <AccordionSkeleton itemCount={4} defaultExpanded contentRows={4} />
 * ```
 */
export function AccordionSkeleton({
	itemCount = 3,
	defaultExpanded = false,
	contentRows = 3,
	className,
	"data-testid": dataTestId,
}: AccordionSkeletonProps) {
	return (
		<section
			data-testid={dataTestId || "accordion-skeleton"}
			className={cn("w-full", className)}
			aria-label="Loading accordion"
			aria-busy="true"
		>
			{Array.from({ length: itemCount }).map((_, i) => (
				<div key={`item-${i}`} className="border-b">
					{/* Header */}
					<div className="flex items-center justify-between p-4">
						<Skeleton className="h-5 w-48" />
						<Skeleton className="h-4 w-4 flex-shrink-0" />
					</div>

					{/* Content (if expanded) */}
					{defaultExpanded && i === 0 && (
						<div className="p-4 pt-0 space-y-2">
							{Array.from({ length: contentRows }).map((_, j) => (
								<Skeleton
									key={`content-${j}`}
									className="h-4"
									style={{
										width: j === contentRows - 1 ? "60%" : "100%",
									}}
								/>
							))}
						</div>
					)}
				</div>
			))}
		</section>
	);
}
