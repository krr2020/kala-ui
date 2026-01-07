"use client";

import type * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../../lib/utils";

const ResizablePanelGroup = ({
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
	<ResizablePrimitive.PanelGroup
		data-slot="resizable-panel-group"
		className={cn(
			"flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
			className,
		)}
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
	extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
	withHandle?: boolean;
}

const ResizableHandle = ({
	withHandle,
	className,
	...props
}: ResizableHandleProps) => (
	<ResizablePrimitive.PanelResizeHandle
		data-slot="resizable-handle"
		className={cn(
			"bg-separator relative flex items-center justify-center focus-ring",
			"after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
			"data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
			"data-[panel-group-direction=horizontal]:w-px data-[panel-group-direction=horizontal]:after:h-full",
			"transition-colors hover:bg-primary/50",
			"data-[resize-handle-state=drag]:bg-primary",
			"disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-separator",
			className,
		)}
		{...props}
	>
		{withHandle && (
			<div
				className={cn(
					"bg-separator z-10 flex items-center justify-center rounded-sm border transition-colors",
					"data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-8 data-[panel-group-direction=horizontal]:h-8 data-[panel-group-direction=horizontal]:w-2",
					"hover:bg-primary/50 data-[resize-handle-state=drag]:bg-primary",
				)}
			>
				<svg
					className={cn(
						"text-muted-foreground size-2.5",
						"data-[panel-group-direction=vertical]:rotate-90",
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
	</ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
export type { ResizableHandleProps };

// Re-export types from react-resizable-panels for convenience
export type {
	ImperativePanelGroupHandle,
	ImperativePanelHandle,
	PanelGroupProps,
	PanelProps,
	PanelResizeHandleProps,
} from "react-resizable-panels";
