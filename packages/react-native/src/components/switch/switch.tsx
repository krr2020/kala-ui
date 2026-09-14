/**
 * Switch: pressable owns the touch surface with a 44dp floor; the visible
 * track is smaller and centered. Unchecked track maps to theme.input — the
 * same token web's bg-input uses. Thumb travel derives from track geometry
 * (track − thumb − 2× inset), no magic offsets.
 */
import type { ReactElement } from "react";
import { Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { SwitchProps } from "./switch.types";

const TRACK_W = 40;
const TRACK_H = 24;
const THUMB = 20;
const INSET = 2;
const THUMB_TRAVEL = TRACK_W - THUMB - 2 * INSET;

export function Switch({
	value = false,
	onValueChange,
	disabled = false,
	accessibilityLabel,
	style,
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
				{
					minWidth: 44,
					minHeight: 44,
					alignItems: "center",
					justifyContent: "center",
					opacity: disabled ? 0.5 : 1,
				},
				style,
			]}
		>
			<View
				testID="k-switch-track"
				style={{
					width: TRACK_W,
					height: TRACK_H,
					borderRadius: TRACK_H / 2,
					backgroundColor: value ? theme.primary : theme.input,
					padding: INSET,
					alignItems: "flex-start",
					justifyContent: "center",
				}}
			>
				<View
					testID="k-switch-thumb"
					style={{
						width: THUMB,
						height: THUMB,
						borderRadius: THUMB / 2,
						backgroundColor: theme.card,
						transform: [{ translateX: value ? THUMB_TRAVEL : 0 }],
					}}
				/>
			</View>
		</Pressable>
	);
}
