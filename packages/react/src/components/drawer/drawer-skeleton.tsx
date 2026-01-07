/**
 * Drawer Skeleton Component
 *
 * Loading placeholder for the Drawer component.
 * Uses similar structure to Dialog skeleton.
 */

import { cn } from "../../lib/utils";
import {
	DialogSkeleton,
	type DialogSkeletonConfig,
} from "../dialog/dialog-skeleton";

export interface DrawerSkeletonConfig extends DialogSkeletonConfig {
	// Inherits all config from DialogSkeletonConfig
}

export interface DrawerSkeletonProps extends DrawerSkeletonConfig {
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
 * Drawer skeleton component
 *
 * Reuses the DialogSkeleton with drawer-appropriate spacing.
 *
 * @example
 * ```tsx
 * <DrawerSkeleton contentRows={4} />
 *
 * <DrawerSkeleton showHeader={false} contentRows={6} />
 * ```
 */
export function DrawerSkeleton({
	showHeader = true,
	showFooter = true,
	contentRows = 4,
	className,
	"data-testid": dataTestId,
}: DrawerSkeletonProps) {
	return (
		<DialogSkeleton
			data-testid={dataTestId || "drawer-skeleton"}
			className={cn(className)}
			showHeader={showHeader}
			showFooter={showFooter}
			contentRows={contentRows}
		/>
	);
}
