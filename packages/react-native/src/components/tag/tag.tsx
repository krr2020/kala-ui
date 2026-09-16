/**
 * Tag: web vocabulary (variant × color × size + optional remove) on RN
 * views. The color mapping mirrors the web compoundVariants exactly (same
 * borrow rules as Badge): 'muted' has no ramp of its own — solid borrows
 * accent, outline/subtle use mutedForeground — and subtle tints via
 * #RRGGBBAA hex alpha (10% ≈ "1A"). The remove affordance is a full 44dp
 * pressable pulled in with negative margins so the chip stays compact.
 */

import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Icon } from "../icon";
import { applySlot } from "../slot-styles";
import type { TagColor, TagProps, TagSize, TagVariant } from "./tag.types";

interface KalaThemeShape {
	[key: string]: string | number;
}

const FONT: Record<TagSize, number> = { sm: 12, md: 14, lg: 16 };
const PAD_H: Record<TagSize, number> = { sm: 8, md: 10, lg: 12 };
const PAD_V: Record<TagSize, number> = { sm: 2, md: 4, lg: 6 };

/** 'muted' has no ramp of its own — same borrow the web config makes. */
function look(
	variant: TagVariant,
	color: TagColor,
	theme: KalaThemeShape,
): { bg: string; fg: string; border: string } {
	const hex = (key: string) => String(theme[key]);
	const tint = color === "muted" ? hex("mutedForeground") : hex(color);
	if (variant === "outline") {
		return { bg: "transparent", fg: tint, border: tint };
	}
	if (variant === "subtle") {
		if (color === "muted") {
			return { bg: hex("muted"), fg: tint, border: "transparent" };
		}
		return { bg: `${tint}1A`, fg: tint, border: "transparent" };
	}
	// solid: muted borrows the accent pair
	const base = color === "muted" ? "accent" : color;
	return {
		bg: hex(base),
		fg: hex(`${base}Foreground`),
		border: "transparent",
	};
}

export function Tag({
	variant = "subtle",
	color = "muted",
	size = "md",
	onRemove,
	icon,
	children,
	styles,
	testID = "k-tag",
}: TagProps): ReactElement {
	const { theme } = useUnistyles();
	const { bg, fg, border } = look(variant, color, theme as KalaThemeShape);

	return (
		<View
			testID={testID}
			style={applySlot(
				{
					flexDirection: "row",
					alignItems: "center",
					alignSelf: "flex-start",
					gap: 4,
					paddingHorizontal: PAD_H[size],
					paddingVertical: PAD_V[size],
					borderRadius: 999,
					backgroundColor: bg,
					borderWidth: variant === "outline" ? 1 : 0,
					borderColor: border,
				},
				styles?.root,
			)}
		>
			{icon}
			{children !== undefined && children !== null && (
				<RNText style={{ color: fg, fontSize: FONT[size], fontWeight: "500" }}>
					{children}
				</RNText>
			)}
			{onRemove && (
				<Pressable
					testID="k-tag-remove"
					accessibilityRole="button"
					accessibilityLabel="Remove"
					onPress={onRemove}
					style={applySlot(
						{
							minWidth: 44,
							minHeight: 44,
							marginHorizontal: -12,
							marginVertical: -14,
							alignItems: "center",
							justifyContent: "center",
						},
						styles?.remove,
					)}
				>
					<Icon icon={X} size="xs" color={fg} />
				</Pressable>
			)}
		</View>
	);
}
