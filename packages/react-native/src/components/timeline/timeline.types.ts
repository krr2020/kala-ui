import type { StyleProp, ViewStyle } from "react-native";

export type TimelineStatus =
	| "default"
	| "success"
	| "error"
	| "warning"
	| "pending";

export interface TimelineItemData {
	title?: string;
	description?: string;
	timestamp?: string;
	status?: TimelineStatus;
}

export interface TimelineProps {
	items: TimelineItemData[];
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
		dot?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
