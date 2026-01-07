"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "../../lib/utils";

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
		<DrawerContext.Provider value={direction ? { direction } : {}}>
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
	return <DrawerPrimitive.Trigger {...props} />;
}

function DrawerPortal({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
	return <DrawerPrimitive.Portal {...props} />;
}

function DrawerClose({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
	return <DrawerPrimitive.Close {...props} />;
}

function DrawerOverlay({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
	return (
		<DrawerPrimitive.Overlay
			data-slot="drawer-overlay"
			className={cn(
				"fixed inset-0 z-30 bg-black/50 backdrop-blur-sm",
				className,
			)}
			{...props}
		/>
	);
}

function DrawerContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
	const { direction } = React.useContext(DrawerContext);
	return (
		<DrawerPortal data-slot="drawer-portal">
			<DrawerOverlay />
			<DrawerPrimitive.Content
				data-slot="drawer-content"
				className={cn(
					"fixed z-30 flex h-auto flex-col bg-background theme-card",
					(!direction || direction === "bottom") &&
						"inset-x-0 bottom-0 mt-24 rounded-t-lg border-t",
					direction === "right" &&
						"inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
					direction === "left" &&
						"inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
					direction === "top" && "inset-x-0 top-0 mb-24 rounded-b-lg border-b",
					className,
				)}
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

function DrawerHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"grid gap-1.5 px-6 py-5 text-center sm:text-left",
				className,
			)}
			{...props}
		/>
	);
}

function DrawerFooter({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
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
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Drawer,
	DrawerPortal,
	DrawerOverlay,
	DrawerTrigger,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
};
