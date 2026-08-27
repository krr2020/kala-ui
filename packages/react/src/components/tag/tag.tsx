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
				solid: "",
				outline: "border bg-transparent",
				subtle: "",
			},
			color: {
				primary: "",
				secondary: "",
				destructive: "",
				success: "",
				warning: "",
				info: "",
				muted: "",
			},
			size: {
				sm: "text-xs px-2 py-0.5 [&_svg]:size-3",
				md: "text-sm px-2.5 py-1 [&_svg]:size-3.5",
				lg: "text-base px-3 py-1.5 [&_svg]:size-4",
			},
		},
		compoundVariants: [
			{
				variant: "solid",
				color: "primary",
				className: "bg-primary text-primary-foreground",
			},
			{
				variant: "solid",
				color: "secondary",
				className: "bg-secondary text-secondary-foreground",
			},
			{
				variant: "solid",
				color: "destructive",
				className: "bg-destructive text-destructive-foreground",
			},
			{
				variant: "solid",
				color: "success",
				className: "bg-success text-success-foreground",
			},
			{
				variant: "solid",
				color: "warning",
				className: "bg-warning text-warning-foreground",
			},
			{
				variant: "solid",
				color: "info",
				className: "bg-info text-info-foreground",
			},
			{
				variant: "solid",
				color: "muted",
				className: "bg-muted text-muted-foreground",
			},
			{
				variant: "outline",
				color: "primary",
				className: "border-primary text-primary",
			},
			{
				variant: "outline",
				color: "secondary",
				className: "border-secondary text-secondary",
			},
			{
				variant: "outline",
				color: "destructive",
				className: "border-destructive text-destructive",
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
				color: "info",
				className: "border-info text-info",
			},
			{
				variant: "outline",
				color: "muted",
				className: "border-muted-foreground text-muted-foreground",
			},
			{
				variant: "subtle",
				color: "primary",
				className: "bg-primary/10 text-primary",
			},
			{
				variant: "subtle",
				color: "secondary",
				className: "bg-secondary/10 text-secondary",
			},
			{
				variant: "subtle",
				color: "destructive",
				className: "bg-destructive/10 text-destructive",
			},
			{
				variant: "subtle",
				color: "success",
				className: "bg-success/10 text-success",
			},
			{
				variant: "subtle",
				color: "warning",
				className: "bg-warning/10 text-warning",
			},
			{
				variant: "subtle",
				color: "info",
				className: "bg-info/10 text-info",
			},
			{
				variant: "subtle",
				color: "muted",
				className: "bg-muted text-muted-foreground",
			},
		],
		defaultVariants: {
			variant: "subtle",
			color: "muted",
			size: "md",
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
