import type { ReactElement, ReactNode } from "react";
import { Text as RNText, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
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
	emptyColor = "muted",
	label,
	roundCaps = true,
	sections,
	accessibilityLabel,
	style,
	styles,
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
			accessibilityRole="progressbar"
			accessibilityLabel={accessibilityLabel}
			accessibilityValue={{
				min: 0,
				max: 100,
				now: Math.min(100, Math.round(total)),
			}}
			style={[
				{
					width: size,
					height: size,
					alignItems: "center",
					justifyContent: "center",
				},
				applySlot(applySlot({}, style), styles?.root),
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
					opacity={0.2}
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
						{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							alignItems: "center",
							justifyContent: "center",
						},
						applySlot({}, styles?.label),
					]}
				>
					{typeof label === "string" || typeof label === "number" ? (
						<RNText style={{ fontSize: 14, color: String(theme.foreground) }}>
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

export type { ReactNode as RingProgressLabel };
