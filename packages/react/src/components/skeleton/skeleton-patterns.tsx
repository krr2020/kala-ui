/**
 * Skeleton Patterns Library
 *
 * Reusable skeleton patterns for common UI elements.
 * These provide consistent and composable skeleton building blocks.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "./skeleton";

/**
 * Text lines skeleton pattern
 */
export interface SkeletonTextProps {
	/**
	 * Number of lines to display
	 */
	lines?: number;
	/**
	 * Width of the last line (percentage or fixed value)
	 */
	lastLineWidth?: string;
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Text skeleton pattern with configurable lines
 */
export function SkeletonText({
	lines = 3,
	lastLineWidth = "75%",
	className,
}: SkeletonTextProps) {
	const lineElements = Array.from({ length: lines }, (_, index) => ({
		id: `skeleton-text-line-${index}`,
		isLast: index === lines - 1,
	}));

	return (
		<div className={cn("space-y-2", className)}>
			{lineElements.map((line) => (
				<Skeleton
					key={line.id}
					data-testid={line.id}
					className="h-4"
					style={{ width: line.isLast ? lastLineWidth : "100%" }}
				/>
			))}
		</div>
	);
}

/**
 * Circle skeleton pattern
 */
export interface SkeletonCircleProps {
	/**
	 * Size of the circle (can be Tailwind class or inline style)
	 */
	size?: string;
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Circular skeleton pattern (for avatars, icons, etc.)
 */
export function SkeletonCircle({
	size = "3rem",
	className,
}: SkeletonCircleProps) {
	return (
		<Skeleton
			className={cn("rounded-full", className)}
			style={{ width: size, height: size }}
		/>
	);
}

/**
 * Rectangle skeleton pattern
 */
export interface SkeletonRectangleProps {
	/**
	 * Width of the rectangle
	 */
	width?: string;
	/**
	 * Height of the rectangle
	 */
	height?: string;
	/**
	 * Additional className
	 */
	className?: string;
	/**
	 * Border radius (default: md)
	 */
	rounded?: "none" | "sm" | "md" | "lg" | "full";
}

/**
 * Rectangular skeleton pattern (for images, cards, etc.)
 */
export function SkeletonRectangle({
	width = "100%",
	height = "100%",
	className,
	rounded = "md",
}: SkeletonRectangleProps) {
	const roundedClass = {
		none: "rounded-none",
		sm: "rounded-sm",
		md: "rounded-md",
		lg: "rounded-lg",
		full: "rounded-full",
	};

	return (
		<Skeleton
			className={cn(roundedClass[rounded], className)}
			style={{ width, height }}
		/>
	);
}

/**
 * Avatar skeleton pattern
 */
export interface SkeletonAvatarProps {
	/**
	 * Size variant for the avatar
	 */
	size?: "sm" | "md" | "lg";
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Avatar skeleton pattern with standard sizes
 */
export function SkeletonAvatar({
	size = "md",
	className,
}: SkeletonAvatarProps) {
	const sizes = {
		sm: "2rem",
		md: "3rem",
		lg: "4rem",
	};

	return <SkeletonCircle size={sizes[size]} className={className} />;
}

/**
 * Paragraph skeleton pattern
 */
export interface SkeletonParagraphProps {
	/**
	 * Number of paragraphs
	 */
	paragraphs?: number;
	/**
	 * Lines per paragraph (default: varies by paragraph index)
	 */
	lines?: number[];
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Multi-paragraph skeleton pattern
 */
export function SkeletonParagraph({
	paragraphs = 2,
	lines,
	className,
}: SkeletonParagraphProps) {
	// If lines array is provided, use its length as paragraph count
	const effectiveParagraphs = lines ? lines.length : paragraphs;
	
	return (
		<div className={cn("space-y-4", className)}>
			{Array.from({ length: effectiveParagraphs }).map((_, paragraphIndex) => {
				// Default to 4 lines for first paragraph, 3 for others
				const paragraphLines =
					lines?.[paragraphIndex] ?? (paragraphIndex === 0 ? 4 : 3);
				const lineWidths = ["100%", "100%", "85%", "70%", "60%", "50%"];

				return (
					<div key={paragraphIndex} className="space-y-2">
						{Array.from({ length: paragraphLines }).map((_, lineIndex) => (
							<Skeleton
								key={lineIndex}
								data-testid={`skeleton-text-line-${paragraphIndex}-${lineIndex}`}
								className="h-4"
								style={{ width: lineWidths[lineIndex % lineWidths.length] }}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
}

/**
 * Header skeleton pattern (title + subtitle)
 */
export interface SkeletonHeaderProps {
	/**
	 * Show subtitle line
	 */
	showSubtitle?: boolean;
	/**
	 * Title width (default: 60%)
	 */
	titleWidth?: string;
	/**
	 * Subtitle width (default: 40%)
	 */
	subtitleWidth?: string;
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Header skeleton pattern with title and optional subtitle
 */
export function SkeletonHeader({
	showSubtitle = true,
	titleWidth = "60%",
	subtitleWidth = "40%",
	className,
}: SkeletonHeaderProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<Skeleton
				data-testid="skeleton-text-line-0"
				className="h-6"
				style={{ width: titleWidth }}
			/>
			{showSubtitle && (
				<Skeleton
					data-testid="skeleton-text-line-1"
					className="h-4"
					style={{ width: subtitleWidth }}
				/>
			)}
		</div>
	);
}

/**
 * Button skeleton pattern
 */
export interface SkeletonButtonProps {
	/**
	 * Width of the button (default: auto)
	 */
	width?: string;
	/**
	 * Height variant for the button
	 */
	size?: "sm" | "md" | "lg";
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Button skeleton pattern with standard sizes
 */
export function SkeletonButton({
	width = "auto",
	size = "md",
	className,
}: SkeletonButtonProps) {
	const sizes = {
		sm: "h-8 px-3 text-sm",
		md: "h-10 px-4",
		lg: "h-12 px-6 text-lg",
	};

	return <Skeleton className={cn(sizes[size], className)} style={{ width }} />;
}

/**
 * Card content skeleton pattern
 */
export interface SkeletonCardContentProps {
	/**
	 * Show header skeleton
	 */
	showHeader?: boolean;
	/**
	 * Number of content lines
	 */
	contentLines?: number;
	/**
	 * Show footer skeleton
	 */
	showFooter?: boolean;
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Card content skeleton pattern with header, content, and footer
 */
export function SkeletonCardContent({
	showHeader = true,
	contentLines = 3,
	showFooter = true,
	className,
}: SkeletonCardContentProps) {
	return (
		<div className={cn("space-y-4", className)}>
			{showHeader && <SkeletonHeader showSubtitle />}
			<SkeletonText lines={contentLines} />
			{showFooter && (
				<div className="flex justify-end gap-2 pt-2">
					<SkeletonButton width="4rem" size="sm" />
					<SkeletonButton width="4rem" size="sm" />
				</div>
			)}
		</div>
	);
}
