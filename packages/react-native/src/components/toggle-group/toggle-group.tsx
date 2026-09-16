/**
 * ToggleGroup: toolbar of toggles sharing one selection state. Single
 * mode is a deselectable radio set (empty string when nothing is
 * active); multiple reports arrays. Size/variant flow group→item through
 * context, and the item-level disabled gates on top of group disabled.
 */

import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { TOGGLE_FONT, toggleSurface } from "../toggle/toggle";
import type { ToggleSize, ToggleVariant } from "../toggle/toggle.types";
import type {
	ToggleGroupItemProps,
	ToggleGroupProps,
	ToggleGroupType,
} from "./toggle-group.types";

interface GroupState {
	type: ToggleGroupType;
	values: string[];
	disabled: boolean;
	size?: ToggleSize;
	variant?: ToggleVariant;
	itemStyles?: StyleProp<ViewStyle>;
	toggle: (value: string) => void;
}

const ToggleGroupContext = createContext<GroupState | null>(null);

const toValues = (value: string | string[] | undefined): string[] =>
	Array.isArray(value) ? value : value === undefined ? [] : [value];

export function ToggleGroup({
	children,
	type = "single",
	value,
	defaultValue,
	onValueChange,
	size,
	variant,
	disabled = false,
	accessibilityLabel,
	slotStyles,
	testID = "k-toggle-group",
}: ToggleGroupProps): ReactElement {
	// controlled lock: a provided value prop always wins over internal state
	const controlled = value !== undefined;
	const [internal, setInternal] = useState<string[]>(() =>
		toValues(defaultValue),
	);
	const values = controlled ? toValues(value) : internal;

	const toggle = (itemValue: string) => {
		const next =
			type === "single"
				? values[0] === itemValue
					? []
					: [itemValue]
				: values.includes(itemValue)
					? values.filter((v) => v !== itemValue)
					: [...values, itemValue];
		if (!controlled) setInternal(next);
		onValueChange?.(type === "single" ? (next[0] ?? "") : next);
	};

	return (
		<ToggleGroupContext.Provider
			value={{
				type,
				values,
				disabled,
				size,
				variant,
				itemStyles: slotStyles?.item,
				toggle,
			}}
		>
			<View
				testID={testID}
				accessibilityRole="toolbar"
				accessibilityLabel={accessibilityLabel}
				accessibilityState={disabled ? { disabled: true } : undefined}
				style={applySlot(
					{
						flexDirection: "row",
						flexWrap: "wrap",
						alignItems: "center",
						gap: 4,
					},
					slotStyles?.root,
				)}
			>
				{children}
			</View>
		</ToggleGroupContext.Provider>
	);
}

function ItemContent({
	children,
	fg,
	size,
}: {
	children: ReactNode;
	fg: string;
	size: ToggleSize;
}): ReactElement {
	return typeof children === "string" || typeof children === "number" ? (
		<RNText
			style={{ color: fg, fontSize: TOGGLE_FONT[size], fontWeight: "500" }}
		>
			{children}
		</RNText>
	) : (
		<View style={{ alignItems: "center", justifyContent: "center" }}>
			{children}
		</View>
	);
}

export function ToggleGroupItem({
	children,
	value,
	size,
	variant,
	disabled,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-toggle-group-item",
}: ToggleGroupItemProps): ReactElement {
	const group = useContext(ToggleGroupContext);
	const { theme } = useUnistyles();

	const active = group?.values.includes(value) ?? false;
	const itemDisabled = disabled === true || group?.disabled === true;
	const effSize = size ?? group?.size ?? "md";
	const effVariant = variant ?? group?.variant ?? "default";
	const look = toggleSurface({
		size: effSize,
		variant: effVariant,
		active,
		disabled: itemDisabled,
		theme,
	});

	return (
		<Pressable
			testID={testID}
			onPress={() => group?.toggle(value)}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{
				checked: active,
				disabled: itemDisabled || undefined,
			}}
			disabled={itemDisabled}
			style={applySlot(
				applySlot(applySlot(look.style, style), group?.itemStyles),
				slotStyles?.root,
			)}
		>
			<ItemContent fg={look.fg} size={effSize}>
				{children}
			</ItemContent>
		</Pressable>
	);
}
