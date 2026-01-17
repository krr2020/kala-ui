"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { switchStyles, switchThumbStyles } from "../../config/switch";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { SwitchProps } from "./switch.types";

function Switch({ className, isLoading = false, ...props }: SwitchProps) {
	if (isLoading) {
		return <Skeleton className={cn("h-6 w-11 rounded-full", className)} />;
	}

	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(switchStyles.base, className)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(switchThumbStyles.base)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
