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
import type { IconProps } from "./icon.types";

const SIZE_PX = {
	xs: 14,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
} as const;

export function Icon({
	icon: Component,
	size = "md",
	color = "foreground",
	label,
	styles,
	testID = "k-icon",
}: IconProps): ReactElement {
	const { theme } = useUnistyles();
	const resolved = theme[color as keyof typeof theme] ?? color;

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
			<Component size={SIZE_PX[size]} color={String(resolved)} />
		</View>
	);
}
