"use client";

import { X } from "lucide-react";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { drawerStyles } from "../../config/drawer";
import type { SlotStyles } from "../../lib/slot-styles";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { useSlotStyles } from "../kala-provider";
import type {
	DrawerContentProps,
	DrawerFooterProps,
	DrawerHeaderAlign,
	DrawerHeaderProps,
} from "./drawer.types";

const DrawerContext = React.createContext<{
	direction: "top" | "bottom" | "left" | "right";
}>({
	direction: "right",
});

function Drawer({
	shouldScaleBackground = true,
	direction = "right",
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
	return (
		<DrawerContext.Provider data-kala-component="drawer" value={{ direction }}>
			<DrawerPrimitive.Root
				direction={direction}
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
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay> & {
	slotStyles?: SlotStyles;
}) {
	const slotStyles = useSlotStyles("drawer", slotStylesRaw);
	const root = applySlot(
		cn(drawerStyles.overlay, className),
		slotStyles?.overlay,
	);
	return (
		<DrawerPrimitive.Overlay
			data-kala-component="drawer-overlay"
			data-slot="drawer-overlay"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

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
		? drawerStyles.size.width[size]
		: drawerStyles.size.height[size];
	const root = applySlot(
		cn(
			drawerStyles.root,
			isHorizontal
				? drawerStyles.sides[direction]
				: drawerStyles.vertical[direction],
			sizeClass,
			className,
		),
		slotStyles?.root,
	);
	return (
		<DrawerPortal data-slot="drawer-portal">
			<DrawerOverlay slotStyles={{ overlay: slotStyles?.overlay }} />
			<DrawerPrimitive.Content
				data-kala-component="drawer-content"
				data-slot="drawer-content"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			>
				{direction === "bottom" && (
					<div
						data-kala-component="drawer-handle"
						data-slot="drawer-handle"
						className={
							applySlot(drawerStyles.handle, slotStyles?.handle).className
						}
						style={applySlot(drawerStyles.handle, slotStyles?.handle).style}
					/>
				)}
				{children}
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
}

function DrawerHeader({
	className,
	style,
	slotStyles: slotStylesRaw,
	align,
	showCloseButton = true,
	closeLabel = "Close",
	children,
	...props
}: DrawerHeaderProps) {
	const slotStyles = useSlotStyles("drawer", slotStylesRaw);
	const resolvedAlign: DrawerHeaderAlign =
		align ?? (showCloseButton ? "left" : "center");
	const header = applySlot(
		cn(drawerStyles.header, className),
		slotStyles?.header,
	);
	const close = applySlot(drawerStyles.close, slotStyles?.close);
	const closeIcon = applySlot(drawerStyles.closeIcon, slotStyles?.closeIcon);
	return (
		<div
			data-kala-component="drawer-header"
			data-slot="drawer-header"
			className={header.className}
			style={mergeStyle(style, header.style)}
			{...props}
		>
			<div
				className={cn(
					drawerStyles.headerRow,
					!showCloseButton && "grid-cols-1",
				)}
			>
				<div
					className={cn(
						drawerStyles.headerContent,
						drawerStyles.headerAlign[resolvedAlign],
					)}
				>
					{children}
				</div>
				{showCloseButton && (
					<DrawerClose asChild>
						<Button
							data-kala-component="drawer-close"
							data-slot="drawer-close"
							aria-label={closeLabel}
							variant="ghost"
							size="icon"
							className={close.className}
							style={close.style}
						>
							<X
								className={closeIcon.className}
								style={closeIcon.style}
								aria-hidden="true"
							/>
						</Button>
					</DrawerClose>
				)}
			</div>
		</div>
	);
}

function DrawerFooter({
	className,
	style,
	slotStyles: slotStylesRaw,
	sticky = true,
	...props
}: DrawerFooterProps) {
	const slotStyles = useSlotStyles("drawer", slotStylesRaw);
	const root = applySlot(
		cn(drawerStyles.footer, sticky && drawerStyles.footerSticky, className),
		slotStyles?.footer,
	);
	return (
		<div
			data-kala-component="drawer-footer"
			data-slot="drawer-footer"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function DrawerTitle({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Title> & {
	slotStyles?: SlotStyles;
}) {
	const slotStyles = useSlotStyles("drawer", slotStylesRaw);
	const root = applySlot(cn(drawerStyles.title, className), slotStyles?.title);
	return (
		<DrawerPrimitive.Title
			data-kala-component="drawer-title"
			data-slot="drawer-title"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function DrawerDescription({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Description> & {
	slotStyles?: SlotStyles;
}) {
	const slotStyles = useSlotStyles("drawer", slotStylesRaw);
	const root = applySlot(
		cn(drawerStyles.description, className),
		slotStyles?.description,
	);
	return (
		<DrawerPrimitive.Description
			data-kala-component="drawer-description"
			data-slot="drawer-description"
			className={root.className}
			style={mergeStyle(style, root.style)}
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
