import type { ReactNode } from "react";
import type { StyleProp, TextProps, ViewStyle } from "react-native";
import type { BadgeColor } from "../badge/badge.types";

export type ListItemIconSize = "sm" | "md" | "lg";
export type ListSkeletonVariant =
	| "simple"
	| "withAvatar"
	| "withIcon"
	| "withBadge"
	| "multiLine";

export interface ListSkeletonConfig {
	variant?: ListSkeletonVariant;
	/** skeleton rows to render; default 3 (web default) */
	itemCount?: number;
	/** halve row padding like the dense list */
	dense?: boolean;
	/** draw separators between skeleton rows */
	showDividers?: boolean;
}

export interface ListProps {
	/** draw 1px separators between items (default true) */
	divided?: boolean;
	/** halve row padding across items */
	dense?: boolean;
	/** show the skeleton surface instead of children */
	isLoading?: boolean;
	skeletonConfig?: ListSkeletonConfig;
	/** custom loading node rendered inside the list surface */
	skeleton?: ReactNode;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
	children?: ReactNode;
}

export interface ListItemProps {
	/** render a Pressable row that fires onPress */
	interactive?: boolean;
	/** open this url on press (Pressable + link role; Linking under the hood) */
	href?: string;
	/** selected state — primary-tinted background */
	active?: boolean;
	/** dim to 0.5 and block press */
	disabled?: boolean;
	/** halve row padding */
	dense?: boolean;
	onPress?: () => void;
	children?: ReactNode;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface ListItemIconProps {
	size?: ListItemIconSize;
	color?: string;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ListItemAvatarProps {
	source?: { uri: string };
	/** name drives the initials fallback when the image fails or is absent */
	name?: string;
	size?: ListItemIconSize;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ListItemContentProps {
	style?: StyleProp<ViewStyle>;
	testID?: string;
	children?: ReactNode;
}

export interface ListItemTitleProps extends TextProps {
	style?: StyleProp<ViewStyle>;
	testID?: string;
	children?: ReactNode;
}

export interface ListItemTextProps extends TextProps {
	/** clamp after N lines (numberOfLines) */
	lines?: number;
	/** single-line ellipsis — numberOfLines 1 */
	truncate?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ListItemActionProps {
	style?: StyleProp<ViewStyle>;
	testID?: string;
	children?: ReactNode;
}

export interface ListItemBadgeProps {
	color?: BadgeColor;
	children?: ReactNode;
	testID?: string;
}

export type { BadgeColor };
