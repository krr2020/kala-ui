import type { TextStyle, ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import { surfaceBorder } from "../input-surface.styles";

export function field(
	theme: KalaTheme,
	opts: { hasError?: boolean; disabled?: boolean; focused?: boolean } = {},
): TextStyle {
	return {
		minHeight: 44,
		backgroundColor: theme.input,
		color: theme.foreground,
		fontSize: 14,
		paddingHorizontal: tokens.space.controlPx,
		borderWidth: 1,
		borderRadius: tokens.radius.input,
		borderColor: surfaceBorder(theme, opts),
		opacity: opts.disabled ? 0.5 : 1,
	};
}

export function group(
	theme: KalaTheme,
	opts: { hasError?: boolean; disabled?: boolean; focused?: boolean } = {},
): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: tokens.radius.input,
		borderColor: surfaceBorder(theme, opts),
		opacity: opts.disabled ? 0.5 : 1,
	};
}

export function sectionText(theme: KalaTheme): TextStyle {
	return { fontSize: 14, color: theme.foreground };
}
