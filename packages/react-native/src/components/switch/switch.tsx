/**
 * Switch: pressable owns the touch surface with a 44dp floor; the visible
 * track is smaller and centered. Unchecked track maps to theme.input — the
 * same token web's bg-input uses. Thumb travel derives from track geometry
 * (track − thumb − 2× inset), no magic offsets.
 */
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	label as labelStyle,
	root,
	thumb as thumbStyle,
	track,
	trackStroke,
	THUMB_TRAVEL,
	TRACK_H,
	TRACK_W,
} from "./switch.styles";
import type { SwitchProps } from "./switch.types";

export function Switch({
	value = false,
	onValueChange,
	disabled = false,
	label,
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
			accessibilityLabel={accessibilityLabel ?? label}
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
				{value ? null : (
					<View
						testID="k-switch-stroke"
						style={trackStroke(theme)}
					/>
				)}
				<View
					testID="k-switch-thumb"
					style={[thumbStyle(theme, value, disabled), slotStyles?.thumb]}
				/>
			</View>
			{label !== undefined ? (
				<RNText style={labelStyle(theme)}>{label}</RNText>
			) : null}
		</Pressable>
	);
}
