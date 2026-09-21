import { cn } from "../../lib/utils";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import type { BurgerProps } from "./burger.types";

export function Burger({
	ref,
	className,
	style,
	slotStyles,
	opened,
	size = "md",
	...props
}: BurgerProps) {
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
			data-kala-component="burger"
			ref={ref}
			type="button"
			className={
				applySlot(
					cn(
						"relative flex flex-col justify-between cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						sizeClasses[size],
						className,
					),
					slotStyles?.root,
				).className
			}
			style={mergeStyle(style, applySlot(null, slotStyles?.root).style)}
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
}
