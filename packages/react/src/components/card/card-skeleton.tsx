/**
 * Card Skeleton Component
 *
 * Loading placeholder variants for the Card component.
 * Provides zero-CLS skeleton states that match actual card layouts.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { CardSkeletonConfig } from "../skeleton/skeleton.types";
import { SkeletonText } from "../skeleton/skeleton-patterns";

export interface CardSkeletonProps extends CardSkeletonConfig {
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
 * Card skeleton component with multiple variants
 *
 * @example
 * ```tsx
 * <CardSkeleton variant="withImage" contentRows={3} />
 *
 * <CardSkeleton variant="horizontal" imagePosition="left" />
 * ```
 */
export function CardSkeleton({
	variant = "default",
	hasHeader = true,
	hasFooter = false,
	imagePosition = "top",
	contentRows = 3,
	showActions = false,
	className,
	"data-testid": dataTestId,
}: CardSkeletonProps) {
	return (
		<div
			data-testid={dataTestId || "card-skeleton"}
			className={cn("rounded-md border bg-card overflow-hidden", className)}
		>
			{/* Render based on variant */}
			{variant === "default" && (
				<DefaultCardSkeleton
					hasHeader={hasHeader}
					contentRows={contentRows}
					hasFooter={hasFooter}
					showActions={showActions}
				/>
			)}

			{variant === "withImage" && (
				<WithImageCardSkeleton
					hasHeader={hasHeader}
					contentRows={contentRows}
					hasFooter={hasFooter}
					showActions={showActions}
				/>
			)}

			{variant === "withImageTop" && (
				<WithImageTopCardSkeleton
					hasHeader={hasHeader}
					contentRows={contentRows}
					hasFooter={hasFooter}
					showActions={showActions}
				/>
			)}

			{variant === "horizontal" && (
				<HorizontalCardSkeleton
					imagePosition={imagePosition}
					hasHeader={hasHeader}
					contentRows={contentRows}
					hasFooter={hasFooter}
					showActions={showActions}
				/>
			)}

			{variant === "withFooter" && (
				<WithFooterCardSkeleton
					hasHeader={hasHeader}
					contentRows={contentRows}
					showActions={showActions}
				/>
			)}

			{variant === "minimal" && (
				<MinimalCardSkeleton contentRows={contentRows} />
			)}
		</div>
	);
}

/**
 * Default variant: header + content rows
 */
function DefaultCardSkeleton({
	hasHeader = true,
	contentRows = 3,
	hasFooter = false,
	showActions = false,
}: {
	hasHeader?: boolean;
	contentRows?: number;
	hasFooter?: boolean;
	showActions?: boolean;
}) {
	return (
		<>
			{hasHeader && (
				<div className="flex flex-col space-y-1.5 p-6">
					<Skeleton className="h-8 w-3/5" />
					<Skeleton className="h-4 w-2/5" />
				</div>
			)}
			<div className={cn("p-6", hasHeader ? "pt-0" : "py-6")}>
				<SkeletonText lines={contentRows} />
			</div>
			{(hasFooter || showActions) && (
				<div className="flex items-center border-t border-separator px-6 py-4 gap-2">
					<Skeleton className="h-9 w-16" />
					<Skeleton className="h-9 w-16" />
				</div>
			)}
		</>
	);
}

/**
 * With Image variant: image + header + content
 */
function WithImageCardSkeleton({
	hasHeader = true,
	contentRows = 3,
	hasFooter = false,
	showActions = false,
}: {
	hasHeader?: boolean;
	contentRows?: number;
	hasFooter?: boolean;
	showActions?: boolean;
}) {
	return (
		<>
			<Skeleton className="h-48 w-full" />
			{hasHeader && (
				<div className="flex flex-col space-y-1.5 p-6">
					<Skeleton className="h-8 w-3/5" />
					<Skeleton className="h-4 w-2/5" />
				</div>
			)}
			<div className={cn("p-6", hasHeader ? "pt-0" : "py-6")}>
				<SkeletonText lines={contentRows} />
			</div>
			{(hasFooter || showActions) && (
				<div className="flex items-center border-t border-separator px-6 py-4 gap-2">
					<Skeleton className="h-9 w-16" />
					<Skeleton className="h-9 w-16" />
				</div>
			)}
		</>
	);
}

/**
 * With Image Top variant: top image + content (no header)
 */
function WithImageTopCardSkeleton({
	hasHeader = false,
	contentRows = 3,
	hasFooter = false,
	showActions = false,
}: {
	hasHeader?: boolean;
	contentRows?: number;
	hasFooter?: boolean;
	showActions?: boolean;
}) {
	return (
		<>
			<Skeleton className="h-48 w-full" />
			{hasHeader && (
				<div className="flex flex-col space-y-1.5 p-6">
					<Skeleton className="h-8 w-3/5" />
				</div>
			)}
			<div className={cn("p-6", hasHeader ? "pt-0" : "py-6")}>
				<SkeletonText lines={contentRows} />
			</div>
			{(hasFooter || showActions) && (
				<div className="flex items-center border-t border-separator px-6 py-4 gap-2">
					<Skeleton className="h-9 w-16" />
					<Skeleton className="h-9 w-16" />
				</div>
			)}
		</>
	);
}

/**
 * Horizontal variant: side-by-side layout
 */
function HorizontalCardSkeleton({
	imagePosition = "left",
	hasHeader = true,
	contentRows = 2,
	hasFooter = false,
	showActions = false,
}: {
	imagePosition?: "top" | "left" | "right";
	hasHeader?: boolean;
	contentRows?: number;
	hasFooter?: boolean;
	showActions?: boolean;
}) {
	return (
		<div className="flex">
			{imagePosition === "left" && (
				<Skeleton className="h-48 w-48 flex-shrink-0" />
			)}
			<div className="flex flex-1 flex-col">
				{hasHeader && (
					<div className="flex flex-col space-y-1.5 p-6">
						<Skeleton className="h-8 w-3/5" />
						<Skeleton className="h-4 w-2/5" />
					</div>
				)}
				<div className={cn("p-6", hasHeader ? "pt-0" : "py-6")}>
					<SkeletonText lines={contentRows} />
				</div>
				{(hasFooter || showActions) && (
					<div className="mt-auto flex items-center border-t border-separator px-6 py-4 gap-2">
						<Skeleton className="h-9 w-16" />
						<Skeleton className="h-9 w-16" />
					</div>
				)}
			</div>
			{imagePosition === "right" && (
				<Skeleton className="h-48 w-48 flex-shrink-0" />
			)}
		</div>
	);
}

/**
 * With Footer variant: includes footer actions
 */
function WithFooterCardSkeleton({
	hasHeader = true,
	contentRows = 3,
	showActions = true,
}: {
	hasHeader?: boolean;
	contentRows?: number;
	showActions?: boolean;
}) {
	return (
		<>
			{hasHeader && (
				<div className="flex flex-col space-y-1.5 p-6">
					<Skeleton className="h-8 w-3/5" />
					<Skeleton className="h-4 w-2/5" />
				</div>
			)}
			<div className={cn("p-6", hasHeader ? "pt-0" : "py-6")}>
				<SkeletonText lines={contentRows} />
			</div>
			{showActions && (
				<div className="flex items-center border-t border-separator px-6 py-4 gap-2">
					<Skeleton className="h-9 w-16" />
					<Skeleton className="h-9 w-16" />
				</div>
			)}
		</>
	);
}

/**
 * Minimal variant: content only, no header
 */
function MinimalCardSkeleton({ contentRows = 3 }: { contentRows?: number }) {
	return (
		<div className="py-6 px-6">
			<SkeletonText lines={contentRows} />
		</div>
	);
}

/**
 * Compound component: Card.Skeleton
 */
CardSkeleton.Skeleton = CardSkeleton;
