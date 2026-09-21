"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { switchStyles, switchThumbStyles } from "../../config/switch";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import { Skeleton } from "../skeleton";
import type { SwitchProps } from "./switch.types";

function Switch({
	className,
	style,
	slotStyles: slotStylesRaw,
	isLoading = false,
	ref,
	...props
}: SwitchProps & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("switch", slotStylesRaw);
	if (isLoading) {
		const skel = applySlot(
			cn("h-6 w-11 rounded-full", className),
			slotStyles?.root,
		);
		return (
			<Skeleton
				data-kala-component="switch"
				className={skel.className}
				style={mergeStyle(style, skel.style)}
			/>
		);
	}

	const root = applySlot(cn(switchStyles.base, className), slotStyles?.root);
	const thumb = applySlot(switchThumbStyles.base, slotStyles?.thumb);
	return (
		<SwitchPrimitive.Root
			data-kala-component="switch"
			ref={ref}
			data-slot="switch"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-kala-component="switch-thumb"
				data-slot="switch-thumb"
				className={thumb.className}
				style={thumb.style}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
