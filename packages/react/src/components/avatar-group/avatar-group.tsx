"use client";

import { avatarGroupStyles } from "../../config/avatar-group";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { useSlotStyles } from "../kala-provider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../tooltip/tooltip";
import type { AvatarGroupProps, AvatarItem } from "./avatar-group.types";

function AvatarGroup({
	avatars,
	max = 4,
	size = "md",
	showTooltip = true,
	className,
	style,
	slotStyles: slotStylesRaw,
	ref,
	...props
}: AvatarGroupProps) {
	const slotStyles = useSlotStyles("avatar-group", slotStylesRaw);
	const visible = avatars.slice(0, max);
	const overflow = avatars.length - max;

	const ring = applySlot(avatarGroupStyles.ring, slotStyles?.ring);
	const overflowChip = applySlot(
		avatarGroupStyles.overflow,
		slotStyles?.overflow,
	);
	const root = applySlot(
		cn(avatarGroupStyles.root, className),
		slotStyles?.root,
	);

	const avatarEl = (avatar: AvatarItem, index: number) => (
		<Avatar
			key={index}
			size={size}
			className={ring.className}
			style={ring.style}
		>
			{avatar.src && (
				<AvatarImage src={avatar.src} alt={avatar.alt ?? avatar.fallback} />
			)}
			<AvatarFallback>{avatar.fallback}</AvatarFallback>
		</Avatar>
	);

	return (
		<TooltipProvider data-kala-component="avatar-group">
			<div
				data-slot="avatar-group"
				ref={ref}
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			>
				{visible.map((avatar, index) =>
					showTooltip ? (
						<Tooltip key={index}>
							<TooltipTrigger asChild>{avatarEl(avatar, index)}</TooltipTrigger>
							<TooltipContent>{avatar.alt ?? avatar.fallback}</TooltipContent>
						</Tooltip>
					) : (
						avatarEl(avatar, index)
					),
				)}

				{overflow > 0 && (
					<Avatar
						size={size}
						className={overflowChip.className}
						style={overflowChip.style}
					>
						<AvatarFallback color="muted">+{overflow}</AvatarFallback>
					</Avatar>
				)}
			</div>
		</TooltipProvider>
	);
}

export { AvatarGroup };
