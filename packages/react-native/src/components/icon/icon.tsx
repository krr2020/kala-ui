/**
 * Icon: the single sanctioned way to render vector icons from kala-ui.
 * Wraps lucide-react-native so apps never import it directly — a future
 * icon-set swap stays a one-file change (see REACT-NATIVE-STRATEGY.md).
 * Sizes are tokens, never raw px; color accepts a theme token key or a
 * raw string.
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { ICON_SIZE_PX, iconColor } from "./icon.styles";
import type { IconProps } from "./icon.types";

export function Icon({
	icon: Component,
	size = "md",
	color = "foreground",
	label,
	styles,
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
			style={applySlot({}, styles?.root)}
		>
			<Component size={ICON_SIZE_PX[size]} color={iconColor(theme, color)} />
		</View>
	);
}
