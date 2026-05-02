"use client";

import { cn } from "../../lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarProps,
} from "../avatar/avatar";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "../tooltip/tooltip";

export interface AvatarItem {
	src?: string;
	alt?: string;
	fallback: string;
}

export interface AvatarGroupProps {
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
}

function AvatarGroup({
	avatars,
	max = 4,
	size = "default",
	showTooltip = true,
	className,
}: AvatarGroupProps) {
	const visible = avatars.slice(0, max);
	const overflow = avatars.length - max;

	const avatarEl = (avatar: AvatarItem, index: number) => (
		<Avatar
			key={index}
			size={size}
			className="ring-2 ring-background -ml-2 first:ml-0 transition-transform hover:z-10 hover:-translate-y-0.5"
		>
			{avatar.src && (
				<AvatarImage src={avatar.src} alt={avatar.alt ?? avatar.fallback} />
			)}
			<AvatarFallback>{avatar.fallback}</AvatarFallback>
		</Avatar>
	);

	return (
		<TooltipProvider>
			<div
				data-slot="avatar-group"
				className={cn("flex items-center", className)}
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
					<Avatar size={size} className="ring-2 ring-background -ml-2">
						<AvatarFallback variant="muted">+{overflow}</AvatarFallback>
					</Avatar>
				)}
			</div>
		</TooltipProvider>
	);
}

export { AvatarGroup };
