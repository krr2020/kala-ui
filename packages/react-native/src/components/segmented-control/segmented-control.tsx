/**
 * SegmentedControl: the web ARIA radiogroup pattern on native — the track is
 * a radiogroup container, each segment a radio with checked/disabled state.
 * The web's framer-motion sliding indicator becomes an absolutely-positioned
 * themed surface inside the active segment (no shared-layout animation dep).
 */
import { useState } from "react";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type {
	SegmentedControlData,
	SegmentedControlItem,
	SegmentedControlProps,
	SegmentedControlRadius,
	SegmentedControlSize,
} from "./segmented-control.types";

const FONT: Record<SegmentedControlSize, number> = {
	xs: 11,
	sm: 13,
	md: 14,
	lg: 16,
	xl: 18,
};

const HEIGHT: Record<SegmentedControlSize, number> = {
	xs: 32,
	sm: 36,
	md: 40,
	lg: 48,
	xl: 56,
};

const RADIUS: Record<SegmentedControlRadius, number> = {
	xs: 4,
	sm: 6,
	md: 8,
	lg: 12,
	xl: 16,
	full: 999,
};

const resolveItem = (data: SegmentedControlData): SegmentedControlItem =>
	typeof data === "string" ? { value: data, label: data } : data;

export function SegmentedControl({
	data,
	value,
	defaultValue,
	onValueChange,
	disabled,
	fullWidth,
	size = "sm",
	radius = "sm",
	accessibilityLabel,
	styles,
	testID = "k-segmented",
}: SegmentedControlProps): ReactElement {
	const { theme } = useUnistyles();
	const items = data.map(resolveItem);
	// controlled lock: a provided value prop always wins over internal state
	const controlled = value !== undefined;
	const [internal, setInternal] = useState<string>(
		() => defaultValue ?? items[0]?.value ?? "",
	);
	const active = controlled ? (value as string) : internal;
	const select = (next: string) => {
		if (!controlled) setInternal(next);
		onValueChange?.(next);
	};

	const height = Math.max(HEIGHT[size], 44);

	return (
		<View
			testID={testID}
			accessible={true}
			accessibilityRole="radiogroup"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={disabled ? { disabled: true } : undefined}
			style={applySlot(
				{
					flexDirection: "row",
					alignSelf: fullWidth ? "stretch" : "flex-start",
					backgroundColor: theme.muted,
					padding: 4,
					borderRadius: RADIUS[radius],
					opacity: disabled ? 0.6 : 1,
				},
				styles?.root,
			)}
		>
			{items.map((item) => {
				const isActive = item.value === active;
				const itemDisabled = disabled === true || item.disabled === true;
				return (
					<Pressable
						key={item.value}
						testID="k-segment"
						accessibilityRole="radio"
						accessibilityLabel={item.label}
						accessibilityState={{ checked: isActive, disabled: itemDisabled }}
						disabled={itemDisabled}
						onPress={() => select(item.value)}
						style={applySlot(
							{
								minHeight: 44,
								height,
								minWidth: 70,
								flex: fullWidth ? 1 : undefined,
								alignItems: "center",
								justifyContent: "center",
								paddingHorizontal: 12,
								borderRadius: RADIUS[radius],
							},
							styles?.segment,
						)}
					>
						{isActive && (
							<View
								testID="k-segment-indicator"
								style={applySlot(
									{
										position: "absolute",
										top: 0,
										bottom: 0,
										left: 0,
										right: 0,
										backgroundColor: theme.background,
										borderRadius: RADIUS[radius],
									},
									styles?.indicator,
								)}
							/>
						)}
						<RNText
							style={{
								color: isActive ? theme.foreground : theme.mutedForeground,
								fontSize: FONT[size],
								fontWeight: "500",
							}}
						>
							{item.label}
						</RNText>
					</Pressable>
				);
			})}
		</View>
	);
}
