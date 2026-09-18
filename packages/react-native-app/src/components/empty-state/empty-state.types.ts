import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { IconComponent } from "@kala-ui/react-native";

/** Any icon-library component taking {size, color} — see Icon. */
export type EmptyStateIcon = IconComponent;

export interface EmptyStateAction {
	label: string;
	onPress: () => void;
	variant?: "solid" | "outline" | "ghost" | "subtle";
}

export interface EmptyStateProps {
	icon?: EmptyStateIcon;
	title: string;
	description?: string;
	action?: EmptyStateAction;
	color?: "default" | "destructive";
	size?: "sm" | "md" | "lg";
	/** Render skeleton rows instead of content while loading. */
	isLoading?: boolean;
	children?: ReactNode;
	accessibilityLabel?: string;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		icon?: StyleProp<ViewStyle>;
		title?: StyleProp<TextStyle>;
		description?: StyleProp<TextStyle>;
		action?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
