/**
 * Separator: one-pixel themed divider. RN has no separator role — the
 * decorative default hides it from the a11y tree (web behavior); a
 * non-decorative divider stays discoverable with an optional label.
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { SeparatorProps } from "./separator.types";

export function Separator({
	orientation = "horizontal",
	decorative = true,
	accessibilityLabel,
	style,
	styles,
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
				{
					backgroundColor: theme.separator,
					width: vertical ? 1 : "100%",
					height: vertical ? "100%" : 1,
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		/>
	);
}
