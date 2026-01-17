import * as React from "react";
import { cardStyles } from "../../config/card";
import { cn } from "../../lib/utils";
import type { CardSkeletonConfig } from "../skeleton/skeleton.types";
import { CardSkeleton } from "./card-skeleton";
import { Box } from "../box";
import { Heading } from "../heading";
import { Text } from "../text";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	isLoading?: boolean;
	skeletonConfig?: CardSkeletonConfig;
	skeleton?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	(
		{
			className,
			isLoading = false,
			skeletonConfig,
			skeleton,
			children,
			...props
		},
		ref,
	) => {
		if (isLoading) {
			if (skeleton) {
				return (
					<Box ref={ref} className={cn(cardStyles.base, className)}>
						{skeleton}
					</Box>
				);
			}
			return <CardSkeleton {...skeletonConfig} />;
		}

		return (
			<Box ref={ref} className={cn(cardStyles.base, className)} {...props}>
				{children}
			</Box>
		);
	},
);

Card.displayName = "Card";

function CardHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <Box className={cn(cardStyles.header, className)} {...props} />;
}

function CardTitle({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return <Heading as="h5" className={cn(cardStyles.title, className)} {...props} />;
}

function CardSubtitle({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return <Heading as="h6" className={cn(cardStyles.subtitle, className)} {...props} />;
}

function CardDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return <Text className={cn(cardStyles.description, className)} {...props} />;
}

function CardAction({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <Box className={cn("ml-auto", className)} {...props} />;
}

function CardContent({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <Box className={cn(cardStyles.content, className)} {...props} />;
}

function CardFooter({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <Box className={cn(cardStyles.footer, className)} {...props} />;
}

function CardImage({
	className,
	alt = "",
	...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
	if (!alt) {
		console.warn(
			"CardImage: Missing alt text. Images should have descriptive alt text for accessibility.",
		);
	}
	return (
		<Box as="img" alt={alt} className={cn(cardStyles.image, className)} {...props} />
	);
}

function CardImageOverlay({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <Box className={cn(cardStyles.overlay, className)} {...props} />;
}

export interface CardMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Position of the marker
	 * @default 'top-left'
	 */
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	/**
	 * Visual variant
	 * @default 'default'
	 */
	variant?: "default" | "icon" | "ribbon";
	/**
	 * Color scheme
	 * @default 'default'
	 */
	color?: "default" | "primary" | "success" | "warning" | "danger" | "info";
}

function CardMarker({
	className,
	position = "top-left",
	variant = "default",
	color = "default",
	children,
	...props
}: CardMarkerProps) {
	const positionClasses = {
		"top-left": "top-2 left-2",
		"top-right": "top-2 right-2",
		"bottom-left": "bottom-2 left-2",
		"bottom-right": "bottom-2 right-2",
	};

	const colorClasses = {
		default: "bg-foreground text-background",
		primary: "bg-primary text-primary-foreground",
		success: "bg-success text-success-foreground",
		warning: "bg-warning text-warning-foreground",
		danger: "bg-destructive text-destructive-foreground",
		info: "bg-info text-info-foreground",
	};

	// Base marker styles
	if (variant === "default") {
		return (
			<Box
				className={cn(
					"absolute z-10 rounded px-2 py-1 text-xs font-semibold shadow-sm",
					positionClasses[position],
					colorClasses[color],
					className,
				)}
				{...props}
			>
				{children}
			</Box>
		);
	}

	// Icon marker - larger, rounded, typically just an icon
	if (variant === "icon") {
		return (
			<Box
				className={cn(
					"absolute z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-lg",
					position === "top-left" && "top-2 left-2",
					position === "top-right" && "top-2 right-2",
					position === "bottom-left" && "bottom-2 left-2",
					position === "bottom-right" && "bottom-2 right-2",
					colorClasses[color],
					className,
				)}
				{...props}
			>
				{children}
			</Box>
		);
	}

	// Ribbon marker - diagonal corner ribbon
	if (variant === "ribbon") {
		const ribbonPosition = position.startsWith("top") ? "top" : "bottom";
		const ribbonSide = position.endsWith("left") ? "left" : "right";

		return (
			<Box
				className={cn(
					"absolute z-10 px-8 py-1 text-xs font-semibold shadow-lg",
					ribbonPosition === "top" &&
					ribbonSide === "left" &&
					"top-3 -left-8 -rotate-45 origin-top-left",
					ribbonPosition === "top" &&
					ribbonSide === "right" &&
					"top-3 -right-8 rotate-45 origin-top-right",
					ribbonPosition === "bottom" &&
					ribbonSide === "left" &&
					"bottom-3 -left-8 rotate-45 origin-bottom-left",
					ribbonPosition === "bottom" &&
					ribbonSide === "right" &&
					"bottom-3 -right-8 -rotate-45 origin-bottom-right",
					colorClasses[color],
					className,
				)}
				{...props}
			>
				{children}
			</Box>
		);
	}

	return null;
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardSubtitle,
	CardDescription,
	CardAction,
	CardContent,
	CardImage,
	CardImageOverlay,
	CardMarker,
};
