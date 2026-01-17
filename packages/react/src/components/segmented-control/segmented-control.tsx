import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface SegmentedControlItem {
	value: string;
	label: React.ReactNode;
	disabled?: boolean;
}

export type SegmentedControlData = string | SegmentedControlItem;

export interface SegmentedControlProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	data: SegmentedControlData[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	name?: string;
	fullWidth?: boolean;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
}

export const SegmentedControl = React.forwardRef<
	HTMLDivElement,
	SegmentedControlProps
>(
	(
		{
			className,
			data,
			value: valueProp,
			defaultValue,
			onChange,
			disabled,
			name,
			fullWidth,
			size = "sm",
			radius = "sm",
			...props
		},
		ref,
	) => {
		const [internalValue, setInternalValue] = React.useState<string>(
			valueProp ??
				defaultValue ??
				(typeof data[0] === "string" ? data[0] : data[0]?.value) ??
				"",
		);

		React.useEffect(() => {
			if (valueProp !== undefined) {
				setInternalValue(valueProp);
			}
		}, [valueProp]);

		const handleChange = (val: string) => {
			if (disabled) return;
			if (valueProp === undefined) {
				setInternalValue(val);
			}
			onChange?.(val);
		};

		const items = data.map((item) =>
			typeof item === "string" ? { label: item, value: item } : item,
		);

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

		return (
			<div
				ref={ref}
				className={cn(
					"relative flex bg-muted p-1",
					radiusClasses[radius],
					fullWidth ? "w-full" : "w-fit",
					disabled && "cursor-not-allowed opacity-60",
					className,
				)}
				{...props}
			>
				{items.map((item) => {
					const isActive = internalValue === item.value;
					return (
						<button
							key={item.value}
							type="button"
							disabled={disabled || item.disabled}
							onClick={() => !item.disabled && handleChange(item.value)}
							className={cn(
								"relative z-10 flex items-center justify-center px-3 font-medium transition-colors",
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
									layoutId={`indicator-${name ?? "segmented-control"}`}
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
	},
);

SegmentedControl.displayName = "SegmentedControl";
