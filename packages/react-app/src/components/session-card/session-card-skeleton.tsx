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
				<div className={sessionCardSkeletonStyles.headerRow}>
					<div className={sessionCardSkeletonStyles.headerMain}>
						<SkeletonCircle
							size="1.5rem"
							className={sessionCardSkeletonStyles.deviceIcon}
						/>
						<div className={sessionCardSkeletonStyles.titleBlock}>
							<Skeleton
								className={sessionCardSkeletonStyles.titleSkeleton}
							/>
							<Skeleton
								className={sessionCardSkeletonStyles.subtitleSkeleton}
							/>
						</div>
					</div>
					{showBadge ? (
						<Skeleton
							className={sessionCardSkeletonStyles.badgeSkeleton}
						/>
					) : (
						showRevokeButton && (
							<Skeleton
								className={sessionCardSkeletonStyles.revokeSkeleton}
							/>
						)
					)}
				</div>
			</CardHeader>
			<CardContent className={sessionCardStyles.content}>
				<div className={sessionCardSkeletonStyles.detailList}>
					<Skeleton className={sessionCardSkeletonStyles.detailRowMedium} />
					<Skeleton className={sessionCardSkeletonStyles.detailRowNarrow} />
					<Skeleton className={sessionCardSkeletonStyles.detailRowWide} />
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Compound component: SessionCard.Skeleton
 */
SessionCardSkeleton.Skeleton = SessionCardSkeleton;
