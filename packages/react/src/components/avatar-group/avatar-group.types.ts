import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { AvatarProps } from "../avatar/avatar.types";

export interface AvatarItem {
	src?: string;
	alt?: string;
	fallback: string;
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
	avatars: AvatarItem[];
	/** Maximum number of avatars to show before the "+N" overflow chip */
	max?: number;
	size?: AvatarProps["size"];
	/** Show a tooltip with each avatar's name on hover */
	showTooltip?: boolean;
	/** `root` wins over `className`/`style`, `ring` targets each avatar's ring, `overflow` the "+N" chip. */
	slotStyles?: SlotStyles;
}
