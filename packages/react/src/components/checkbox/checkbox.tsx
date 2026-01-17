"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { checkboxIndicatorStyles, checkboxStyles } from "../../config/checkbox";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { CheckboxProps } from "./checkbox.types";

function Checkbox({ className, isLoading = false, ...props }: CheckboxProps) {
	if (isLoading) {
		return <Skeleton className={cn("h-4 w-4 rounded", className)} />;
	}

	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(checkboxStyles.base, className)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className={checkboxIndicatorStyles.base}
			>
				{props.checked === "indeterminate" ? (
					<Minus className="size-3.5 stroke-3" />
				) : (
					<Check className="size-3.5 stroke-3" />
				)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
