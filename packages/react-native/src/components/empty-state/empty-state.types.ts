import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";

/** Lucide icon component (the surface Icon's `icon` prop takes). */
export type EmptyStateIcon = LucideIcon;

export interface EmptyStateAction {
	label: string;
	onPress: () => void;
	variant?: "solid" | "outline" | "ghost" | "subtle" | "link";
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
	testID?: string;
}
