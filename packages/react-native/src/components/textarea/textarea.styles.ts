import type { TextStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import { surfaceBorder, surfaceFill } from "../input-surface.styles";

export function rowsToMinHeight(rows?: number): number {
	return rows ? Math.max(80, rows * 24) : 80;
}

export function field(
	theme: KalaTheme,
	minHeight: number,
	opts: { hasError?: boolean; disabled?: boolean; focused?: boolean } = {},
): TextStyle {
	return {
		minHeight,
		backgroundColor: surfaceFill(theme, opts),
		color: theme.foreground,
		fontSize: 14,
		paddingHorizontal: tokens.space.controlPx,
		paddingVertical: 8,
		borderWidth: 1,
		borderRadius: tokens.radius.input,
		borderColor: surfaceBorder(theme, opts),
		opacity: opts.disabled ? 0.5 : 1,
	};
}
