import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	labelOverlayStyle,
	labelTextStyle,
	rootStyle,
} from "./ring-progress.styles";
import type {
	RingProgressProps,
	RingProgressSection,
	RingTone,
} from "./ring-progress.types";

/**
 * RingProgress: SVG arc ring. Web passes tailwind color classes; here
 * color/emptyColor are tone names resolved through the unistyles theme,
 * so the ring re-tints with dark mode like every other surface.
 */
export function RingProgress({
	value,
	size = 120,
	thickness = 12,
	color = "primary",
	emptyColor = "input",
	label,
	roundCaps = true,
	sections,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-ring-progress",
}: RingProgressProps): ReactElement {
	const { theme } = useUnistyles();

	const radius = Math.max(0, (size - thickness) / 2);
	const circumference = radius * 2 * Math.PI;

	const segments: RingProgressSection[] =
		sections ?? (value !== undefined ? [{ value, color }] : []);
	let accumulated = 0;

	const total = segments.reduce(
		(sum, segment) => sum + Math.min(Math.max(segment.value, 0), 100),
		0,
	);

	return (
		<View
			testID={testID}
			// one a11y element so role=progressbar + value are announced
			accessible={true}
			accessibilityRole="progressbar"
			accessibilityLabel={accessibilityLabel}
			accessibilityValue={{
				min: 0,
				max: 100,
				now: Math.min(100, Math.round(total)),
			}}
			style={[
				rootStyle(size),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			<Svg width={size} height={size}>
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={String(theme[emptyColor satisfies RingTone])}
					strokeWidth={thickness}
				/>
				{segments.map((segment, index) => {
					const segmentValue = Math.min(Math.max(segment.value, 0), 100);
					const offset = circumference - (segmentValue / 100) * circumference;
					const rotation = (accumulated / 100) * 360;
					accumulated += segmentValue;
					return (
						<Circle
							// biome-ignore lint/suspicious/noArrayIndexKey: segment order is the identity
							key={index}
							cx={size / 2}
							cy={size / 2}
							r={radius}
							fill="none"
							stroke={String(theme[segment.color ?? color])}
							strokeWidth={thickness}
							strokeDasharray={`${circumference} ${circumference}`}
							strokeDashoffset={offset}
							strokeLinecap={roundCaps ? "round" : "butt"}
							transform={`rotate(${rotation - 90} ${size / 2} ${size / 2})`}
						/>
					);
				})}
			</Svg>
			{label ? (
				<View
					testID="k-ring-progress-label"
					style={[
						labelOverlayStyle,
						applySlot({}, slotStyles?.label),
					]}
				>
					{typeof label === "string" || typeof label === "number" ? (
								<RNText style={labelTextStyle(theme)}>
								{label}
							</RNText>
					) : (
						label
					)}
				</View>
			) : null}
		</View>
	);
}

