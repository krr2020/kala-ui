/**
 * Style builders for RingProgress — geometry stays in the component
 * (it depends on size/thickness per render); these are the statics.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const rootStyle = (size: number): ViewStyle => ({
	width: size,
	height: size,
	alignItems: "center",
	justifyContent: "center",
});

export const labelOverlayStyle: ViewStyle = {
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	alignItems: "center",
	justifyContent: "center",
};

export const labelTextStyle = (theme: KalaTheme) => ({
	fontSize: 14,
	color: String(theme.foreground),
});
