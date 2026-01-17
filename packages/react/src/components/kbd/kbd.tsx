import * as React from "react";
import { cn } from "../../lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
	/** Size of the keyboard key */
	size?: "xs" | "sm" | "md" | "lg";
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
	({ className, size = "sm", ...props }, ref) => {
		const sizeClasses = {
			xs: "px-1 text-[10px] h-4 min-w-[16px]",
			sm: "px-1.5 text-xs h-5 min-w-[20px]",
			md: "px-2 text-sm h-6 min-w-[24px]",
			lg: "px-2.5 text-base h-7 min-w-[28px]",
		};

		return (
			<kbd
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center rounded border border-b-2 bg-muted font-mono font-medium text-muted-foreground",
					sizeClasses[size],
					className,
				)}
				{...props}
			/>
		);
	},
);

Kbd.displayName = "Kbd";
