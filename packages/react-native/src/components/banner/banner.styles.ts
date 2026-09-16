/**
 * Non-component wiring for Banner: skeleton defaults, the solid-tone
 * token pair, and fixed/static positioning.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme, RampBase } from "../../types";
import type {
	BannerColor,
	BannerPosition,
	BannerSkeletonConfig,
} from "./banner.types";

export const DEFAULT_SKELETON: Required<BannerSkeletonConfig> = {
	showIcon: true,
	showCloseButton: true,
};

export function tone(
	color: BannerColor,
	theme: KalaTheme,
): {
	bg: string;
	fg: string;
} {
	return {
		bg: theme[color as RampBase],
		fg: theme[`${color as RampBase}Foreground`],
	};
}

export function positionStyle(position: BannerPosition): ViewStyle {
	return position === "fixed"
		? { position: "absolute", top: 0, left: 0, right: 0, elevation: 4 }
		: { position: "relative" };
}
