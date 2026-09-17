import type { ViewStyle } from "react-native";

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

export function rootRow(): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		overflow: "hidden",
	};
}

export function inputField(): ViewStyle {
	return { flex: 1, minHeight: 44 };
}
