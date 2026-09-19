import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/**
 * Native Tabs collapses the web compound parts (Tabs.List / Tabs.Trigger /
 * Tabs.Content) into an items array plus a single content slot: each item
 * carries the Trigger vocabulary (value/label/disabled), and `children`
 * renders inside the active panel (re-keyed by value, remounting on switch —
 * standard RN screen behavior). Radix's roving focus and arrow-key nav have
 * no keyboard on touch; selection is a press, mirroring the RadioGroup
 * precedent.
 */
export type TabsVariant = "line" | "pill";

export interface TabsItem {
	value: string;
	label: string;
	disabled?: boolean;
	/** count chip rendered beside the label; also appended to the a11y name */
	badge?: string | number;
	/** notification dot pinned to the tab's trailing top corner */
	indicator?: boolean;
}

export interface TabsProps {
	items: TabsItem[];
	/** Controlled active value — when set, presses report but never override. */
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: "horizontal" | "vertical";
	/** Look: "line" (default — bare track + primary underline) or "pill" (filled active trigger). */
	variant?: TabsVariant;
	children?: ReactNode;
	accessibilityLabel?: string;
	/** slotStyles: root wins over the library surface. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		list?: StyleProp<ViewStyle>;
		tab?: StyleProp<ViewStyle>;
		/** line variant only — the underline/rail of the selected tab. */
		indicator?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
