import type { ComponentType } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/** One tab: value drives selection + the k-tab-bar-item-{value} marker. */
export interface TabBarItemData {
	value: string;
	label: string;
	icon?: ComponentType<{ size?: number; color?: string }>;
	/** Renders the tab inert and announces disabled state. */
	disabled?: boolean;
}

export interface TabBarProps {
	/** Data-driven tabs; TabBarItem itself stays internal. */
	items: TabBarItemData[];
	/** Controlled selected value; a value matching no item selects nothing. */
	value?: string;
	/** Fires with the pressed item's value — including the already-selected one. */
	onChange: (value: string) => void;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
