"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";
import type { LabelProps } from "./label.types";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground",
);

function Label({ ref, className, required, children, ...props }: LabelProps) {
	return (
		<LabelPrimitive.Root
			data-kala-component="label"
			ref={ref}
			className={cn(labelVariants(), className)}
			{...props}
		>
			{children}
			{required && <span className="ml-1 text-destructive">*</span>}
		</LabelPrimitive.Root>
	);
}

export { Label, labelVariants };
