import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type * as React from "react";

import { cn } from "../../lib/utils";

const spinnerVariants = cva("animate-spin", {
	variants: {
		size: {
			sm: "h-4 w-4",
			md: "h-6 w-6",
			lg: "h-8 w-8",
			xl: "h-12 w-12",
		},
		variant: {
			default: "text-primary",
			muted: "text-muted-foreground",
			white: "text-primary-foreground",
			ghost: "text-muted-foreground/60",
			current: "text-current",
		},
	},
	defaultVariants: {
		size: "md",
		variant: "default",
	},
});

export interface SpinnerProps
	extends React.ComponentProps<"svg">,
		VariantProps<typeof spinnerVariants> {
	label?: string;
}

function Spinner({
	ref,
	className,
	size,
	variant,
	label = "Loading...",
	...props
}: SpinnerProps) {
	return (
		<output
			className={cn("inline-flex items-center justify-center", className)}
		>
			<Loader2
				ref={ref}
				className={cn(spinnerVariants({ size, variant }))}
				{...props}
			/>
			<span className="sr-only">{label}</span>
		</output>
	);
}

export { Spinner, spinnerVariants };
