/**
 * Checkbox: pressable owns its surface (no native CheckBox on iOS, one
 * deterministic press target everywhere). The full row is the 44dp touch
 * floor; the 22dp box hugs the optional label at the row gap so no dead
 * space splits them. Indeterminate presses resolve to checked, matching
 * web convention.
 */

import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Check, Minus } from "../icon/glyphs";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import { box as boxStyle, label as labelStyle, root } from "./checkbox.styles";
import type { CheckboxProps } from "./checkbox.types";

export function Checkbox({
	value = false,
	onValueChange,
	disabled = false,
	hasError = false,
	label,
	isLoading = false,
	checkIcon: CheckIcon = Check,
	minusIcon: MinusIcon = Minus,
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
			<View testID="k-checkbox-wrap">
				<View
					testID="k-checkbox-box"
					style={[boxStyle(theme, active, hasError), slotStyles?.box]}
				>
					{value === true && (
						<CheckIcon
							size={14}
							color={hasError ? theme.destructive : theme.primaryForeground}
						/>
					)}
					{value === "indeterminate" && (
						<MinusIcon
							size={14}
							color={hasError ? theme.destructive : theme.primaryForeground}
						/>
					)}
				</View>
			</View>
			{label !== undefined ? (
				<RNText style={labelStyle(theme)}>{label}</RNText>
			) : null}
		</Pressable>
	);
}
