/**
 * Tabs Skeleton Component
 *
 * Loading placeholder for the Tabs component.
 * Supports different variants and content area.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

export interface TabsSkeletonConfig {
	/**
	 * Number of tabs
	 * @default 4
	 */
	tabCount?: number;
	/**
	 * Tab variant style
	 * @default 'default'
	 */
	variant?: "default" | "pills" | "underline";
	/**
	 * Show tab content skeleton
	 * @default true
	 */
	showContent?: boolean;
	/**
	 * Number of content rows
	 * @default 4
	 */
	contentRows?: number;
}

export interface TabsSkeletonProps extends TabsSkeletonConfig {
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
 * Tabs skeleton component
 *
 * @example
 * ```tsx
 * <TabsSkeleton tabCount={4} variant="default" />
 *
 * <TabsSkeleton variant="pills" showContent contentRows={5} />
 * ```
 */
export function TabsSkeleton({
	tabCount = 4,
	variant = "default",
	showContent = true,
	contentRows = 4,
	className,
	"data-testid": dataTestId,
}: TabsSkeletonProps) {
	return (
		<section
			data-testid={dataTestId || "tabs-skeleton"}
			className={cn("w-full", className)}
			aria-label="Loading tabs"
			aria-busy="true"
		>
			{/* Tab list */}
			<div
				className={cn(
					"flex gap-2",
					variant === "default" && "border-b",
					variant === "underline" && "border-b",
				)}
			>
				{Array.from({ length: tabCount }).map((_, i) => (
					<Skeleton
						key={`tab-${i}`}
						className={cn(
							"h-10 w-24",
							variant === "pills" && "rounded-lg",
							variant === "default" && "rounded-t-lg",
							variant === "underline" && "rounded-none",
						)}
					/>
				))}
			</div>

			{/* Tab content */}
			{showContent && (
				<div className="p-4 space-y-3">
					{Array.from({ length: contentRows }).map((_, i) => (
						<Skeleton
							key={`content-${i}`}
							className="h-4"
							style={{
								width:
									i === contentRows - 1
										? "50%"
										: i === contentRows - 2
											? "75%"
											: "100%",
							}}
						/>
					))}
				</div>
			)}
		</section>
	);
}
