/**
 * Style tables and the strength→token color mapper for
 * PasswordStrengthIndicator.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const barColor = (strength: number, theme: KalaTheme): string =>
	strength <= 1
		? theme.destructive
		: strength === 2
			? theme.warning
			: theme.success;

export const rootStyle: ViewStyle = { marginTop: 12 };

export const labelRowStyle: ViewStyle = {
	flexDirection: "row",
	justifyContent: "space-between",
};

export const labelStyle = (theme: KalaTheme) => ({
	fontSize: 12,
	fontWeight: "500" as const,
	color: theme.mutedForeground,
});

export const barRowStyle: ViewStyle = {
	flexDirection: "row",
	gap: 8,
	marginTop: 8,
};

export const segmentStyle = (active: boolean, color: string, theme: KalaTheme) =>
	({
		flex: 1,
		height: 8,
		borderRadius: 999,
		backgroundColor: active ? color : theme.muted,
	}) as const;

export const hintStyle = (theme: KalaTheme) => ({
	fontSize: 12,
	marginTop: 8,
	color: theme.mutedForeground,
});
