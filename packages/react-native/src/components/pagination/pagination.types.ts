import type { StyleProp, ViewStyle } from "react-native";

export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationProps {
	/** Total amount of pages */
	total?: number;
	/** Controlled page number */
	page?: number;
	/** Initial page (uncontrolled) */
	defaultPage?: number;
	/** Siblings amount on left/right side of the selected page */
	siblings?: number;
	/** Amount of elements visible on left/right edges */
	boundaries?: number;
	/** Callback fired after the page changes */
	onPageChange?: (page: number) => void;
	/** Size of the page buttons */
	size?: PaginationSize;
	/** ARIA label for the navigation */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		page?: StyleProp<ViewStyle>;
		previous?: StyleProp<ViewStyle>;
		next?: StyleProp<ViewStyle>;
		ellipsis?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
