/**
 * Icon: the single sanctioned way to render vector icons from kala-ui.
 * Wraps lucide-react-native so apps never import it directly — a future
 * icon-set swap stays a one-file change (see REACT-NATIVE-STRATEGY.md).
 * Sizes are tokens, never raw px; color accepts a theme token key or a
 * raw string.
 */
import type { LucideIcon } from "lucide-react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { KalaTheme } from "../../types";

const SIZE_PX = {
	xs: 14,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
} as const;

export interface IconProps {
	/** lucide icon component, e.g. `Sun` from lucide-react-native */
	icon: LucideIcon;
	size?: keyof typeof SIZE_PX;
	/** theme token key (`'primary'`) or any raw color string */
	color?: keyof KalaTheme | (string & {});
	/** when set, the icon joins the accessibility tree as an image */
	label?: string;
	testID?: string;
}

export function Icon({
	icon: Component,
	size = "md",
	color = "foreground",
	label,
	testID = "k-icon",
}: IconProps): ReactElement {
	const { theme } = useUnistyles();
	const themeMap = theme as unknown as Record<string, string | number>;
	const resolved = themeMap[color as string] ?? color;

	return (
		<View
			testID={testID}
			collapsable={false}
			accessible={label ? true : undefined}
			accessibilityRole={label ? "image" : undefined}
			accessibilityLabel={label}
			accessibilityElementsHidden={label ? undefined : true}
		>
			<Component size={SIZE_PX[size]} color={String(resolved)} />
		</View>
	);
}
