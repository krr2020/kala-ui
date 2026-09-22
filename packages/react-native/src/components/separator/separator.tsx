/**
 * Separator: one-pixel themed divider. RN has no separator role — the
 * decorative default hides it from the a11y tree (web behavior); a
 * non-decorative divider stays discoverable with an optional label.
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { separatorStyle } from "./separator.styles";
import type { SeparatorProps } from "./separator.types";

export function Separator({
	orientation = "horizontal",
	decorative = true,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-separator",
}: SeparatorProps): ReactElement {
	const { theme } = useUnistyles();
	const vertical = orientation === "vertical";
	return (
		<View
			testID={testID}
			accessibilityElementsHidden={decorative ? true : undefined}
			accessibilityLabel={accessibilityLabel}
			style={[
				separatorStyle(theme, vertical),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		/>
	);
}
