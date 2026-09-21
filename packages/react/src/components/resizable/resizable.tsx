"use client";

import * as ResizablePrimitive from "react-resizable-panels";

import { resizableStyles } from "../../config/resizable";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type {
	ResizableHandleProps,
	ResizablePanelGroupProps,
	ResizablePanelProps,
} from "./resizable.types";

const ResizablePanelGroup = ({
	className,
	style,
	slotStyles,
	orientation = "horizontal",
	...props
}: ResizablePanelGroupProps) => {
	const root = applySlot(
		cn("group flex h-full w-full", className),
		slotStyles?.root,
	);
	return (
		<ResizablePrimitive.Group
			data-kala-component="resizable-panel-group"
			data-slot="resizable-panel-group"
			data-orientation={orientation}
			className={root.className}
			style={mergeStyle(style, root.style)}
			orientation={orientation}
			{...props}
		/>
	);
};

const ResizablePanel = ({
	className,
	style,
	slotStyles,
	...props
}: ResizablePanelProps) => {
	const root = applySlot(cn("relative", className), slotStyles?.root);
	return (
		<ResizablePrimitive.Panel
			data-kala-component="resizable-panel"
			data-slot="resizable-panel"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
};

const ResizableHandle = ({
	withHandle,
	className,
	style,
	slotStyles,
	...props
}: ResizableHandleProps) => {
	const root = applySlot(
		cn(
			"bg-separator relative flex items-center justify-center kala-focus-ring",
			"after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
			"group-data-[orientation=vertical]:h-px group-data-[orientation=vertical]:w-full group-data-[orientation=vertical]:after:left-0 group-data-[orientation=vertical]:after:h-1 group-data-[orientation=vertical]:after:w-full group-data-[orientation=vertical]:after:-translate-y-1/2 group-data-[orientation=vertical]:after:translate-x-0",
			"group-data-[orientation=horizontal]:w-px group-data-[orientation=horizontal]:after:h-full",
			"transition-colors hover:bg-primary/50",
			"data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-separator",
			className,
		),
		slotStyles?.root,
	);
	const handle = applySlot(resizableStyles.handle, slotStyles?.handle);
	return (
		<ResizablePrimitive.Separator
			data-kala-component="resizable-handle"
			data-slot="resizable-handle"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{withHandle && (
				<div className={handle.className} style={handle.style}>
					<svg
						className={cn(
							"text-muted-foreground size-2.5",
							"group-data-[orientation=vertical]:rotate-90",
						)}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<title>Resize handle</title>
						<circle cx="9" cy="12" r="1" />
						<circle cx="15" cy="12" r="1" />
					</svg>
				</div>
			)}
		</ResizablePrimitive.Separator>
	);
};

// Re-export types from react-resizable-panels for convenience
export type {
	GroupImperativeHandle,
	GroupProps,
	PanelImperativeHandle,
	PanelProps,
	SeparatorProps,
} from "react-resizable-panels";
export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
