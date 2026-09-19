/**
 * Badge: web vocabulary (variant × color × shape) on RN views. 'muted'
 * mirrors the web mapping — solid borrows accent, outline/subtle use
 * mutedForeground — and subtle tints via #RRGGBBAA hex alpha (10% ≈ "1A")
 * since RN has no `bg-color/10` shorthand. String/number children wrap in
 * themed text (raw strings cannot render inside a View); empty or absent
 * children render an empty pill — hiding on empty is Indicator's job.
 */
import type { ReactElement, ReactNode } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { look, RADIUS } from "./badge.styles";
import type { BadgeProps } from "./badge.types";

const isTextual = (children: ReactNode): children is string | number =>
	typeof children === "string" || typeof children === "number";

export function Badge({
	children,
	variant = "solid",
	color = "primary",
	shape = "rounded",
	numberOfLines,
	style,
	slotStyles,
	testID = "k-badge",
}: BadgeProps): ReactElement {
	const { theme } = useUnistyles();
	const { bg, fg, border, borderWidth } = look(variant, color, theme);

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
					borderWidth,
				},
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{isTextual(children) ? (
				<RNText
					numberOfLines={numberOfLines}
					style={{
						color: fg,
						fontSize: 12,
						lineHeight: 16,
						fontWeight: "500",
						includeFontPadding: false,
					}}
				>
					{children}
				</RNText>
			) : (
				children
			)}
		</View>
	);
}
