"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";
import type { LabelProps } from "./label.types";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground",
);

const Label = React.forwardRef<
	React.ComponentRef<typeof LabelPrimitive.Root>,
	LabelProps
>(({ className, required, children, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(labelVariants(), className)}
		{...props}
	>
		{children}
		{required && <span className="ml-1 text-destructive">*</span>}
	</LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
