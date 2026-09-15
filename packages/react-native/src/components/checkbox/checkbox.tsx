/**
 * Checkbox: pressable owns its surface (no native CheckBox on iOS, one
 * deterministic press target everywhere). The 22dp box sits centered in a
 * 44dp touch floor; Check/Minus indicators come from lucide like the web.
 * Indeterminate presses resolve to checked, matching web convention.
 */
import type { ReactElement } from "react";
import { Check, Minus } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { CheckboxProps } from "./checkbox.types";

const BOX = 22;

export function Checkbox({
	value = false,
	onValueChange,
	disabled = false,
	accessibilityLabel,
	style,
	styles,
	testID = "k-checkbox",
}: CheckboxProps): ReactElement {
	const { theme } = useUnistyles();
	const active = value !== false;

	return (
		<Pressable
			testID={testID}
			onPress={() => {
				if (!disabled) onValueChange?.(value !== true);
			}}
			accessibilityRole="checkbox"
			accessibilityLabel={accessibilityLabel}
				accessibilityState={{
				// RN's tri-state vocabulary is "mixed", not "indeterminate"
				checked: value === "indeterminate" ? "mixed" : value,
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
				applySlot(applySlot([], style), styles?.root),
			]}
		>
			<View
				testID="k-checkbox-box"
				style={[{
					width: BOX,
					height: BOX,
					borderRadius: 6,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: active ? theme.primary : theme.card,
					borderWidth: 1,
				borderColor: active ? theme.primary : theme.border,
				},
				styles?.box,
			]}
			>
				{value === true && (
					<Check size={14} color={theme.primaryForeground} />
				)}
				{value === "indeterminate" && (
					<Minus size={14} color={theme.primaryForeground} />
				)}
			</View>
		</Pressable>
	);
}
