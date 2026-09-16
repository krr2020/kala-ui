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
import { look, RADIUS } from "./badge.styles";
import type { BadgeProps } from "./badge.types";

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
	const { bg, fg, border } = look(variant, color, theme);

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
