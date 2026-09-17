/**
 * Non-component wiring for Banner: skeleton defaults, the solid-tone
 * token pair, and fixed/static positioning.
 */
import type { TextStyle, ViewStyle } from "react-native";
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

export const rootStyle = (bg: string): ViewStyle => ({
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 16,
	paddingHorizontal: 16,
	paddingVertical: 12,
	backgroundColor: bg,
});

export const contentStyle: ViewStyle = {
	flex: 1,
	flexDirection: "row",
	alignItems: "center",
	gap: 12,
};

export const plainTextStyle = (fg: string): TextStyle => ({
	color: fg,
	fontSize: 14,
	fontWeight: "500",
});

export const closeStyle: ViewStyle = { padding: 4, opacity: 0.9 };

export const skeletonRowStyle: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	gap: 12,
};

export const skeletonIconStyle: ViewStyle = { width: 16, height: 16 };

export const skeletonLineStyle: ViewStyle = {
	height: 16,
	flex: 1,
	maxWidth: 256,
};

export const skeletonCloseStyle: ViewStyle = { width: 16, height: 16 };
