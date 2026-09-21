import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";
import type * as React from "react";

export interface UserMenuDropdownProps
	extends Omit<React.ComponentProps<"button">, "color"> {
	user: {
		name?: string;
		email?: string;
		avatar?: string;
	};
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	onLogout?: () => void;
	baseUrl?: string;
	className?: string;
	/** Per-part overrides: trigger, avatar, avatarFallback, content, label, name, email, itemIcon. */
	slotStyles?: SlotStyles;
}
