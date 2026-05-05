"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Text } from "../text";

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-30 bg-black/50 backdrop-blur-sm",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	size = "default",
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean;
	size?: "sm" | "default" | "lg" | "xl";
}) {
	const sizeClasses = {
		sm: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-sm sm:max-h-[90vh] sm:rounded-lg sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
		default: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-lg sm:max-h-[90vh] sm:rounded-lg sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
		lg: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-2xl sm:max-h-[90vh] sm:rounded-lg sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
		xl: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-4xl sm:max-h-[90vh] sm:rounded-lg sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
	};

	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					"bg-card text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed inset-0 z-30 flex flex-col w-full h-full max-h-none translate-x-0 translate-y-0 rounded-none border duration-200 theme-card",
					sizeClasses[size],
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className={cn(
							"absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none p-1 hover:bg-accent",
							"focus-ring",
						)}
					>
						<X className="size-5" aria-hidden="true" />
						<Text as="span" className="sr-only">
							Close
						</Text>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({
	className,
	fixed = true,
	...props
}: React.ComponentProps<"div"> & {
	/** When true (default), header stays fixed at the top of the modal. Set to false to allow header to scroll with content. */
	fixed?: boolean;
}) {
	return (
		<Box
			data-slot="dialog-header"
			className={cn(
				"flex flex-col gap-1.5 px-6 py-4 border-b",
				fixed && "shrink-0",
				className,
			)}
			{...props}
		/>
	);
}

function DialogFooter({
	className,
	fixed = false,
	...props
}: React.ComponentProps<"div"> & {
	/** When true, footer stays fixed at the bottom of the modal (content scrolls between header and footer) */
	fixed?: boolean;
}) {
	return (
		<Box
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 py-4 border-t bg-muted/50 rounded-b-lg",
				fixed && "shrink-0",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	translationKey,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
	/** Optional translation key for title text */
	translationKey?: string;
}) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn(
				"text-lg font-semibold leading-none tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	descriptionKey,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & {
	/** Optional translation key for description text */
	descriptionKey?: string;
}) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-sm leading-relaxed text-muted-foreground", className)}
			{...props}
		/>
	);
}
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Box
			data-slot="dialog-body"
			className={cn("flex-auto overflow-y-auto px-6 py-4 min-h-0", className)}
			{...props}
		/>
	);
}
export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogBody,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
