"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { DrawerContentProps } from "./drawer.types";

const DrawerContext = React.createContext<{
	direction?: "top" | "bottom" | "left" | "right";
}>({
	direction: "bottom",
});

function Drawer({
	shouldScaleBackground = true,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
	const direction = props.direction;
	return (
		<DrawerContext.Provider
			data-kala-component="drawer"
			value={direction ? { direction } : {}}
		>
			<DrawerPrimitive.Root
				shouldScaleBackground={shouldScaleBackground}
				{...props}
			/>
		</DrawerContext.Provider>
	);
}

function DrawerTrigger({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
	return (
		<DrawerPrimitive.Trigger data-kala-component="drawer-trigger" {...props} />
	);
}

function DrawerPortal({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
	return <DrawerPrimitive.Portal {...props} />;
}

function DrawerClose({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
	return (
		<DrawerPrimitive.Close data-kala-component="drawer-close" {...props} />
	);
}

function DrawerOverlay({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
	return (
		<DrawerPrimitive.Overlay
			data-kala-component="drawer-overlay"
			data-slot="drawer-overlay"
			className={cn(
				"fixed inset-0 z-30 bg-overlay backdrop-blur-sm",
				className,
			)}
			{...props}
		/>
	);
}

const SIZE_WIDTH_CLASSES: Record<
	NonNullable<DrawerContentProps["size"]>,
	string
> = {
	sm: "w-[24rem] sm:max-w-[24rem]",
	md: "w-[32rem] sm:max-w-[32rem]",
	lg: "w-[40rem] sm:max-w-[40rem]",
	xl: "w-[48rem] sm:max-w-[48rem]",
	full: "w-screen sm:max-w-none",
};

const SIZE_HEIGHT_CLASSES: Record<
	NonNullable<DrawerContentProps["size"]>,
	string
> = {
	sm: "h-[24rem] sm:max-h-[24rem]",
	md: "h-[32rem] sm:max-h-[32rem]",
	lg: "h-[40rem] sm:max-h-[40rem]",
	xl: "h-[48rem] sm:max-h-[48rem]",
	full: "h-screen sm:max-h-none",
};

function DrawerContent({
	className,
	style,
	slotStyles: slotStylesRaw,
	children,
	size = "md",
	...props
}: DrawerContentProps) {
	const slotStyles = useSlotStyles("drawer", slotStylesRaw);
	const { direction } = React.useContext(DrawerContext);
	const isHorizontal = direction === "left" || direction === "right";
	const sizeClass = isHorizontal
		? SIZE_WIDTH_CLASSES[size]
		: SIZE_HEIGHT_CLASSES[size];
	const root = applySlot(
		cn(
			"fixed z-30 flex h-auto flex-col bg-background kala-surface-card",
			(!direction || direction === "bottom") &&
				"inset-x-0 bottom-0 mt-24 rounded-t-lg border-t",
			direction === "right" && "inset-y-0 right-0 h-screen border-l",
			direction === "left" && "inset-y-0 left-0 h-screen border-r",
			direction === "top" && "inset-x-0 top-0 mb-24 rounded-b-lg border-b",
			sizeClass,
			className,
		),
		slotStyles?.root,
	);
	return (
		<DrawerPortal data-slot="drawer-portal">
			<DrawerOverlay />
			<DrawerPrimitive.Content
				data-kala-component="drawer-content"
				data-slot="drawer-content"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			>
				{(!direction || direction === "bottom") && (
					<div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted" />
				)}
				{children}
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-kala-component="drawer-header"
			className={cn(
				"grid gap-1.5 px-6 py-5 text-center sm:text-left",
				className,
			)}
			{...props}
		/>
	);
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-kala-component="drawer-footer"
			className={cn(
				"mt-auto flex flex-col gap-2 border-t px-6 py-5",
				className,
			)}
			{...props}
		/>
	);
}

function DrawerTitle({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
	return (
		<DrawerPrimitive.Title
			data-kala-component="drawer-title"
			className={cn(
				"text-lg font-semibold leading-none tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function DrawerDescription({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
	return (
		<DrawerPrimitive.Description
			data-kala-component="drawer-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
};
