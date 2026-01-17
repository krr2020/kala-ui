/**
 * File Upload Skeleton Component
 *
 * Loading placeholder for the File Upload component.
 * Matches dropzone appearance with icon, text, and button.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

export interface FileUploadSkeletonConfig {
	/**
	 * Show upload icon
	 */
	showIcon?: boolean;
	/**
	 * Show upload button
	 */
	showButton?: boolean;
}

export interface FileUploadSkeletonProps extends FileUploadSkeletonConfig {
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
 * File Upload skeleton component
 *
 * @example
 * ```tsx
 * <FileUploadSkeleton />
 *
 * <FileUploadSkeleton showIcon showButton />
 * ```
 */
export function FileUploadSkeleton({
	showIcon = true,
	showButton = true,
	className,
	"data-testid": dataTestId,
}: FileUploadSkeletonProps) {
	return (
		<div
			data-testid={dataTestId || "file-upload-skeleton"}
			className={cn(
				"border-2 border-dashed rounded-lg p-8 text-center",
				className,
			)}
		>
			{/* Icon */}
			{showIcon && <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />}

			{/* Title */}
			<Skeleton className="h-5 w-48 mx-auto mb-2" />

			{/* Description */}
			<Skeleton className="h-4 w-64 mx-auto mb-4" />

			{/* Upload button */}
			{showButton && <Skeleton className="h-10 w-32 mx-auto rounded-md" />}
		</div>
	);
}
