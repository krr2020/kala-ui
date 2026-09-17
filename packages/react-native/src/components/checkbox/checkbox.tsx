/**
 * Checkbox: pressable owns its surface (no native CheckBox on iOS, one
 * deterministic press target everywhere). The full row is the 44dp touch
 * floor; the 22dp box hugs the optional label at the row gap so no dead
 * space splits them. Indeterminate presses resolve to checked, matching
 * web convention.
 */

import { Check, Minus } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import { box as boxStyle, label as labelStyle, root } from "./checkbox.styles";
import type { CheckboxProps } from "./checkbox.types";

export function Checkbox({
	value = false,
	onValueChange,
	disabled = false,
	label,
	isLoading = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-checkbox",
}: CheckboxProps): ReactElement {
	const { theme } = useUnistyles();
	const active = value !== false;

	if (isLoading) {
		return (
			<Skeleton
				testID={testID}
				style={[{ width: 160, height: 24 }, style, slotStyles?.root]}
			/>
		);
	}

	return (
		<Pressable
			testID={testID}
			onPress={() => {
				if (!disabled) onValueChange?.(value !== true);
			}}
			accessibilityRole="checkbox"
			accessibilityLabel={accessibilityLabel ?? label}
			accessibilityState={{
				// RN's tri-state vocabulary is "mixed", not "indeterminate"
				checked: value === "indeterminate" ? "mixed" : value,
				disabled: disabled || undefined,
			}}
			disabled={disabled}
			style={[
				root(disabled),
				applySlot(applySlot([], style), slotStyles?.root),
			]}
		>
				<View testID="k-checkbox-wrap" style={{ alignSelf: "flex-start" }}>
					<View
						testID="k-checkbox-box"
						style={[boxStyle(theme, active), slotStyles?.box]}
					>
						{value === true && (
								<Check size={14} color={theme.primaryForeground} />
						)}
						{value === "indeterminate" && (
								<Minus size={14} color={theme.primaryForeground} />
						)}
					</View>
				</View>
			{label !== undefined ? (
				<RNText style={labelStyle(theme)}>{label}</RNText>
			) : null}
		</Pressable>
	);
}
