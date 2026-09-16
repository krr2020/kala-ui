import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

/** Lucide icon component (the surface Icon's `icon` prop takes). */
export type EmptyStateIcon = LucideIcon;

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
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		icon?: StyleProp<ViewStyle>;
		title?: StyleProp<TextStyle>;
		description?: StyleProp<TextStyle>;
		action?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
