"use client";

import { Star } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

export interface RatingProps {
	/** Controlled value */
	value?: number;
	/** Default value for uncontrolled usage */
	defaultValue?: number;
	/** Callback when rating changes */
	onChange?: (value: number) => void;
	/** Number of stars */
	count?: number;
	/** Allow half-star ratings */
	allowHalf?: boolean;
	/** Disable interaction (read-only display) */
	readOnly?: boolean;
	/** Disable the input */
	disabled?: boolean;
	/** Size of stars */
	size?: "sm" | "default" | "lg";
	/** Additional className */
	className?: string;
	/** Accessible label */
	"aria-label"?: string;
}

const sizeMap = {
	sm: "h-4 w-4",
	default: "h-5 w-5",
	lg: "h-7 w-7",
};

function Rating({
	value,
	defaultValue = 0,
	onChange,
	count = 5,
	allowHalf = false,
	readOnly = false,
	disabled = false,
	size = "default",
	className,
	"aria-label": ariaLabel = "Rating",
}: RatingProps) {
	const [internalValue, setInternalValue] = React.useState(defaultValue);
	const [hoverValue, setHoverValue] = React.useState<number | null>(null);

	const isControlled = value !== undefined;
	const currentValue = isControlled ? value : internalValue;
	const displayValue = hoverValue ?? currentValue;

	const commit = (v: number) => {
		if (!isControlled) setInternalValue(v);
		onChange?.(v);
	};

	const getStarFill = (star: number): "full" | "half" | "empty" => {
		if (displayValue >= star) return "full";
		if (allowHalf && displayValue >= star - 0.5) return "half";
		return "empty";
	};

	const handleMouseMove = (
		e: React.MouseEvent<HTMLButtonElement>,
		star: number,
	) => {
		if (readOnly || disabled) return;
		if (allowHalf) {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = e.clientX - rect.left;
			hoverValue !== (x < rect.width / 2 ? star - 0.5 : star) &&
				setHoverValue(x < rect.width / 2 ? star - 0.5 : star);
		} else {
			if (hoverValue !== star) setHoverValue(star);
		}
	};

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement>,
		star: number,
	) => {
		if (readOnly || disabled) return;
		let v = star;
		if (allowHalf) {
			const rect = e.currentTarget.getBoundingClientRect();
			v = e.clientX - rect.left < rect.width / 2 ? star - 0.5 : star;
		}
		// Toggle off if clicking same value
		commit(v === currentValue ? 0 : v);
	};

	return (
		<fieldset
			data-slot="rating"
			aria-label={ariaLabel}
			className={cn(
				"inline-flex items-center gap-0.5 border-0 p-0 m-0",
				disabled && "opacity-50",
				className,
			)}
			onMouseLeave={() => !readOnly && !disabled && setHoverValue(null)}
		>
			{Array.from({ length: count }, (_, i) => {
				const star = i + 1;
				const fill = getStarFill(star);

				return (
					<button
						key={star}
						type="button"
						aria-label={`${star} star${star !== 1 ? "s" : ""}`}
						aria-pressed={currentValue >= star}
						disabled={disabled || readOnly}
						onClick={(e) => handleClick(e, star)}
						onMouseMove={(e) => handleMouseMove(e, star)}
						className={cn(
							"relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
							!readOnly &&
								!disabled &&
								"cursor-pointer hover:scale-110 transition-transform",
							(readOnly || disabled) && "cursor-default",
						)}
					>
						{/* Background (empty) star */}
						<Star
							aria-hidden="true"
							className={cn(sizeMap[size], "text-muted-foreground/30")}
						/>
						{/* Filled overlay */}
						{fill !== "empty" && (
							<Star
								aria-hidden="true"
								className={cn(
									sizeMap[size],
									"absolute inset-0 text-yellow-400 fill-yellow-400",
									fill === "half" && "clip-path-[inset(0_50%_0_0)]",
								)}
								style={
									fill === "half" ? { clipPath: "inset(0 50% 0 0)" } : undefined
								}
							/>
						)}
					</button>
				);
			})}
		</fieldset>
	);
}

export { Rating };
