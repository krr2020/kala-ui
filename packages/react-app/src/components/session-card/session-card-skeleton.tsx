/**
 * Session Card Skeleton Component
 *
 * Loading placeholder for the Session Card component.
 * Provides zero-CLS skeleton state that matches actual session card layout.
 */

import { Card, CardContent, CardHeader } from "@kala-ui/react/card";
import { cn } from "@kala-ui/react/lib/utils";
import {
	sessionCardSkeletonStyles,
	sessionCardStyles,
} from "../../config/session-card";
import type { SessionCardSkeletonConfig } from "@kala-ui/react/skeleton";
import { Skeleton, SkeletonCircle } from "@kala-ui/react/skeleton";

export interface SessionCardSkeletonProps extends SessionCardSkeletonConfig {
	/**
	 * Additional className for the skeleton container
	 */
	className?: string;
	/**
	 * Test ID for querying the element
	 */
	"data-testid"?: string;
	[dataKala: `data-${string}`]: string | undefined;
	style?: React.CSSProperties;
}

/**
 * Session Card skeleton component
 *
 * @example
 * ```tsx
 * <SessionCardSkeleton />
 *
 * <SessionCardSkeleton showBadge={true} />
 * ```
 */
export function SessionCardSkeleton({
	showBadge = false,
	showRevokeButton = true,
	className,
	"data-testid": dataTestId,
	style,
	...markerProps
}: SessionCardSkeletonProps) {
	return (
		<Card
			data-kala-component="session-card-skeleton"
			data-testid={dataTestId || "session-card-skeleton"}
			className={cn(sessionCardSkeletonStyles.root, className)}
			style={style}
			{...(markerProps as Record<string, string>)}
		>
			<CardHeader className={sessionCardStyles.header}>
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-3 flex-1">
						<SkeletonCircle size="1.5rem" className="rounded-md" />
						<div className="flex-1 min-w-0">
							<Skeleton className="h-4 w-32 mb-1" />
							<Skeleton className="h-3 w-48" />
						</div>
					</div>
					{showBadge ? (
						<Skeleton className="h-5 w-24 rounded-md" />
					) : (
						showRevokeButton && <Skeleton className="h-8 w-16 rounded-md" />
					)}
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-1.5">
					<Skeleton className="h-4 w-48" />
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-4 w-56" />
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Compound component: SessionCard.Skeleton
 */
SessionCardSkeleton.Skeleton = SessionCardSkeleton;
