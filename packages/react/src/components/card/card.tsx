import type * as React from "react";
import { cardStyles } from "../../config/card";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Heading } from "../heading";
import { useSlotStyles } from "../kala-provider";
import type { CardSkeletonConfig } from "../skeleton/skeleton.types";
import { Text } from "../text";
import { CardSkeleton } from "./card-skeleton";

export interface CardProps extends React.ComponentProps<"div"> {
	isLoading?: boolean;
	skeletonConfig?: CardSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props, in every render arm. */
	slotStyles?: SlotStyles;
}

function Card({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	isLoading = false,
	skeletonConfig,
	skeleton,
	children,
	...props
}: CardProps) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(cn(cardStyles.base, className), slotStyles?.root);
	const rootStyle = mergeStyle(style, root.style);
	if (isLoading) {
		if (skeleton) {
			return (
				<Box
					data-kala-component="card"
					ref={ref}
					style={rootStyle}
					className={root.className}
				>
					{skeleton}
				</Box>
			);
		}
		return <CardSkeleton data-kala-component="card" {...skeletonConfig} />;
	}

	return (
		<Box
			data-kala-component="card"
			ref={ref}
			className={root.className}
			style={rootStyle}
			{...props}
		>
			{children}
		</Box>
	);
}

function CardHeader({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(cn(cardStyles.header, className), slotStyles?.root);
	return (
		<Box
			data-kala-component="card-header"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function CardTitle({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.HTMLAttributes<HTMLHeadingElement> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(cn(cardStyles.title, className), slotStyles?.root);
	return (
		<Heading
			data-kala-component="card-title"
			as="h5"
			size="h6"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function CardSubtitle({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.HTMLAttributes<HTMLHeadingElement> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(cn(cardStyles.subtitle, className), slotStyles?.root);
	return (
		<Heading
			data-kala-component="card-subtitle"
			as="h6"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function CardDescription({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: Omit<React.ComponentProps<"p">, "color"> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(
		cn(cardStyles.description, className),
		slotStyles?.root,
	);
	return (
		<Text
			data-kala-component="card-description"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function CardAction({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(cn("ml-auto", className), slotStyles?.root);
	return (
		<Box
			data-kala-component="card-action"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function CardContent({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(cn(cardStyles.content, className), slotStyles?.root);
	return (
		<Box
			data-kala-component="card-content"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function CardFooter({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("card", slotStylesRaw);
	const root = applySlot(cn(cardStyles.footer, className), slotStyles?.root);
	return (
		<Box
			data-kala-component="card-footer"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
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
		<Box
			data-kala-component="card-image"
			as="img"
			alt={alt}
			className={cn(cardStyles.image, className)}
			{...props}
		/>
	);
}

function CardImageOverlay({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<Box
			data-kala-component="card-image-overlay"
			className={cn(cardStyles.overlay, className)}
			{...props}
		/>
	);
}

export interface CardMarkerProps extends React.ComponentProps<"div"> {
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
	 * Semantic color ('muted' renders the old dark chip)
	 * @default 'muted'
	 */
	color?:
		| "primary"
		| "secondary"
		| "destructive"
		| "success"
		| "warning"
		| "info"
		| "muted";
}

function CardMarker({
	className,
	position = "top-left",
	variant = "default",
	color = "muted",
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
		primary: "bg-primary text-primary-foreground",
		secondary: "bg-secondary text-secondary-foreground",
		destructive: "bg-destructive text-destructive-foreground",
		success: "bg-success text-success-foreground",
		warning: "bg-warning text-warning-foreground",
		info: "bg-info text-info-foreground",
		muted: "bg-foreground text-background",
	};

	// Base marker styles
	if (variant === "default") {
		return (
			<Box
				data-kala-component="card-marker"
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
				data-kala-component="card-marker"
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
				data-kala-component="card-marker"
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
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardImage,
	CardImageOverlay,
	CardMarker,
	CardSubtitle,
	CardTitle,
};
