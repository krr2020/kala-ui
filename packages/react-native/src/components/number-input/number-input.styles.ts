import type { ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import { surfaceBorder, surfaceFill } from "../input-surface.styles";

export const HEIGHTS = { sm: 36, md: 44 } as const;

export function stepperRow(disabled: boolean, pressed: boolean): ViewStyle {
	return {
		minHeight: 44,
		minWidth: 40,
		alignItems: "center",
		justifyContent: "center",
		opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
	};
}

export function rootRow(
	theme: KalaTheme,
	opts: { hasError?: boolean; hasSuccess?: boolean; disabled?: boolean } = {},
): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: tokens.radius.input,
		overflow: "hidden",
		borderColor: surfaceBorder(theme, opts),
		backgroundColor: surfaceFill(theme, opts),
	};
}

export function divider(theme: KalaTheme): ViewStyle {
	return { width: 1, alignSelf: "stretch", backgroundColor: theme.separator };
}

export function inputField(): ViewStyle {
	return { flex: 1, minHeight: 44 };
}
