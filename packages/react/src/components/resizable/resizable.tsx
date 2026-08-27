"use client";

import type * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../../lib/utils";

const ResizablePanelGroup = ({
	className,
	orientation = "horizontal",
	...props
}: React.ComponentProps<typeof ResizablePrimitive.Group>) => (
	<ResizablePrimitive.Group
		data-slot="resizable-panel-group"
		data-orientation={orientation}
		className={cn("group flex h-full w-full", className)}
		orientation={orientation}
		{...props}
	/>
);

const ResizablePanel = ({
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) => (
	<ResizablePrimitive.Panel
		data-slot="resizable-panel"
		className={cn("relative", className)}
		{...props}
	/>
);

interface ResizableHandleProps
	extends React.ComponentProps<typeof ResizablePrimitive.Separator> {
	withHandle?: boolean;
}

const ResizableHandle = ({
	withHandle,
	className,
	...props
}: ResizableHandleProps) => (
	<ResizablePrimitive.Separator
		data-slot="resizable-handle"
		className={cn(
			"bg-separator relative flex items-center justify-center focus-ring",
			"after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
			"group-data-[orientation=vertical]:h-px group-data-[orientation=vertical]:w-full group-data-[orientation=vertical]:after:left-0 group-data-[orientation=vertical]:after:h-1 group-data-[orientation=vertical]:after:w-full group-data-[orientation=vertical]:after:-translate-y-1/2 group-data-[orientation=vertical]:after:translate-x-0",
			"group-data-[orientation=horizontal]:w-px group-data-[orientation=horizontal]:after:h-full",
			"transition-colors hover:bg-primary/50",
			"data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-separator",
			className,
		)}
		{...props}
	>
		{withHandle && (
			<div
				className={cn(
					"bg-separator z-10 flex items-center justify-center rounded-sm border transition-colors",
					"group-data-[orientation=vertical]:h-2 group-data-[orientation=vertical]:w-8 group-data-[orientation=horizontal]:h-8 group-data-[orientation=horizontal]:w-2",
					"hover:bg-primary/50",
				)}
			>
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

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
export type { ResizableHandleProps };

// Re-export types from react-resizable-panels for convenience
export type {
	GroupImperativeHandle,
	GroupProps,
	PanelImperativeHandle,
	PanelProps,
	SeparatorProps,
} from "react-resizable-panels";
