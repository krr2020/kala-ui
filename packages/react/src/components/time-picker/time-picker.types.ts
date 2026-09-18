import type { SlotStyles } from "../../lib/slot-styles";

export interface TimeValue {
	hours: number;
	minutes: number;
	seconds?: number;
}

export interface TimePickerProps {
	/** Controlled time value */
	value?: TimeValue;
	/** Default value for uncontrolled usage */
	defaultValue?: TimeValue;
	/** Called when time changes */
	onValueChange?: (value: TimeValue) => void;
	/** 12-hour or 24-hour format */
	hourCycle?: 12 | 24;
	/** Whether to show seconds column */
	showSeconds?: boolean;
	/** Disable the picker */
	disabled?: boolean;
	/** Error state */
	hasError?: boolean;
	/** Show loading skeleton */
	isLoading?: boolean;
	/** Additional className on the root element */
	className?: string;
	/** Inline style on the root element */
	style?: React.CSSProperties;
	/**
	 * Per-part overrides: `root` wins over `className`/`style` in every
	 * arm; `hour`/`minute`/`second` target the scroll columns, `colon` the
	 * ":" separators.
	 */
	slotStyles?: SlotStyles;
}
