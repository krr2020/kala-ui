/**
 * Dialog Skeleton Component
 *
 * Loading placeholder for the Dialog component.
 * Supports header, body, and footer sections.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface DialogSkeletonConfig {
	/**
	 * Show dialog header
	 * @default true
	 */
	showHeader?: boolean;
	/**
	 * Show dialog footer
	 * @default true
	 */
	showFooter?: boolean;
	/**
	 * Number of content rows
	 * @default 4
	 */
	contentRows?: number;
}

export interface DialogSkeletonProps extends DialogSkeletonConfig {
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
 * Dialog skeleton component
 *
 * @example
 * ```tsx
 * <DialogSkeleton contentRows={4} />
 *
 * <DialogSkeleton showHeader={false} contentRows={6} />
 * ```
 */
export function DialogSkeleton({
	showHeader = true,
	showFooter = true,
	contentRows = 4,
	className,
	"data-testid": dataTestId,
}: DialogSkeletonProps) {
	return (
		<section
			data-testid={dataTestId || "dialog-skeleton"}
			className={cn("space-y-4", className)}
			aria-label="Loading dialog"
			aria-busy="true"
		>
			{/* Header */}
			{showHeader && (
				<div className="flex items-center justify-between">
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-5 w-5 flex-shrink-0" />
				</div>
			)}

			{/* Body */}
			<div className="space-y-3">
				{Array.from({ length: contentRows }).map((_, i) => (
					<Skeleton
						key={`content-${i}`}
						className="h-4"
						style={{
							width:
								i === contentRows - 1
									? "60%"
									: i === contentRows - 2
										? "80%"
										: "100%",
						}}
					/>
				))}
			</div>

			{/* Footer */}
			{showFooter && (
				<div className="flex justify-end gap-2">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-24" />
				</div>
			)}
		</section>
	);
}
