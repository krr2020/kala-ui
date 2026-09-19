/**
 * SegmentedControl: the web ARIA radiogroup pattern on native — the track is
 * a radiogroup container, each segment a radio with checked/disabled state.
 * The web's framer-motion sliding indicator becomes an absolutely-positioned
 * themed surface inside the active segment (no shared-layout animation dep).
 */

import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	SEGMENT_FONT,
	SEGMENT_HEIGHT,
	SEGMENT_RADIUS,
	SEGMENT_TRACK_PADDING,
	segmentHitSlop,
	segmentIndicatorRadius,
} from "./segmented-control.styles";
import type {
	SegmentedControlData,
	SegmentedControlItem,
	SegmentedControlProps,
} from "./segmented-control.types";

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
	slotStyles,
	testID = "k-segmented",
}: SegmentedControlProps): ReactElement {
	const { theme } = useUnistyles();
	const items = data.map(resolveItem);
	// controlled lock: a provided value prop always wins over internal state,
	// even when it matches no data item (no implicit fallback to data[0])
	const controlled = value !== undefined;
	const [internal, setInternal] = useState<string>(
		() => defaultValue ?? items[0]?.value ?? "",
	);
	const active = controlled ? (value as string) : internal;
	const select = (next: string) => {
		if (!controlled) setInternal(next);
		onValueChange?.(next);
	};

	const height = SEGMENT_HEIGHT[size];
	const hitSlop = segmentHitSlop(height);

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
					padding: SEGMENT_TRACK_PADDING,
					borderRadius: SEGMENT_RADIUS[radius],
					opacity: disabled ? 0.6 : 1,
				},
				slotStyles?.root,
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
						hitSlop={hitSlop}
						style={applySlot(
							{
								height,
								minWidth: 70,
								flex: fullWidth ? 1 : undefined,
								alignItems: "center",
								justifyContent: "center",
								paddingHorizontal: 12,
								borderRadius: SEGMENT_RADIUS[radius],
							},
							slotStyles?.segment,
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
										borderRadius: segmentIndicatorRadius(radius),
									},
									slotStyles?.indicator,
								)}
							/>
						)}
						<RNText
							style={{
								color: isActive ? theme.foreground : theme.mutedForeground,
								fontSize: SEGMENT_FONT[size],
								fontWeight: isActive ? "600" : "500",
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
