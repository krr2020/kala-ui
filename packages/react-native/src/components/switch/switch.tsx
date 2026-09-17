/**
 * Switch: pressable owns the touch surface with a 44dp floor; the visible
 * track is smaller and centered. Unchecked track maps to theme.input — the
 * same token web's bg-input uses. Thumb travel derives from track geometry
 * (track − thumb − 2× inset), no magic offsets.
 */
import type { ReactElement } from "react";
import { Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	root,
	thumb as thumbStyle,
	track,
	THUMB,
	THUMB_TRAVEL,
	TRACK_H,
	TRACK_W,
} from "./switch.styles";
import type { SwitchProps } from "./switch.types";

export function Switch({
	value = false,
	onValueChange,
	disabled = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-switch",
}: SwitchProps): ReactElement {
	const { theme } = useUnistyles();

	return (
		<Pressable
			testID={testID}
			onPress={() => {
				if (!disabled) onValueChange?.(!value);
			}}
			accessibilityRole="switch"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{
				checked: value,
				disabled: disabled || undefined,
			}}
			style={[
				root(disabled),
				applySlot(applySlot([], style), slotStyles?.root),
			]}
		>
			<View
				testID="k-switch-track"
				style={[track(theme, value), slotStyles?.track]}
			>
				<View
					testID="k-switch-thumb"
					style={[thumbStyle(theme, value), slotStyles?.thumb]}
				/>
			</View>
		</Pressable>
	);
}
