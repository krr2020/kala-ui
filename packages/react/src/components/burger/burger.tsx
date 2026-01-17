import * as React from "react";
import { cn } from "../../lib/utils";

export interface BurgerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** State of the burger */
	opened?: boolean;
	/** Size of the burger */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Burger = React.forwardRef<HTMLButtonElement, BurgerProps>(
	({ className, opened, size = "md", ...props }, ref) => {
		const sizeClasses = {
			xs: "h-3 w-4",
			sm: "h-4 w-5",
			md: "h-5 w-6",
			lg: "h-6 w-8",
			xl: "h-8 w-10",
		};

		const lineSizeClasses = {
			xs: "h-0.5",
			sm: "h-0.5",
			md: "h-0.5",
			lg: "h-1",
			xl: "h-1",
		};

		return (
			<button
				ref={ref}
				type="button"
				className={cn(
					"relative flex flex-col justify-between cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					sizeClasses[size],
					className,
				)}
				aria-label={opened ? "Close navigation" : "Open navigation"}
				aria-expanded={opened}
				{...props}
			>
				<div
					className={cn(
						"bg-foreground w-full rounded transition-transform origin-top-left",
						lineSizeClasses[size],
						opened && "translate-x-[3px] rotate-45",
					)}
				/>
				<div
					className={cn(
						"bg-foreground w-full rounded transition-opacity",
						lineSizeClasses[size],
						opened && "opacity-0",
					)}
				/>
				<div
					className={cn(
						"bg-foreground w-full rounded transition-transform origin-bottom-left",
						lineSizeClasses[size],
						opened && "translate-x-[3px] -rotate-45",
					)}
				/>
			</button>
		);
	},
);

Burger.displayName = "Burger";
