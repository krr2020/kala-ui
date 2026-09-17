/**
 * RadioGroup: controlled single-select list — no Radix on native, so the
 * group owns the selected value via context and each item is a pressable
 * radio with its own surface (Checkbox precedent: pressable owns the
 * 44dp touch floor). The container keeps the web-standard gap; the active
 * dot is the standard half-circle mark inside the primary fill.
 */

import type { ReactElement } from "react";
import { createContext, useContext } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useUncontrolled } from "../../lib/use-uncontrolled.utils";
import { applySlot } from "../slot-styles";
import {
	body as bodyStyle,
	circle as circleStyle,
	description as descriptionStyle,
	dot as dotStyle,
	item as itemStyle,
	label as labelStyle,
	root as rootStyle,
} from "./radio-group.styles";
import type { RadioGroupItemProps, RadioGroupProps } from "./radio-group.types";

interface RadioGroupState {
	value?: string;
	groupDisabled: boolean;
	select: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupState | null>(null);

export function RadioGroup({
	value,
	defaultValue,
	onValueChange,
	disabled = false,
	accessibilityLabel,
	children,
	style,
	slotStyles,
	testID = "k-radio-group",
}: RadioGroupProps): ReactElement {
	const [current, setCurrent] = useUncontrolled<string | undefined>(
		value,
		defaultValue,
	);
	const state: RadioGroupState = {
		value: current,
		groupDisabled: disabled,
		select: (next) => {
			// re-selecting the checked item is a no-op — radios don't unselect
			if (next === current) return;
			setCurrent(next);
			onValueChange?.(next);
		},
	};
	return (
		<RadioGroupContext.Provider value={state}>
			<View
				testID={testID}
				// announce the group itself so screen readers name the set
				accessible={true}
				accessibilityRole="radiogroup"
				accessibilityLabel={accessibilityLabel}
				style={applySlot(applySlot(rootStyle(), style), slotStyles?.root)}
			>
				{children}
			</View>
		</RadioGroupContext.Provider>
	);
}

function RadioGroupItem({
	value,
	label,
	description,
	disabled = false,
	hasError = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-radio-item",
}: RadioGroupItemProps): ReactElement {
	const { theme } = useUnistyles();
	const group = useContext(RadioGroupContext);
	if (!group) {
		throw new Error("RadioGroup.Item must be rendered inside <RadioGroup>");
	}
	const isDisabled = disabled || group.groupDisabled;
	const checked = group.value === value;

	return (
		<Pressable
			testID={testID}
			onPress={() => {
				if (!isDisabled) group.select(value);
			}}
			accessibilityRole="radio"
			accessibilityLabel={
				accessibilityLabel ??
				[label, description].filter(Boolean).join(", ")
			}
			accessibilityState={{ checked, disabled: isDisabled || undefined }}
			style={applySlot(
				applySlot(itemStyle(isDisabled), style),
				slotStyles?.root,
			)}
		>
			<View
				testID={`${testID}-circle`}
				style={circleStyle(theme, checked, hasError)}
			>
				{checked ? (
					<View
						testID={`${testID}-dot`}
						style={dotStyle(theme, hasError)}
					/>
				) : null}
			</View>
			{label !== undefined || description !== undefined ? (
				<View style={bodyStyle()}>
					{label !== undefined ? (
						<RNText style={labelStyle(theme)}>{label}</RNText>
					) : null}
					{description !== undefined ? (
						<RNText style={descriptionStyle(theme)}>{description}</RNText>
					) : null}
				</View>
			) : null}
		</Pressable>
	);
}

RadioGroup.Item = RadioGroupItem;
