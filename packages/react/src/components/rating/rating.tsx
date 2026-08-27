"use client";

import { useUncontrolled } from "@kala-ui/react-hooks";
import { Star } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

export interface RatingProps extends React.ComponentProps<"fieldset"> {
	/** Controlled value */
	value?: number;
	/** Default value for uncontrolled usage */
	defaultValue?: number;
	/** Callback when rating changes */
	onValueChange?: (value: number) => void;
	/** Number of stars */
	count?: number;
	/** Allow half-star ratings */
	allowHalf?: boolean;
	/** Disable interaction (read-only display) */
	readOnly?: boolean;
	/** Disable the input */
	disabled?: boolean;
	/** Size of stars */
	size?: "sm" | "md" | "lg";
	/** Additional className */
	className?: string;
	/** Accessible label */
	"aria-label"?: string;
}

const sizeMap = {
	sm: "h-4 w-4",
	md: "h-5 w-5",
	lg: "h-7 w-7",
};

function RatingStar({
	fill,
	size,
}: {
	fill: "full" | "half" | "empty";
	size: keyof typeof sizeMap;
}) {
	return (
		<span data-kala-component="rating-star" className="relative inline-flex">
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
						"absolute inset-0 text-warning fill-warning",
					)}
					style={fill === "half" ? { clipPath: "inset(0 50% 0 0)" } : undefined}
				/>
			)}
		</span>
	);
}

function Rating({
	value,
	defaultValue = 0,
	onValueChange,
	count = 5,
	allowHalf = false,
	readOnly = false,
	disabled = false,
	size = "md",
	className,
	"aria-label": ariaLabel = "Rating",
	ref,
	...props
}: RatingProps) {
	const [currentValue, commit] = useUncontrolled<number>({
		value,
		defaultValue,
		onChange: onValueChange,
	});
	const [hoverValue, setHoverValue] = React.useState<number | null>(null);

	const displayValue = hoverValue ?? currentValue;

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

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (readOnly || disabled) return;

		let delta = 0;
		if (e.key === "ArrowUp" || e.key === "ArrowRight")
			delta = allowHalf ? 0.5 : 1;
		else if (e.key === "ArrowDown" || e.key === "ArrowLeft")
			delta = allowHalf ? -0.5 : -1;
		else if (e.key === "Home") {
			e.preventDefault();
			setHoverValue(null);
			commit(0);
			return;
		} else if (e.key === "End") {
			e.preventDefault();
			setHoverValue(null);
			commit(count);
			return;
		}
		if (!delta) return;

		e.preventDefault();
		setHoverValue(null);
		const base = allowHalf ? currentValue : Math.round(currentValue);
		commit(Math.min(count, Math.max(0, Number((base + delta).toFixed(1)))));
	};

	if (readOnly) {
		// Read-only is presentation, not a row of dead buttons: the value is
		// announced once through role="img", stars are decorative.
		return (
			<fieldset
				data-kala-component="rating"
				data-slot="rating"
				ref={ref}
				role="img"
				aria-label={`${ariaLabel}: ${currentValue} out of ${count} stars`}
				className={cn(
					"inline-flex items-center gap-0.5 border-0 p-0 m-0",
					className,
				)}
				{...props}
			>
				{Array.from({ length: count }, (_, i) => (
					<RatingStar key={i + 1} fill={getStarFill(i + 1)} size={size} />
				))}
			</fieldset>
		);
	}

	return (
		<fieldset
			data-kala-component="rating"
			data-slot="rating"
			ref={ref}
			aria-label={ariaLabel}
			className={cn(
				"inline-flex items-center gap-0.5 border-0 p-0 m-0",
				disabled && "opacity-50",
				className,
			)}
			onMouseLeave={() => !disabled && setHoverValue(null)}
			onKeyDown={handleKeyDown}
			{...props}
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
						disabled={disabled}
						onClick={(e) => handleClick(e, star)}
						onMouseMove={(e) => handleMouseMove(e, star)}
						className={cn(
							"relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
							!disabled &&
								"cursor-pointer hover:scale-110 transition-transform",
							disabled && "cursor-default",
						)}
					>
						<RatingStar fill={fill} size={size} />
					</button>
				);
			})}
		</fieldset>
	);
}

export { Rating };
