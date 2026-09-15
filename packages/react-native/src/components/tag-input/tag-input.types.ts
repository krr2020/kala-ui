import type { StyleProp, ViewStyle } from "react-native";

export interface TagInputProps {
	/** controlled chip set; locks display until the parent re-renders */
	value?: string[];
	/** uncontrolled seed; ignored when `value` is provided */
	defaultValue?: string[];
	/** fires with the full array on every add/remove/clear */
	onValueChange?: (tags: string[]) => void;
	/** characters that commit the pending text as a tag */
	separators?: string[];
	/** default false */
	allowDuplicates?: boolean;
	maxTags?: number;
	/** gate before a candidate joins the set */
	validateTag?: (tag: string) => boolean;
	/** shape a candidate before it joins the set; default trim */
	transformTag?: (tag: string) => string;
	placeholder?: string;
	disabled?: boolean;
	hasError?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		field?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
