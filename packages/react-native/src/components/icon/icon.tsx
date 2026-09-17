/**
 * Icon: renders the app-supplied {size, color} icon component with
 * token-sourced px, theme color resolution, and label-driven a11y
 * gating (hidden from the tree unless a label promotes it to image).
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { ICON_SIZE_PX, iconColor } from "./icon.styles";
import type { IconProps, IconSize } from "./icon.types";

// explicit wrapper dimensions keep the svg from collapsing to 0x0
// inside flex rows when the icon library sizes itself lazily
function sizeBox(size: IconSize) {
	return { width: ICON_SIZE_PX[size], height: ICON_SIZE_PX[size] };
}

export function Icon({
	icon: Component,
	size = "md",
	color = "foreground",
	label,
	slotStyles,
	testID = "k-icon",
}: IconProps): ReactElement {
	const { theme } = useUnistyles();

	return (
		<View
			testID={testID}
			collapsable={false}
			accessible={label ? true : undefined}
			accessibilityRole={label ? "image" : undefined}
			accessibilityLabel={label}
			accessibilityElementsHidden={label ? undefined : true}
			style={applySlot(sizeBox(size), slotStyles?.root)}
		>
			<Component size={ICON_SIZE_PX[size]} color={iconColor(theme, color)} />
		</View>
	);
}
