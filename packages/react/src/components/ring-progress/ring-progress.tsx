import * as React from "react";
import { cn } from "../../lib/utils";

export interface RingProgressProps
	extends React.HTMLAttributes<HTMLDivElement> {
	/** Value (0-100) */
	value?: number;
	/** Size in px */
	size?: number;
	/** Ring thickness */
	thickness?: number;
	/** Color (class name like text-blue-500) */
	color?: string;
	/** Empty ring color (class name) */
	emptyColor?: string;
	/** Label content centered in the ring */
	label?: React.ReactNode;
	/** Round caps */
	roundCaps?: boolean;
	/** Sections for multiple segments [{ value: 20, color: 'text-red-500' }] */
	sections?: { value: number; color: string; tooltip?: React.ReactNode }[];
}

export const RingProgress = React.forwardRef<HTMLDivElement, RingProgressProps>(
	(
		{
			className,
			value,
			size = 120,
			thickness = 12,
			color = "text-primary",
			emptyColor = "text-muted",
			label,
			roundCaps = true,
			sections,
			...props
		},
		ref,
	) => {
		const radius = (size - thickness) / 2;
		const circumference = radius * 2 * Math.PI;

		const segments =
			sections || (value !== undefined ? [{ value, color }] : []);

		// Normalize values to ensure they sum up to <= 100 if needed, or just map them
		// We map them to arc lengths.

		let accumulatedValue = 0;
		const renderedSegments = segments.map((segment, i) => {
			const segmentValue = Math.min(Math.max(segment.value, 0), 100);
			const offset = circumference - (segmentValue / 100) * circumference;
			const rotation = (accumulatedValue / 100) * 360;
			accumulatedValue += segmentValue;

			return (
				<circle
					key={i}
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={thickness}
					stroke="currentColor"
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={offset}
					strokeLinecap={roundCaps ? "round" : "butt"}
					className={cn("transition-all duration-500 ease-out", segment.color)}
					transform={`rotate(${rotation - 90} ${size / 2} ${size / 2})`}
				/>
			);
		});

		return (
			<div
				ref={ref}
				className={cn("relative flex items-center justify-center", className)}
				style={{ width: size, height: size }}
				{...props}
			>
				<svg width={size} height={size} className="transform" role="img">
					<title>Progress ring</title>
					{/* Empty ring background */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						strokeWidth={thickness}
						stroke="currentColor"
						className={cn("opacity-20", emptyColor)}
					/>

					{renderedSegments}
				</svg>

				{label && (
					<div className="absolute inset-0 flex items-center justify-center">
						{label}
					</div>
				)}
			</div>
		);
	},
);

RingProgress.displayName = "RingProgress";
