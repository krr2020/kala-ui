import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { ButtonProps } from "../button/button.types";

export interface CopyButtonProps
	extends Omit<ButtonProps, "onClick" | "children"> {
	/** Text to copy to clipboard */
	value: string;
	/** Duration in ms to show the success state */
	timeout?: number;
	/** Icon to show in copy state (default: Copy icon) */
	copyIcon?: React.ReactNode;
	/** Icon to show in success state (default: Check icon) */
	checkIcon?: React.ReactNode;
	/** Accessible label */
	"aria-label"?: string;
	/** Per-part overrides: `icon` targets the rendered glyph. */
	slotStyles?: SlotStyles;
}
