import type { TextStyle, ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import { surfaceBorder, surfaceFill } from "../input-surface.styles";

export interface FieldOptions {
	hasError?: boolean;
	hasSuccess?: boolean;
	disabled?: boolean;
	focused?: boolean;
}

export function field(theme: KalaTheme, opts: FieldOptions = {}): TextStyle {
	return {
		minHeight: 44,
		backgroundColor: surfaceFill(theme, opts),
		color: theme.foreground,
		fontSize: 14,
		paddingHorizontal: tokens.space.controlPx,
		borderWidth: 1,
		borderRadius: tokens.radius.input,
		borderColor: surfaceBorder(theme, opts),
		opacity: opts.disabled ? 0.5 : 1,
	};
}

// Inside a sectioned group the chrome (border, fill, padding) belongs to
// the group; the input keeps only typography + height and flexes between
// the sections.
export function fieldInGroup(theme: KalaTheme): TextStyle {
	return {
		flex: 1,
		minHeight: 44,
		color: theme.foreground,
		fontSize: 14,
	};
}

export function group(theme: KalaTheme, opts: FieldOptions = {}): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: tokens.radius.input,
		borderColor: surfaceBorder(theme, opts),
		backgroundColor: surfaceFill(theme, opts),
		opacity: opts.disabled ? 0.5 : 1,
	};
}

export function sectionText(theme: KalaTheme): TextStyle {
	return { fontSize: 14, color: theme.foreground };
}
