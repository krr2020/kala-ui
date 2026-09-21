import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface InputProps extends React.ComponentProps<"input"> {
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props, in every render arm. */
	slotStyles?: SlotStyles;
	/** Show password visibility toggle button (only for type="password") */
	showPasswordToggle?: boolean;
	/** Accessible labels for the password toggle; each field falls back to its stock English string. */
	toggleAriaLabels?: { show?: string; hide?: string };
	/** Glyph overrides for the password toggle; each field falls back to the stock Eye/EyeOff icon. */
	icons?: { showPassword?: React.ReactNode; hidePassword?: React.ReactNode };
	/** Prefix icon element */
	prefixIcon?: React.ReactNode;
	/** Suffix icon element */
	suffixIcon?: React.ReactNode;
	/** Error state styling */
	hasError?: boolean;
	/** Success state styling */
	hasSuccess?: boolean;
	/** Show loading skeleton */
	isLoading?: boolean;
}
