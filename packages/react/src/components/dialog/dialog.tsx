"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type * as React from "react";
import { dialogStyles } from "../../config/dialog";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Text } from "../text";
import type { DialogContentProps } from "./dialog.types";

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return (
		<DialogPrimitive.Root
			data-kala-component="dialog"
			data-slot="dialog"
			{...props}
		/>
	);
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return (
		<DialogPrimitive.Trigger
			data-kala-component="dialog-trigger"
			data-slot="dialog-trigger"
			{...props}
		/>
	);
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return (
		<DialogPrimitive.Close
			data-kala-component="dialog-close"
			data-slot="dialog-close"
			{...props}
		/>
	);
}

function DialogOverlay({
	className,
	style,
	slotStyles,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay> & {
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(dialogStyles.overlay, slotStyles?.root ?? null);
	return (
		<DialogPrimitive.Overlay
			data-kala-component="dialog-overlay"
			data-slot="dialog-overlay"
			className={cn(root.className, className)}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	style,
	slotStyles,
	children,
	showCloseButton = true,
	size = "md",
	closeLabel = "Close",
	...props
}: DialogContentProps) {
	const root = applySlot(
		cn(dialogStyles.content, dialogStyles.sizes[size], className),
		slotStyles?.root,
	);
	const close = applySlot(
		cn(dialogStyles.close, "kala-focus-ring"),
		slotStyles?.close,
	);
	const closeIcon = applySlot(dialogStyles.closeIcon, slotStyles?.closeIcon);

	return (
		<DialogPortal>
			<DialogOverlay slotStyles={{ root: slotStyles?.overlay }} />
			<DialogPrimitive.Content
				data-kala-component="dialog-content"
				data-slot="dialog-content"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className={close.className}
						style={close.style}
					>
						<X
							className={closeIcon.className}
							style={closeIcon.style}
							aria-hidden="true"
						/>
						<Text as="span" className="sr-only">
							{closeLabel}
						</Text>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({
	className,
	style,
	slotStyles,
	fixed = true,
	...props
}: React.ComponentProps<"div"> & {
	/** When true (default), header stays fixed at the top of the modal. Set to false to allow header to scroll with content. */
	fixed?: boolean;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(
		cn(dialogStyles.header, fixed && "shrink-0", className),
		slotStyles?.root,
	);
	return (
		<Box
			data-kala-component="dialog-header"
			data-slot="dialog-header"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function DialogFooter({
	className,
	style,
	slotStyles,
	fixed = false,
	...props
}: React.ComponentProps<"div"> & {
	/** When true, footer stays fixed at the bottom of the modal (content scrolls between header and footer) */
	fixed?: boolean;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(
		cn(dialogStyles.footer, fixed && "shrink-0", className),
		slotStyles?.root,
	);
	return (
		<Box
			data-kala-component="dialog-footer"
			data-slot="dialog-footer"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	style,
	slotStyles,
	translationKey,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
	/** Optional translation key for title text */
	translationKey?: string;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(cn(dialogStyles.title, className), slotStyles?.root);
	return (
		<DialogPrimitive.Title
			data-kala-component="dialog-title"
			data-slot="dialog-title"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	style,
	slotStyles,
	descriptionKey,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & {
	/** Optional translation key for description text */
	descriptionKey?: string;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(
		cn(dialogStyles.description, className),
		slotStyles?.root,
	);
	return (
		<DialogPrimitive.Description
			data-kala-component="dialog-description"
			data-slot="dialog-description"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}
function DialogBody({
	className,
	style,
	slotStyles,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const root = applySlot(cn(dialogStyles.body, className), slotStyles?.root);
	return (
		<Box
			data-kala-component="dialog-body"
			data-slot="dialog-body"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
