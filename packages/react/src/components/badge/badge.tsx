import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { badgeStyles } from "../../config/badge";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

const badgeVariants = cva(badgeStyles.base, {
	variants: badgeStyles.variants,
	defaultVariants: badgeStyles.defaultVariants,
});

function Badge({
	className,
	variant,
	shape,
	asChild = false,
	isLoading = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean; isLoading?: boolean }) {
	if (isLoading) {
		return (
			<Skeleton
				className={cn(
					"inline-flex h-5 w-16 items-center rounded-full",
					className,
				)}
			/>
		);
	}

	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant, shape }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
