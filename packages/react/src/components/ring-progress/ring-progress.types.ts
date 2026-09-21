import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface RingProgressProps extends React.ComponentProps<"div"> {
	/** Value (0-100) */
	value?: number;
	/** Size in px */
	size?: number;
	/** Ring thickness */
	thickness?: number;
	/** Color (class name like text-blue-500) */
	color?: string;
	/** Empty ring color (class name) */
	emptyColor?: string;
	/** Label content centered in the ring */
	label?: React.ReactNode;
	/** Round caps */
	roundCaps?: boolean;
	/** Sections for multiple segments [{ value: 20, color: 'text-red-500' }] */
	sections?: { value: number; color: string; tooltip?: React.ReactNode }[];
	/** Per-part overrides: `root` wins over `className`/`style`; `label` targets the centered label wrapper. */
	slotStyles?: SlotStyles;
}
