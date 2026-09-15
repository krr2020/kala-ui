import type { StyleProp, ViewStyle } from "react-native";

export interface BreadcrumbItem {
	label: string;
	/** web href becomes a press handler on native */
	onPress?: () => void;
}

export interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	/** string glyph between crumbs; defaults to a chevron */
	separator?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface BreadcrumbsSkeletonConfig {
	/** number of crumb placeholders */
	depth?: number;
}

export interface BreadcrumbsSkeletonProps extends BreadcrumbsSkeletonConfig {
	separator?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
