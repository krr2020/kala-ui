import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type BannerColor = "info" | "warning" | "destructive" | "success";
export type BannerPosition = "fixed" | "static";

export interface BannerSkeletonConfig {
	/** render the icon block in the loading skeleton row */
	showIcon?: boolean;
	/** render the trailing skeleton block where the close button sits */
	showCloseButton?: boolean;
}

export interface BannerProps {
	children?: ReactNode;
	/** solid tone; text/icon pair with the matching *Foreground token */
	color?: BannerColor;
	/**
	 * fixed (default) maps to absolute top-0 full-width — there is no
	 * viewport-fixed position in RN, so the consumer mounts the banner
	 * in a screen-level (position: relative) container.
	 */
	position?: BannerPosition;
	onClose?: () => void;
	/**
	 * status (default) announces politely; alert announces assertively
	 */
	role?: "status" | "alert";
	/** show the skeleton row instead of children */
	isLoading?: boolean;
	skeletonConfig?: BannerSkeletonConfig;
	/** custom loading node rendered inside the toned surface */
	skeleton?: ReactNode;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: each part wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		content?: StyleProp<ViewStyle>;
		close?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
