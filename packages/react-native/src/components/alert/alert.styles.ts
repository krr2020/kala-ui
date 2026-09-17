/**
 * Non-component wiring for Alert: the per-color status icons and the
 * variant × color token mapping.
 */
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info,
} from "lucide-react-native";
import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme, ThemeToken } from "../../types";
import type { AlertColor, AlertVariant } from "./alert.types";

export const ICONS: Record<AlertColor, typeof Info> = {
	primary: Info,
	secondary: Info,
	destructive: AlertCircle,
	success: CheckCircle2,
	warning: AlertTriangle,
	info: Info,
	muted: Info,
};

/** Root surface: look() colors plus the row layout table. */
export function rootStyle(
	bg: string,
	border: string,
	outline: boolean,
): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 10,
		padding: 12,
		borderRadius: 8,
		backgroundColor: bg,
		borderColor: border,
		borderWidth: outline ? 1 : 0,
	};
}

export const bodyStyle: ViewStyle = { flex: 1, gap: 2 };

export const plainTextStyle = (fg: string): TextStyle => ({
	color: fg,
	fontSize: 14,
});

export const titleStyle = (fg: string): TextStyle => ({
	color: fg,
	fontSize: 15,
	fontWeight: "600",
});

export const descriptionStyle = (fg: string): TextStyle => ({
	color: fg,
	fontSize: 14,
	fontWeight: "400",
});

export const dismissStyle: ViewStyle = { padding: 2, opacity: 0.8 };

/** Same mapping the web config uses — 'muted' borrows accent/mutedForeground. */
export function look(
	variant: AlertVariant,
	color: AlertColor,
	theme: KalaTheme,
): { bg: string; fg: string; border: string } {
	const hex = (key: ThemeToken) => String(theme[key]);
	if (variant === "outline") {
		const tint = color === "muted" ? hex("mutedForeground") : hex(color);
		return { bg: "transparent", fg: tint, border: tint };
	}
	if (variant === "subtle") {
		if (color === "muted") {
			return {
				bg: hex("muted"),
				fg: hex("mutedForeground"),
				border: "transparent",
			};
		}
		const tint = hex(color);
		return { bg: `${tint}1A`, fg: tint, border: "transparent" };
	}
	// solid
	const base = color === "muted" ? "accent" : color;
	return {
		bg: hex(base),
		fg: hex(`${base}Foreground`),
		border: "transparent",
	};
}
