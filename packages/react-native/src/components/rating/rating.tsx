/**
 * Rating: the web star input on native pressables. Empty stars are the muted
 * foreground at low alpha; fills borrow theme.warning like the web's
 * `text-warning`. RN has no clip-path: the half star is a 50%-width
 * overflow window over a full-size filled star. allowHalf presses read the
 * press locationX (left half → N-0.5); a missing location falls back to the
 * whole star. Both arms announce one summary — interactive stars are hidden
 * from the a11y tree and the root exposes increment/decrement actions.
 */

import { Star } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { emptyStarColor, root, starHit } from "./rating.styles";
import type { RatingProps, RatingSize } from "./rating.types";

const STAR_PX: Record<RatingSize, number> = { sm: 16, md: 20, lg: 28 };

interface PressSource {
	locationX?: number;
	nativeEvent?: { locationX?: number };
}

type Fill = "full" | "half" | "empty";

export function Rating({
	value,
	defaultValue = 0,
	onValueChange,
	count = 5,
	allowHalf = false,
	readOnly = false,
	disabled = false,
	size = "md",
	accessibilityLabel = "Rating",
	style,
	slotStyles,
	testID = "k-rating",
}: RatingProps): ReactElement {
	const { theme } = useUnistyles();
	// controlled lock: a provided value prop always wins over internal state;
	// non-finite values (NaN) degrade to 0 so the control can still clear
	const controlled = value !== undefined;
	const [internal, setInternal] = useState(() => defaultValue);
	const active = controlled && Number.isFinite(value)
		? (value as number)
		: controlled
			? 0
			: internal;
	const px = STAR_PX[size];
	const emptyColor = emptyStarColor(theme.mutedForeground);
	const fillColor = theme.warning;

	const commit = (next: number) => {
		if (!controlled) setInternal(next);
		onValueChange?.(next);
	};

	const press = (source: PressSource, star: number) => {
		if (readOnly || disabled) return;
		let next = star;
		if (allowHalf) {
			const x = source?.locationX ?? source?.nativeEvent?.locationX;
			next = typeof x === "number" && x < px / 2 ? star - 0.5 : star;
		}
		// toggle off when the same value is pressed again
		commit(next === active ? 0 : next);
	};

	const adjust = (delta: number) => {
		if (readOnly || disabled) return;
		const step = allowHalf ? 0.5 : 1;
		const next = Math.min(count, Math.max(0, active + delta * step));
		commit(next);
	};

	const fillFor = (star: number): Fill => {
		if (active >= star) return "full";
		if (allowHalf && active >= star - 0.5) return "half";
		return "empty";
	};

	const starVisual = (star: number) => {
		const fill = fillFor(star);
		return (
			<View style={{ width: px, height: px }}>
				<Star size={px} color={emptyColor} />
				{fill !== "empty" && (
					<View
						testID={fill === "half" ? "k-rating-star-half" : undefined}
						style={
							fill === "half"
								? {
										position: "absolute",
										top: 0,
										left: 0,
										width: "50%",
										height: px,
										overflow: "hidden",
									}
								: {
										position: "absolute",
										top: 0,
										left: 0,
										width: px,
										height: px,
									}
						}
					>
						<Star size={px} color={fillColor} />
					</View>
				)}
			</View>
		);
	};

	const stars = Array.from({ length: count }, (_, i) => i + 1).map((star) => (
		<View key={star} style={{ justifyContent: "center" }}>
			{starVisual(star)}
		</View>
	));

	if (readOnly) {
		return (
			<View
				testID={testID}
				accessible={true}
				accessibilityRole="image"
				accessibilityLabel={`${accessibilityLabel}: ${active} out of ${count} stars`}
				style={applySlot(
					applySlot([{ flexDirection: "row", alignItems: "center" }], style),
					slotStyles?.root,
				)}
			>
				{stars.map((star, i) => (
				<View
					// biome-ignore lint/suspicious/noArrayIndexKey: star identity is its slot
					key={i}
					testID="k-rating-star"
					accessibilityElementsHidden={true}
					style={{ justifyContent: "center" }}
				>
					{star}
				</View>
			))}
			</View>
		);
	}

	return (
		<View
			testID={testID}
			accessibilityLabel={`${accessibilityLabel}, ${active} of ${count}`}
			accessibilityActions={[
				{ name: "increment", label: "Increase rating" },
				{ name: "decrement", label: "Decrease rating" },
			]}
			onAccessibilityAction={(event) => {
				if (event.nativeEvent.actionName === "increment") adjust(1);
				if (event.nativeEvent.actionName === "decrement") adjust(-1);
			}}
			style={applySlot(
				applySlot([root(disabled)], style),
				slotStyles?.root,
			)}
		>
			{Array.from({ length: count }, (_, i) => {
				const star = i + 1;
				return (
					<Pressable
						key={star}
						testID="k-rating-star"
						accessibilityRole="button"
						accessibilityLabel={`${star} star${star !== 1 ? "s" : ""}`}
						accessibilityState={{
							selected: active >= star,
							disabled: disabled || undefined,
						}}
						disabled={disabled}
						onPress={(event) => press(event, star)}
						style={applySlot(starHit(), slotStyles?.star)}
					>
						{starVisual(star)}
					</Pressable>
				);
			})}
		</View>
	);
}
