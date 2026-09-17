/**
 * Slider: the web Radix slider on native raw responders — not PanResponder,
 * because a single-pointer slider needs no gesture arbitration and the raw
 * responder protocol stays pure JS under jest. Geometry is percentage-based
 * (range fill and thumb positions), so a thumb center sits exactly on its
 * value point — including at the min/max bounds, like the web thumbs that
 * overflow the track by half a thumb. Track width is only needed to map
 * gesture x back to a value, so it lives in a ref filled by onLayout (no
 * state, no re-render dependency). The range fill spans the track start to
 * the FIRST thumb only, matching the web's single Range arm. isLoading
 * renders the web's skeleton arm.
 */

import type { ReactElement } from "react";
import { useRef, useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import * as sliderStyle from "./slider.styles";
import type { SliderProps } from "./slider.types";

const THUMB_PX = sliderStyle.THUMB_PX;
const TRACK_H = sliderStyle.TRACK_H;
const THUMB_R = sliderStyle.THUMB_R;

interface ResponderEvent {
	nativeEvent?: { locationX?: number; pageX?: number };
}

// 10 decimal places kills fp drift like 0.30000000000000004 from step math
const round = (n: number) => Number(n.toFixed(10));

export function Slider({
	value,
	defaultValue = [0],
	onValueChange,
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	isLoading = false,
	accessibilityLabel = "Slider",
	style,
	slotStyles,
	testID = "k-slider",
}: SliderProps): ReactElement {
	const { theme } = useUnistyles();
	// controlled lock: a provided value prop always wins over internal state
	const controlled = value !== undefined;
	const [internal, setInternal] = useState<number[]>(() => defaultValue);
	const values = controlled ? (value as number[]) : internal;
	// gesture-space track width; rendering never reads it (percentage geometry)
	const trackWidthRef = useRef(0);
	// active thumb index kept in a ref — a re-render between grant and move
	// must not reset it to 0 (multi-thumb drags used to snap to thumb 0)
	const activeIndexRef = useRef(0);

	const span = max - min;

	const stepTo = (raw: number): number =>
		Math.min(
			max,
			Math.max(min, round(Math.round((raw - min) / step) * step + min)),
		);

	const xToValue = (x: number): number => {
		const w = trackWidthRef.current;
		if (w <= 0) return min;
		const frac = Math.min(1, Math.max(0, x / w));
		return stepTo(min + frac * span);
	};

	const pct = (v: number): number => {
		if (span === 0) return 0;
		return Math.min(100, Math.max(0, ((v - min) / span) * 100));
	};

	const commit = (next: number[]) => {
		if (!controlled) setInternal(next);
		onValueChange?.(next);
	};

	const resolveX = (evt: ResponderEvent): number | undefined => {
		const x = evt?.nativeEvent?.locationX ?? evt?.nativeEvent?.pageX;
		return typeof x === "number" ? x : undefined;
	};

	const neighborClamp = (idx: number, v: number): number => {
		const lo = idx === 0 ? min : (values[idx - 1] ?? min);
		const hi = idx === values.length - 1 ? max : (values[idx + 1] ?? max);
		return Math.min(hi, Math.max(lo, v));
	};

	const grant = (evt: ResponderEvent) => {
		if (disabled || trackWidthRef.current <= 0 || values.length === 0) return;
		const x = resolveX(evt);
		if (x === undefined) return;
		const v = xToValue(x);
		// nearest thumb wins the gesture (track press = jump the nearest thumb)
		activeIndexRef.current = values.reduce(
			(best, val, i) =>
				Math.abs(v - val) < Math.abs(v - (values[best] ?? v)) ? i : best,
			0,
		);
		const next = [...values];
		next[activeIndexRef.current] = neighborClamp(activeIndexRef.current, v);
		commit(next);
	};

	const move = (evt: ResponderEvent) => {
		if (disabled || trackWidthRef.current <= 0 || values.length === 0) return;
		const x = resolveX(evt);
		if (x === undefined) return;
		const next = [...values];
		next[activeIndexRef.current] = neighborClamp(
			activeIndexRef.current,
			xToValue(x),
		);
		commit(next);
	};

	const adjust = (idx: number, direction: number) => {
		if (disabled || values.length === 0) return;
		const cur = values[idx] ?? min;
		const next = [...values];
		next[idx] = neighborClamp(idx, round(cur + direction * step));
		if (next[idx] !== cur) commit(next);
	};

	if (isLoading) {
		return (
			<View
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				style={[{ width: "100%", paddingVertical: 16 }, style]}
			>
				<Skeleton style={{ height: TRACK_H, borderRadius: TRACK_H / 2 }} />
				<Skeleton
					variant="circle"
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						width: THUMB_PX,
						height: THUMB_PX,
						transform: [{ translateX: -THUMB_R }, { translateY: -THUMB_R }],
					}}
				/>
			</View>
		);
	}

	const first = values[0];

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			style={applySlot(
				applySlot({ opacity: disabled ? 0.5 : 1 }, style),
				slotStyles?.root,
			)}
		>
			<View
				testID="k-slider-track"
				onLayout={(e) => {
					const w = e?.nativeEvent?.layout?.width ?? 0;
					if (w > 0) trackWidthRef.current = w;
				}}
				onStartShouldSetResponder={() => !disabled}
				onResponderGrant={grant}
				onResponderMove={move}
				style={applySlot(sliderStyle.track(theme), slotStyles?.track)}
			>
				<View
					testID="k-slider-range"
					accessibilityElementsHidden={true}
					style={applySlot(
						sliderStyle.range(theme, first === undefined ? 0 : pct(first)),
						slotStyles?.range,
					)}
				/>
				{values.map((v, i) => {
					return (
						<View
							// biome-ignore lint/suspicious/noArrayIndexKey: thumb identity is its slot — values change every drag frame, so value keys would remount thumbs mid-gesture
							key={i}
							testID="k-slider-thumb"
							accessibilityRole="adjustable"
							accessibilityLabel={accessibilityLabel}
							accessibilityValue={{ min, max, now: v }}
							accessibilityState={{ disabled: disabled || undefined }}
							accessibilityActions={[
								{ name: "increment" },
								{ name: "decrement" },
							]}
						onAccessibilityAction={(e) => {
							const action = e.nativeEvent.actionName;
							if (action === "increment") adjust(i, 1);
							else if (action === "decrement") adjust(i, -1);
						}}
						hitSlop={sliderStyle.THUMB_HIT_SLOP}
						style={applySlot(
							sliderStyle.thumb(theme, pct(v)),
							slotStyles?.thumb,
						)}
						/>
					);
				})}
			</View>
		</View>
	);
}
