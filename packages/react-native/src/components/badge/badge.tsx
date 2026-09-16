/**
 * Badge: web vocabulary (variant × color × shape) on RN views. 'muted'
 * mirrors the web mapping — solid borrows accent, outline/subtle use
 * mutedForeground — and subtle tints via #RRGGBBAA hex alpha (10% ≈ "1A")
 * since RN has no `bg-color/10` shorthand. String children are wrapped in
 * themed text (raw strings cannot render inside a View).
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type {
	BadgeColor,
	BadgeProps,
	BadgeShape,
	BadgeVariant,
} from "./badge.types";

interface KalaThemeShape {
	[key: string]: string | number;
}

const RADIUS: Record<BadgeShape, number> = {
	rounded: 4,
	pill: 999,
};

/** 'muted' has no ramp of its own — same borrow the web config makes. */
const baseColor = (
	color: BadgeColor,
):
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted" => color;

function look(
	variant: BadgeVariant,
	color: BadgeColor,
	theme: KalaThemeShape,
): { bg: string; fg: string; border: string } {
	const hex = (key: string) => String(theme[key]);
	if (variant === "outline") {
		const tint =
			color === "muted" ? hex("mutedForeground") : hex(baseColor(color));
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
		const tint = hex(baseColor(color));
		return { bg: `${tint}1A`, fg: tint, border: "transparent" };
	}
	// solid
	const base = color === "muted" ? "accent" : baseColor(color);
	return {
		bg: hex(base),
		fg: hex(`${base}Foreground`),
		border: "transparent",
	};
}

export function Badge({
	children,
	variant = "solid",
	color = "primary",
	shape = "rounded",
	style,
	styles,
	testID = "k-badge",
}: BadgeProps): ReactElement {
	const { theme } = useUnistyles();
	const { bg, fg, border } = look(variant, color, theme as KalaThemeShape);

	return (
		<View
			testID={testID}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					alignSelf: "flex-start",
					paddingHorizontal: 10,
					paddingVertical: 4,
					borderRadius: RADIUS[shape],
					backgroundColor: bg,
					borderColor: border,
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: fg, fontSize: 12, fontWeight: "500" }}>
					{children}
				</RNText>
			) : (
				children
			)}
		</View>
	);
}
