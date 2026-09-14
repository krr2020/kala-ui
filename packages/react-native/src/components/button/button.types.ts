import type { ReactNode } from "react";

export type ButtonVariant = "solid" | "outline" | "ghost" | "subtle" | "link";
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
	testID?: string;
}
