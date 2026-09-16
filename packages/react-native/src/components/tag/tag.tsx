/**
 * Tag: web vocabulary (variant × color × size + optional remove) on RN
 * views. The color mapping mirrors the web compoundVariants exactly (same
 * borrow rules as Badge): 'muted' has no ramp of its own — solid borrows
 * accent, outline/subtle use mutedForeground — and subtle tints via
 * #RRGGBBAA hex alpha (10% ≈ "1A"). The remove affordance is a full 44dp
 * pressable pulled in with negative margins so the chip stays compact.
 * Icons are icon-library components, themed to the tag's own foreground
 * (iconColor hard-overrides) so a bare icon is visible in every variant.
 */

import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Icon } from "../icon";
import { applySlot } from "../slot-styles";
import { FONT, ICON_FOR_SIZE, look, PAD_H, PAD_V } from "./tag.styles";
import type { TagProps } from "./tag.types";

export function Tag({
	variant = "subtle",
	color = "muted",
	size = "md",
	onRemove,
	icon,
	iconColor,
	children,
	style,
	slotStyles,
	testID = "k-tag",
}: TagProps): ReactElement {
	const { theme } = useUnistyles();
	const { bg, fg, border } = look(variant, color, theme);

	return (
		<View
			testID={testID}
			style={applySlot(
				applySlot(
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
					style,
				),
				slotStyles?.root,
			)}
		>
			{icon && (
				<Icon icon={icon} size={ICON_FOR_SIZE[size]} color={iconColor ?? fg} />
			)}
			{children !== undefined && children !== null && (
				<RNText
					style={{
						color: fg,
						fontSize: FONT[size],
						lineHeight: FONT[size] + 4,
						fontWeight: "500",
						includeFontPadding: false,
					}}
				>
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
						slotStyles?.remove,
					)}
				>
					<Icon icon={X} size="xs" color={fg} />
				</Pressable>
			)}
		</View>
	);
}
