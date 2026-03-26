"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type * as React from "react";

import { cn } from "../../lib/utils";

const tagVariants = cva(
	"inline-flex items-center gap-1 rounded-full font-medium transition-colors select-none",
	{
		variants: {
			variant: {
				filled: "",
				outline: "border bg-transparent",
				soft: "",
			},
			color: {
				default: "",
				primary: "",
				secondary: "",
				success: "",
				warning: "",
				error: "",
				info: "",
			},
			size: {
				sm: "text-xs px-2 py-0.5 [&_svg]:size-3",
				default: "text-sm px-2.5 py-1 [&_svg]:size-3.5",
				lg: "text-base px-3 py-1.5 [&_svg]:size-4",
			},
		},
		compoundVariants: [
			// filled
			{
				variant: "filled",
				color: "default",
				className: "bg-primary text-primary-foreground",
			},
			{
				variant: "filled",
				color: "primary",
				className: "bg-primary text-primary-foreground",
			},
			{
				variant: "filled",
				color: "secondary",
				className: "bg-secondary text-secondary-foreground",
			},
			{
				variant: "filled",
				color: "success",
				className: "bg-success text-success-foreground",
			},
			{
				variant: "filled",
				color: "warning",
				className: "bg-warning text-warning-foreground",
			},
			{
				variant: "filled",
				color: "error",
				className: "bg-destructive text-destructive-foreground",
			},
			{
				variant: "filled",
				color: "info",
				className: "bg-info text-info-foreground",
			},
			// outline
			{
				variant: "outline",
				color: "default",
				className: "border-primary text-primary",
			},
			{
				variant: "outline",
				color: "primary",
				className: "border-primary text-primary",
			},
			{
				variant: "outline",
				color: "secondary",
				className: "border-secondary text-secondary-foreground",
			},
			{
				variant: "outline",
				color: "success",
				className: "border-success text-success",
			},
			{
				variant: "outline",
				color: "warning",
				className: "border-warning text-warning",
			},
			{
				variant: "outline",
				color: "error",
				className: "border-destructive text-destructive",
			},
			{ variant: "outline", color: "info", className: "border-info text-info" },
			// soft
			{
				variant: "soft",
				color: "default",
				className: "bg-primary/10 text-primary",
			},
			{
				variant: "soft",
				color: "primary",
				className: "bg-primary/10 text-primary",
			},
			{
				variant: "soft",
				color: "secondary",
				className: "bg-secondary/20 text-secondary-foreground",
			},
			{
				variant: "soft",
				color: "success",
				className: "bg-success/10 text-success",
			},
			{
				variant: "soft",
				color: "warning",
				className: "bg-warning/10 text-warning",
			},
			{
				variant: "soft",
				color: "error",
				className: "bg-destructive/10 text-destructive",
			},
			{ variant: "soft", color: "info", className: "bg-info/10 text-info" },
		],
		defaultVariants: {
			variant: "soft",
			color: "default",
			size: "default",
		},
	},
);

export interface TagProps
	extends Omit<React.ComponentProps<"span">, "color">,
		VariantProps<typeof tagVariants> {
	/** Show remove button */
	onRemove?: () => void;
	/** Icon to show before label */
	icon?: React.ReactNode;
}

function Tag({
	className,
	variant,
	color,
	size,
	onRemove,
	icon,
	children,
	...props
}: TagProps) {
	return (
		<span
			data-slot="tag"
			className={cn(tagVariants({ variant, color, size }), className)}
			{...props}
		>
			{icon && (
				<span aria-hidden="true" className="shrink-0">
					{icon}
				</span>
			)}
			{children}
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					aria-label="Remove"
					className="shrink-0 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current transition-opacity"
				>
					<X aria-hidden="true" />
				</button>
			)}
		</span>
	);
}

export { Tag, tagVariants };
