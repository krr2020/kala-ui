"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

type TimelineStatus = "default" | "success" | "error" | "warning" | "pending";

interface TimelineItemProps {
	title?: React.ReactNode;
	description?: React.ReactNode;
	timestamp?: React.ReactNode;
	icon?: React.ReactNode;
	status?: TimelineStatus;
	isLast?: boolean;
	className?: string;
}

const statusIconStyles: Record<TimelineStatus, string> = {
	default: "bg-primary text-primary-foreground",
	success: "bg-success text-success-foreground",
	error: "bg-destructive text-destructive-foreground",
	warning: "bg-warning text-warning-foreground",
	pending: "bg-muted text-muted-foreground border-2 border-muted-foreground",
};

function TimelineItem({
	title,
	description,
	timestamp,
	icon,
	status = "default",
	isLast = false,
	className,
}: TimelineItemProps) {
	return (
		<div data-slot="timeline-item" className={cn("flex gap-4", className)}>
			{/* Connector column */}
			<div className="flex flex-col items-center">
				<div
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-full z-10",
						statusIconStyles[status],
						"[&_svg]:size-4 [&_svg]:shrink-0",
					)}
				>
					{icon ?? (
						<span
							className={cn(
								"size-2 rounded-full",
								status === "pending" ? "bg-muted-foreground" : "bg-current",
							)}
						/>
					)}
				</div>
				{!isLast && (
					<div className="w-px flex-1 mt-1 bg-border min-h-[1.5rem]" />
				)}
			</div>

			{/* Content column */}
			<div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0")}>
				<div className="flex items-start justify-between gap-2">
					{title && (
						<p className="text-sm font-medium leading-none text-foreground">
							{title}
						</p>
					)}
					{timestamp && (
						<span className="text-xs text-muted-foreground shrink-0">
							{timestamp}
						</span>
					)}
				</div>
				{description && (
					<p className="mt-1 text-sm text-muted-foreground">{description}</p>
				)}
			</div>
		</div>
	);
}

interface TimelineProps extends React.ComponentProps<"div"> {
	children: React.ReactNode;
}

function Timeline({ className, children, ...props }: TimelineProps) {
	const items = React.Children.toArray(children);

	return (
		<div
			data-slot="timeline"
			className={cn("flex flex-col", className)}
			{...props}
		>
			{React.Children.map(items, (child, index) => {
				if (!React.isValidElement(child)) return child;
				return React.cloneElement(
					child as React.ReactElement<TimelineItemProps>,
					{ isLast: index === items.length - 1 },
				);
			})}
		</div>
	);
}

export { Timeline, TimelineItem };
export type { TimelineItemProps, TimelineStatus };
