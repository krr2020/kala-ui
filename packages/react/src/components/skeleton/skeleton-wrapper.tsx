/**
 * SkeletonWrapper Component
 *
 * Provides smooth fade transition from skeleton loading state to actual content.
 * Automatically handles the transition with proper timing and reduced-motion support.
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonWrapperProps {
	/**
	 * Whether content is still loading
	 */
	isLoading: boolean;
	/**
	 * Skeleton component to show while loading
	 */
	skeleton: React.ReactNode;
	/**
	 * Actual content to show when loaded
	 */
	children: React.ReactNode;
	/**
	 * Additional className for the container
	 */
	className?: string;
	/**
	 * Transition duration in milliseconds (default: 300)
	 */
	duration?: number;
	/**
	 * Enable/disable transition (default: true)
	 */
	transition?: boolean;
}

/**
 * Component that handles smooth fade transition from skeleton to content.
 *
 * @example
 * ```tsx
 * <SkeletonWrapper
 *   isLoading={!data}
 *   skeleton={<SkeletonCard />}
 * >
 *   <DataCard data={data} />
 * </SkeletonWrapper>
 * ```
 */
export function SkeletonWrapper({
	isLoading,
	skeleton,
	children,
	className,
	duration = 300,
	transition = true,
}: SkeletonWrapperProps) {
	const [showSkeleton, setShowSkeleton] = React.useState(isLoading);

	React.useEffect(() => {
		if (!isLoading && showSkeleton && transition) {
			// Delay hiding skeleton to allow fade-out animation
			const timeout = setTimeout(() => {
				setShowSkeleton(false);
			}, duration);
			return () => clearTimeout(timeout);
		}
		if (isLoading && !showSkeleton) {
			setShowSkeleton(true);
		}
		if (!transition) {
			setShowSkeleton(isLoading);
		}
		return undefined;
	}, [isLoading, showSkeleton, duration, transition]);

	return (
		<div data-slot="skeleton-wrapper" className={cn("relative", className)}>
			{/* Skeleton layer - fades out when loading completes */}
			{showSkeleton && (
				<div
					className={cn(
						"transition-opacity ease-out",
						isLoading ? "opacity-100" : "opacity-0 animate-fade-out",
					)}
					style={
						transition ? { transitionDuration: `${duration}ms` } : undefined
					}
					aria-hidden={!isLoading}
				>
					{skeleton}
				</div>
			)}

			{/* Content layer - fades in when loading completes */}
			{!showSkeleton && (
				<div
					className="animate-fade-in transition-opacity ease-in"
					style={
						transition ? { transitionDuration: `${duration}ms` } : undefined
					}
				>
					{children}
				</div>
			)}
		</div>
	);
}
