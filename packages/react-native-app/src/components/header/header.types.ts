import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface HeaderAction {
	/** Accessible label for the action button (also the a11y name). */
	label: string;
	onPress: () => void;
	/** Renders the action inert and announces disabled state. */
	disabled?: boolean;
	/** Optional icon element; label-only actions render a text button. */
	icon?: ReactNode;
}

export interface HeaderProps {
	/** Screen title announced as the header's accessible name. */
	title: string;
	/** Provides the leading back affordance when present. */
	onBack?: () => void;
	/** Accessible label for the back button. */
	backLabel?: string;
	/** Trailing actions, rendered in order as k-header-action-N. */
	actions?: HeaderAction[];
	/** Renders the skeleton variant, keeping the k-header marker. */
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
