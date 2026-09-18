import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text as RNText, ScrollView, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { clampTimePart, pad2 } from "../../lib/date.utils";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type { TimePickerProps, TimeValue } from "./time-picker.types";

const ITEM = 40;
const VISIBLE = 3;
const WHEEL_HEIGHT = ITEM * VISIBLE;

/**
 * TimePicker: snap-wheel time picker with the web TimeValue contract —
 * values are 24h {hours, minutes, seconds}. Wheels are ScrollViews with
 * item snapping; every row is also a Pressable so screen readers (and
 * tests) can commit without momentum.
 */
export function TimePicker({
	value: valueProp,
	defaultValue,
	onValueChange,
	hourCycle = 24,
	showSeconds = false,
	disabled = false,
	hasError = false,
	isLoading = false,
	accessibilityLabel = "Time picker",
	style,
	slotStyles,
	testID = "k-time-picker",
}: TimePickerProps): ReactElement {
	const { theme } = useUnistyles();
	const [internal, setInternal] = useState<TimeValue | undefined>(defaultValue);

	const raw = valueProp !== undefined ? valueProp : internal;
	// normalization is total: absent parts collapse to 0, out-of-range clamps
	const current: TimeValue = {
		hours: clampTimePart(raw?.hours ?? 0, 24),
		minutes: clampTimePart(raw?.minutes ?? 0, 60),
		seconds: clampTimePart(raw?.seconds ?? 0, 60),
	};

	const commit = (patch: Partial<TimeValue>): void => {
		if (disabled) return;
		const next: TimeValue = {
			hours: clampTimePart(patch.hours ?? current.hours, 24),
			minutes: clampTimePart(patch.minutes ?? current.minutes, 60),
			seconds: clampTimePart(patch.seconds ?? current.seconds ?? 0, 60),
		};
		if (valueProp === undefined) setInternal(next);
		onValueChange?.(next);
	};

	const isPM = current.hours >= 12;
	// 12h wheel: index 0 is "12", index i is hour i. 24h wheel: index i is hour i.
	const hourIndex =
		hourCycle === 12
			? current.hours % 12 === 0
				? 0
				: current.hours % 12
			: current.hours;
	const hourLabel = (i: number): string =>
		pad2(hourCycle === 12 ? (i === 0 ? 12 : i) : i);
	const commitHourIndex = (i: number): number => {
		const twelve = i === 0 ? 12 : i;
		if (hourCycle === 24) return i;
		return isPM ? (twelve % 12) + 12 : twelve % 12;
	};

	const wheelRefs = useRef(
		new Map<"hour" | "minute" | "second", ScrollView | null>(new Map()),
	);
	// controlled value changes move the wheels to the new selection
	useEffect(() => {
		const sync = (prefix: "hour" | "minute" | "second", index: number) => {
			wheelRefs.current.get(prefix)?.scrollTo({
				y: index * ITEM,
				animated: false,
			});
		};
		sync("hour", hourIndex);
		sync("minute", current.minutes);
		if (showSeconds) sync("second", current.seconds ?? 0);
	}, [hourIndex, current.minutes, current.seconds, showSeconds]);

	if (isLoading) {
		return (
			<Skeleton
				testID={testID}
				style={applySlot([{ height: 44, width: 200 }, style], slotStyles?.root)}
			/>
		);
	}

	const renderWheel = (
		prefix: "hour" | "minute" | "second",
		count: number,
		selectedIndex: number,
		labelFor: (i: number) => string,
		onPick: (i: number) => void,
	): ReactElement => (
		<View style={{ flex: 1 }}>
			<ScrollView
				testID={`k-time-picker-${prefix}`}
				ref={(node) => {
					wheelRefs.current.set(prefix, node);
				}}
				onLayout={() => {
					// initial position: the selected row centers in the window
					wheelRefs.current
						.get(prefix)
						?.scrollTo({ y: selectedIndex * ITEM, animated: false });
				}}
				onMomentumScrollEnd={(event) => {
					// a flick commits the row the wheel settled on, not just taps
					const y = event.nativeEvent.contentOffset.y;
					const index = Math.max(
						0,
						Math.min(count - 1, Math.round(y / ITEM)),
					);
					onPick(index);
				}}
				style={{ height: WHEEL_HEIGHT }}
				contentContainerStyle={{ paddingVertical: ITEM }}
				snapToInterval={ITEM}
				showsVerticalScrollIndicator={false}
			>
				{Array.from({ length: count }, (_, i) => {
					const selected = i === selectedIndex;
					return (
						<Pressable
							key={`${prefix}-${labelFor(i)}`}
							testID={`k-time-picker-${prefix}-item-${i}`}
							accessibilityRole="button"
							accessibilityLabel={labelFor(i)}
							accessibilityState={{ selected, disabled }}
							onPress={() => onPick(i)}
							style={{
								height: ITEM,
								alignItems: "center",
								justifyContent: "center",
								opacity: selected ? 1 : 0.4,
							}}
						>
							<RNText
								style={{
									color: selected ? theme.primary : theme.foreground,
									fontSize: 16,
									fontWeight: selected ? "600" : "400",
								}}
							>
								{labelFor(i)}
							</RNText>
						</Pressable>
					);
				})}
			</ScrollView>
		</View>
	);

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{ disabled }}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					borderWidth: 1,
					borderColor: hasError ? theme.destructive : theme.border,
					borderRadius: 8,
					backgroundColor: theme.background,
					paddingHorizontal: 8,
					overflow: "hidden",
				},
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{renderWheel(
				"hour",
				hourCycle === 12 ? 12 : 24,
				hourIndex,
				hourLabel,
				(i) => commit({ hours: commitHourIndex(i) }),
			)}
			{renderWheel("minute", 60, current.minutes, pad2, (i) =>
				commit({ minutes: i }),
			)}
			{showSeconds &&
				renderWheel("second", 60, current.seconds ?? 0, pad2, (i) =>
					commit({ seconds: i }),
				)}
			{hourCycle === 12 && (
				<View testID="k-time-picker-am-pm" style={{ gap: 4, paddingLeft: 8 }}>
					{(["am", "pm"] as const).map((period) => {
						const selected = period === "am" ? !isPM : isPM;
						return (
							<Pressable
								key={period}
								testID={`k-time-picker-am-pm-option-${period}`}
								accessibilityRole="button"
								accessibilityLabel={period.toUpperCase()}
								accessibilityState={{ selected, disabled }}
								onPress={() => {
									if (selected) return;
									const base = current.hours % 12;
									commit({ hours: period === "pm" ? base + 12 : base });
								}}
								style={{
									paddingVertical: 6,
									paddingHorizontal: 10,
									borderRadius: 6,
									backgroundColor: selected ? theme.primary : "transparent",
									alignItems: "center",
								}}
							>
								<RNText
									style={{
										color: selected
											? theme.primaryForeground
											: theme.foreground,
										fontSize: 12,
										fontWeight: "600",
									}}
								>
									{period.toUpperCase()}
								</RNText>
							</Pressable>
						);
					})}
				</View>
			)}
		</View>
	);
}
