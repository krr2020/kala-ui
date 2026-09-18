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
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
		dot?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
