import * as React from "react";
import { cn } from "../../lib/utils";

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Active item index */
	active?: number;
	/** Bullet size in px */
	bulletSize?: number;
	/** Line width in px */
	lineWidth?: number;
	/** Reverse active direction */
	reverseActive?: boolean;
	/** Color of the active items (class name) */
	activeClass?: string;
	/** Align items */
	align?: "right" | "left";
}

export interface TimelineItemProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	/** Bullet content */
	bullet?: React.ReactNode;
	/** Item title */
	title?: React.ReactNode;
	/** Line variant */
	lineVariant?: "solid" | "dashed" | "dotted";
	/** Internal prop: index */
	__index?: number;
	/** Internal prop: active state */
	__active?: boolean;
	/** Internal prop: line active state */
	__lineActive?: boolean;
	/** Internal prop: bullet size */
	__bulletSize?: number;
	/** Internal prop: line width */
	__lineWidth?: number;
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
	(
		{
			className,
			bullet,
			title,
			children,
			lineVariant = "solid",
			__index,
			__active,
			__lineActive,
			__bulletSize = 20,
			__lineWidth = 4,
			...props
		},
		ref,
	) => {
		return (
			<div
				ref={ref}
				className={cn("relative pl-8 pb-8 last:pb-0", className)}
				style={{ paddingLeft: __bulletSize + 12 }}
				{...props}
			>
				{/* Line */}
				<div
					className={cn(
						"absolute top-0 bottom-0 border-l border-muted transition-colors",
						__lineActive && "border-primary",
						lineVariant === "dashed" && "border-dashed",
						lineVariant === "dotted" && "border-dotted",
					)}
					style={{
						left: (__bulletSize - __lineWidth) / 2,
						width: __lineWidth,
						borderLeftWidth: __lineWidth,
					}}
				/>

				{/* Bullet */}
				<div
					className={cn(
						"absolute top-0 flex items-center justify-center rounded-full border bg-background text-xs font-medium transition-colors",
						__active
							? "border-primary bg-primary text-primary-foreground"
							: "border-muted text-muted-foreground",
					)}
					style={{
						width: __bulletSize,
						height: __bulletSize,
						left: 0,
						borderWidth: __lineWidth / 2,
					}}
				>
					{bullet}
				</div>

				{/* Content */}
				<div className="flex flex-col -mt-1">
					{title && <div className="font-semibold text-sm mb-1">{title}</div>}
					<div className="text-muted-foreground text-sm">{children}</div>
				</div>
			</div>
		);
	},
);

TimelineItem.displayName = "TimelineItem";

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
	(
		{
			className,
			children,
			active = -1,
			reverseActive = false,
			bulletSize = 20,
			lineWidth = 4,
			...props
		},
		ref,
	) => {
		const items = React.Children.toArray(children);

		return (
			<div ref={ref} className={cn("flex flex-col", className)} {...props}>
				{items.map((item, index) => {
					if (React.isValidElement(item)) {
						return React.cloneElement(
							item as React.ReactElement<TimelineItemProps>,
							{
								__index: index,
								__active:
									active >= index ||
									(reverseActive && active >= items.length - 1 - index),
								__lineActive:
									active > index ||
									(reverseActive && active > items.length - 1 - index),
								__bulletSize: bulletSize,
								__lineWidth: lineWidth,
							},
						);
					}
					return item;
				})}
			</div>
		);
	},
);

Timeline.displayName = "Timeline";
