import { useUncontrolled } from "@kala-ui/react-hooks";
import { motion } from "framer-motion";
import * as React from "react";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type {
	SegmentedControlItem,
	SegmentedControlProps,
} from "./segmented-control.types";

export function SegmentedControl({
	ref,
	className,
	style,
	slotStyles,
	data,
	value: valueProp,
	defaultValue,
	onValueChange,
	disabled,
	name,
	fullWidth,
	size = "sm",
	radius = "sm",
	...props
}: SegmentedControlProps) {
	const [internalValue, handleChange] = useUncontrolled<string>({
		value: valueProp,
		defaultValue:
			defaultValue ??
			(typeof data[0] === "string" ? data[0] : data[0]?.value) ??
			"",
		onChange: onValueChange,
	});

	// layoutId must be unique per instance: sharing one across unnamed
	// controls makes framer-motion treat every indicator as the same shared
	// layout element, so multiple controls on a page fight over it.
	const indicatorGroup = name ?? React.useId();

	const items = data.map((item) =>
		typeof item === "string" ? { label: item, value: item } : item,
	);

	const isItemDisabled = (item: SegmentedControlItem) =>
		disabled || !!item.disabled;

	// Roving tabindex: the checked item (else the first enabled one) is the
	// single tab stop, per the ARIA radiogroup pattern.
	const activeIndex = (() => {
		const checked = items.findIndex((item) => item.value === internalValue);
		if (checked !== -1 && !isItemDisabled(items[checked])) return checked;
		return items.findIndex((item) => !isItemDisabled(item));
	})();

	const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		const enabled = items.map((item) => !isItemDisabled(item));
		const deltas: Record<string, number> = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1,
		};
		let target: number | undefined;
		if (e.key in deltas) {
			e.preventDefault();
			const delta = deltas[e.key] ?? 0;
			const count = items.length;
			for (
				let i = (index + delta + count) % count;
				i !== index;
				i = (i + delta + count) % count
			) {
				if (enabled[i]) {
					target = i;
					break;
				}
			}
		} else if (e.key === "Home") {
			e.preventDefault();
			const first = enabled.indexOf(true);
			if (first !== -1) target = first;
		} else if (e.key === "End") {
			e.preventDefault();
			const last = enabled.lastIndexOf(true);
			if (last !== -1) target = last;
		}
		if (target !== undefined) {
			const item = items[target];
			itemRefs.current[target]?.focus();
			// arrowing through a radiogroup also selects, like native radios
			if (item && !disabled) handleChange(item.value);
		}
	};

	const sizeClasses = {
		xs: "h-6 text-xs",
		sm: "h-8 text-sm",
		md: "h-10 text-sm",
		lg: "h-12 text-base",
		xl: "h-14 text-lg",
	};

	const radiusClasses = {
		xs: "rounded-sm",
		sm: "rounded",
		md: "rounded-md",
		lg: "rounded-lg",
		xl: "rounded-xl",
		full: "rounded-full",
	};

	const root = applySlot(
		cn(
			"relative flex bg-muted p-1",
			radiusClasses[radius],
			fullWidth ? "w-full" : "w-fit",
			disabled && "cursor-not-allowed opacity-60",
			className,
		),
		slotStyles?.root,
	);

	return (
		<div
			data-kala-component="segmented-control"
			ref={ref}
			role="radiogroup"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{items.map((item, index) => {
				const isActive = internalValue === item.value;
				const isTabStop = index === activeIndex;
				return (
					// biome-ignore lint/a11y/useSemanticElements: segmented controls use the ARIA radiogroup pattern; native radios cannot render the sliding indicator design
					<button
						key={item.value}
						ref={(el) => {
							itemRefs.current[index] = el;
						}}
						type="button"
						role="radio"
						aria-checked={isActive}
						tabIndex={isTabStop ? 0 : -1}
						disabled={isItemDisabled(item)}
						onClick={() => !item.disabled && handleChange(item.value)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						className={cn(
							"relative z-10 flex items-center justify-center px-3 font-medium transition-colors",
							"focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-muted",
							sizeClasses[size],
							fullWidth ? "flex-1" : "min-w-[70px]",
							isActive
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground",
							item.disabled && "cursor-not-allowed opacity-50",
							radiusClasses[radius],
						)}
					>
						{isActive && (
							<motion.div
								layoutId={`indicator-${indicatorGroup}`}
								className={cn(
									"absolute inset-0 -z-10 bg-background shadow-sm",
									radiusClasses[radius],
								)}
								transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
							/>
						)}
						<span className="z-20">{item.label}</span>
					</button>
				);
			})}
		</div>
	);
}
