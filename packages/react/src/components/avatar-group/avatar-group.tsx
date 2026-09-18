"use client";

import { avatarGroupStyles } from "../../config/avatar-group";
import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarProps,
} from "../avatar/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../tooltip/tooltip";

export interface AvatarItem {
	src?: string;
	alt?: string;
	fallback: string;
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
	/** List of avatars to display */
	avatars: AvatarItem[];
	/** Maximum number of avatars to show before overflow */
	max?: number;
	/** Avatar size variant */
	size?: AvatarProps["size"];
	/** Show tooltip with all names on hover */
	showTooltip?: boolean;
	/** Additional className */
	className?: string;
	/** Per-part overrides: `root` wins over `className`/`style`, `ring` targets each avatar's ring, `overflow` the "+N" chip. */
	slotStyles?: SlotStyles;
}

function AvatarGroup({
	avatars,
	max = 4,
	size = "md",
	showTooltip = true,
	className,
	style,
	slotStyles,
	ref,
	...props
}: AvatarGroupProps) {
	const visible = avatars.slice(0, max);
	const overflow = avatars.length - max;

	const ring = applySlot(avatarGroupStyles.ring, slotStyles?.ring);
	const overflowChip = applySlot(avatarGroupStyles.overflow, slotStyles?.overflow);
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
