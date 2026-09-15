/**
 * RadioGroup: controlled single-select list — no Radix on native, so the
 * group owns the selected value via context and each item is a pressable
 * radio with its own surface (Checkbox precedent: pressable owns the
 * 44dp touch floor). The container constrains nothing beyond direction.
 */
import { createContext, useContext } from "react";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type {
	RadioGroupItemProps,
	RadioGroupProps,
} from "./radio-group.types";

const CIRCLE = 22;
const DOT = 12;

interface RadioGroupState {
	value?: string;
	groupDisabled: boolean;
	select: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupState | null>(null);

export function RadioGroup({
	value,
	onValueChange,
	disabled = false,
	accessibilityLabel,
	children,
	style,
	testID = "k-radio-group",
}: RadioGroupProps): ReactElement {
	const state: RadioGroupState = {
		value,
		groupDisabled: disabled,
		select: (next) => onValueChange?.(next),
	};
	return (
		<RadioGroupContext.Provider value={state}>
			<View
				testID={testID}
				// announce the group itself so screen readers name the set
				accessible={true}
				accessibilityRole="radiogroup"
				accessibilityLabel={accessibilityLabel}
				style={[
					{ flexDirection: "column", gap: 4, alignSelf: "flex-start" },
					style,
				]}
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
	accessibilityLabel,
	style,
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
			accessibilityLabel={accessibilityLabel ?? label}
			accessibilityState={{ checked, disabled: isDisabled || undefined }}
			style={[
				{
					minWidth: 44,
					minHeight: 44,
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
					opacity: isDisabled ? 0.5 : 1,
				},
				style,
			]}
		>
			<View
				testID={`${testID}-circle`}
				style={{
					width: CIRCLE,
					height: CIRCLE,
					borderRadius: 999,
					borderWidth: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: checked ? theme.primary : theme.card,
					borderColor: checked ? theme.primary : theme.border,
				}}
			>
				{checked ? (
					<View
						testID={`${testID}-dot`}
						style={{
							width: DOT,
							height: DOT,
							borderRadius: 999,
							backgroundColor: theme.primaryForeground,
						}}
					/>
				) : null}
			</View>
			{label !== undefined || description !== undefined ? (
				<View style={{ gap: 1 }}>
					{label !== undefined ? (
						<RNText style={{ color: theme.foreground, fontSize: 15 }}>
							{label}
						</RNText>
					) : null}
					{description !== undefined ? (
						<RNText
							style={{ color: theme.mutedForeground, fontSize: 13 }}
						>
							{description}
						</RNText>
					) : null}
				</View>
			) : null}
		</Pressable>
	);
}

RadioGroup.Item = RadioGroupItem;
