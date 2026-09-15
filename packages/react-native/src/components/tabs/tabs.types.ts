import type { ReactNode } from "react";

/**
 * Native Tabs collapses the web compound parts (Tabs.List / Tabs.Trigger /
 * Tabs.Content) into an items array plus a single content slot: each item
 * carries the Trigger vocabulary (value/label/disabled), and `children`
 * renders inside the active panel (re-keyed by value, remounting on switch —
 * standard RN screen behavior). Radix's roving focus and arrow-key nav have
 * no keyboard on touch; selection is a press, mirroring the RadioGroup
 * precedent.
 */
export interface TabsItem {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface TabsProps {
	items: TabsItem[];
	/** Controlled active value — when set, presses report but never override. */
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: "horizontal" | "vertical";
	children?: ReactNode;
	accessibilityLabel?: string;
	testID?: string;
}
