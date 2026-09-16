import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/** Mobile-first variant set — inline secondary actions use 'ghost'. */
export type ButtonVariant = "solid" | "outline" | "ghost" | "subtle";
export type ButtonColor = "primary" | "secondary" | "destructive" | "muted";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps {
	children: ReactNode;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	fullWidth?: boolean;
	rounded?: boolean;
	isLoading?: boolean;
	disabled?: boolean;
	onPress?: () => void;
	accessibilityLabel?: string;
	/** Live-region politeness for label changes (e.g. CopyButton's copied flash). */
	accessibilityLiveRegion?: "polite" | "assertive" | "none";
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
