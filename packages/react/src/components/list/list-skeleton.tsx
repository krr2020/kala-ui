/**
 * List Skeleton Component
 *
 * Loading placeholder variants for the List component.
 * Provides zero-CLS skeleton states that match actual list layouts.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { ListSkeletonConfig } from "../skeleton/skeleton.types";
import { SkeletonAvatar, SkeletonCircle } from "../skeleton/skeleton-patterns";

export interface ListSkeletonProps extends ListSkeletonConfig {
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
 * List skeleton component with multiple variants
 *
 * @example
 * ```tsx
 * <ListSkeleton variant="withAvatar" itemCount={5} />
 *
 * <ListSkeleton variant="multiLine" itemCount={3} dense={true} />
 * ```
 */
export function ListSkeleton({
	variant = "simple",
	itemCount = 3,
	showDividers = true,
	dense = false,
	className,
	"data-testid": dataTestId,
}: ListSkeletonProps) {
	return (
		<ul
			data-testid={dataTestId || "list-skeleton"}
			className={cn(
				"flex flex-col bg-card rounded-lg border overflow-hidden",
				showDividers && "[&>li:not(:last-child)]:border-b",
				className,
			)}
		>
			{Array.from({ length: itemCount }).map((_, index) => (
				<li
					key={index}
					className={cn(
						"flex items-center gap-3 w-full",
						dense ? "px-3 py-2" : "px-4 py-3",
					)}
				>
					{/* Render based on variant */}
					{variant === "simple" && <SimpleListItemSkeleton dense={dense} />}
					{variant === "withAvatar" && <AvatarListItemSkeleton dense={dense} />}
					{variant === "withIcon" && <IconListItemSkeleton dense={dense} />}
					{variant === "withBadge" && <BadgeListItemSkeleton dense={dense} />}
					{variant === "multiLine" && (
						<MultiLineListItemSkeleton dense={dense} />
					)}
				</li>
			))}
		</ul>
	);
}

/**
 * Simple variant: text only items
 */
function SimpleListItemSkeleton({ dense = false }: { dense?: boolean }) {
	return (
		<div className="flex-1 min-w-0">
			<Skeleton
				className={cn(dense ? "h-4" : "h-5")}
				style={{ width: "60%" }}
			/>
		</div>
	);
}

/**
 * With Avatar variant: avatar + text
 */
function AvatarListItemSkeleton({ dense = false }: { dense?: boolean }) {
	return (
		<>
			<SkeletonAvatar size={dense ? "sm" : "md"} />
			<div className="flex-1 min-w-0">
				<Skeleton
					className={cn(dense ? "h-4" : "h-5")}
					style={{ width: "70%" }}
				/>
			</div>
		</>
	);
}

/**
 * With Icon variant: icon + text
 */
function IconListItemSkeleton({ dense = false }: { dense?: boolean }) {
	return (
		<>
			<SkeletonCircle
				size={dense ? "1.25rem" : "1.5rem"}
				className="rounded-md"
			/>
			<div className="flex-1 min-w-0">
				<Skeleton
					className={cn(dense ? "h-4" : "h-5")}
					style={{ width: "60%" }}
				/>
			</div>
		</>
	);
}

/**
 * With Badge variant: text + badge
 */
function BadgeListItemSkeleton({ dense = false }: { dense?: boolean }) {
	return (
		<>
			<div className="flex-1 min-w-0">
				<Skeleton
					className={cn(dense ? "h-4" : "h-5")}
					style={{ width: "65%" }}
				/>
			</div>
			<Skeleton
				className={cn(dense ? "h-5" : "h-6", "rounded-full")}
				style={{ width: "3rem" }}
			/>
		</>
	);
}

/**
 * With Avatar And Badge variant: avatar + text + badge
/**
 * MultiLine variant: avatar + title + subtitle
 */
function MultiLineListItemSkeleton({ dense = false }: { dense?: boolean }) {
	return (
		<>
			<SkeletonAvatar size={dense ? "sm" : "md"} />
			<div className="flex-1 min-w-0">
				<Skeleton
					className={cn(dense ? "h-4" : "h-5", "mb-1")}
					style={{ width: "75%" }}
				/>
				<Skeleton
					className={cn(dense ? "h-3" : "h-4")}
					style={{ width: "50%" }}
				/>
			</div>
		</>
	);
}

/**
 * Compound component: List.Skeleton
 */
ListSkeleton.Skeleton = ListSkeleton;
