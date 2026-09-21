"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type * as React from "react";

import { cn } from "../../lib/utils";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { Box } from "../box";
import { buttonVariants } from "../button";
import { Text } from "../text";
import type {
	AlertDialogActionProps,
	AlertDialogContentProps,
	AlertDialogProps,
} from "./alert-dialog.types";

function AlertDialog({ ...props }: AlertDialogProps) {
	return (
		<AlertDialogPrimitive.Root
			data-kala-component="alert-dialog"
			data-slot="alert-dialog"
			{...props}
		/>
	);
}

function AlertDialogTrigger({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return (
		<AlertDialogPrimitive.Trigger
			data-kala-component="alert-dialog-trigger"
			data-slot="alert-dialog-trigger"
			{...props}
		/>
	);
}

function AlertDialogPortal({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
	return <AlertDialogPrimitive.Portal {...props} />;
}

function AlertDialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
	return (
		<AlertDialogPrimitive.Overlay
			data-kala-component="alert-dialog-overlay"
			data-slot="alert-dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-30 bg-overlay backdrop-blur-sm",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogContent({
	className,
	style,
	slotStyles,
	...props
}: AlertDialogContentProps) {
	const root = applySlot(
		cn(
			"bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-30 flex flex-col translate-x-[-50%] translate-y-[-50%] rounded-lg border duration-200 w-[90vw] max-w-lg kala-surface-card",
			className,
		),
		slotStyles?.root,
	);
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-kala-component="alert-dialog-content"
				data-slot="alert-dialog-content"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</AlertDialogPortal>
	);
}

function AlertDialogHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<Box
			data-kala-component="alert-dialog-header"
			data-slot="alert-dialog-header"
			className={cn("flex flex-col gap-1.5 px-6 py-4 border-b", className)}
			{...props}
		/>
	);
}

function AlertDialogFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<Box
			data-kala-component="alert-dialog-footer"
			data-slot="alert-dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 py-4 border-t bg-muted/50 rounded-b-lg",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			data-kala-component="alert-dialog-title"
			data-slot="alert-dialog-title"
			className={cn(
				"text-lg font-semibold leading-none tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: Omit<
	React.ComponentProps<typeof AlertDialogPrimitive.Description>,
	"color"
>) {
	return (
		<AlertDialogPrimitive.Description
			data-kala-component="alert-dialog-description"
			asChild
			data-slot="alert-dialog-description"
		>
			<Text
				className={cn(
					"text-sm leading-relaxed text-muted-foreground",
					className,
				)}
				{...props}
			/>
		</AlertDialogPrimitive.Description>
	);
}

function AlertDialogBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Box
			data-kala-component="alert-dialog-body"
			data-slot="alert-dialog-body"
			className={cn("flex-1 overflow-y-auto px-6 py-4 min-h-0", className)}
			{...props}
		/>
	);
}

function AlertDialogAction({
	className,
	variant,
	size,
	...props
}: AlertDialogActionProps) {
	return (
		<AlertDialogPrimitive.Action
			data-kala-component="alert-dialog-action"
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function AlertDialogCancel({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
	return (
		<AlertDialogPrimitive.Cancel
			data-kala-component="alert-dialog-cancel"
			className={cn(buttonVariants({ variant: "outline" }), className)}
			{...props}
		/>
	);
}

export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogBody,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
	AlertDialogTrigger,
};
