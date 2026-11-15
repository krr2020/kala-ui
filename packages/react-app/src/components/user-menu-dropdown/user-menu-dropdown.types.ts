import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";
import type * as React from "react";
import type { IconComponent } from "@kala-ui/react/icons";

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
	/** Profile-row glyph — any `{className, size}` icon component; defaults to kala's built-in user. */
	userIcon?: IconComponent;
	/** Settings-row glyph — any `{className, size}` icon component; defaults to kala's built-in gear. */
	settingsIcon?: IconComponent;
	/** Logout-row glyph — any `{className, size}` icon component; defaults to kala's built-in log-out. */
	logoutIcon?: IconComponent;
	baseUrl?: string;
	className?: string;
	/** Per-part overrides: trigger, avatar, avatarFallback, content, label, name, email, itemIcon. */
	slotStyles?: SlotStyles;
}
