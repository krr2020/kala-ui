/**
 * Card root: themed surface container. Compound parts live in their own
 * files. Runs of consecutive media children (image + overlay) share one
 * clip wrapper so overflow hidden never shears the Android elevation
 * shadow or the card anatomy.
 */
import type { ReactElement, ReactNode } from "react";
import { Children, useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { hasMediaChild, isMedia } from "./card.shared";
import {
	body,
	CLIP,
	CLIP_TOP,
	GAP,
	pressedLayer,
	surface,
} from "./card.styles";
import type { CardImageProps, CardProps } from "./card.types";
import { CardImage } from "./card-image";
import { CardSkeletonStack } from "./card-skeleton";

/**
 * Wrap each run of consecutive media children in its own clip View.
 * A run with no flow-sized media (overlay-only) is emitted unwrapped —
 * a clip View holding only absolutely-positioned children collapses
 * to zero height and would render nothing. Identity checks decide run
 * membership only; the clip radius comes from the run's FIRST
 * CardImage `flush` prop, never from sibling position.
 */
function groupMedia(children: ReactNode): ReactNode {
	const out: ReactNode[] = [];
	let run: ReactNode[] = [];
	const runFlush = (): boolean => {
		const first = run.find(
			(child): child is React.ReactElement<CardImageProps> =>
				!!child &&
				typeof child === "object" &&
				"type" in child &&
				child.type === CardImage,
		);
		return !!first && first.props.flush === true;
	};
	const flush = () => {
		if (run.length === 0) return;
		const sized = run.some(
			(child) =>
				!!child &&
				typeof child === "object" &&
				"type" in child &&
				child.type === CardImage,
		);
		if (sized) {
			out.push(
				<View
					testID="k-card-clip"
					style={runFlush() ? CLIP_TOP : CLIP}
					key={`clip-${out.length}`}
				>
					{run}
				</View>,
			);
		} else {
			out.push(...run);
		}
		run = [];
	};
	Children.forEach(children, (child) => {
		if (isMedia(child)) {
			run.push(child);
		} else {
			flush();
			out.push(child);
		}
	});
	flush();
	return out;
}

export function Card({
	children,
	variant = "flat",
	padding = "md",
	isLoading = false,
	skeleton,
	onPress,
	disabled = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-card",
}: CardProps): ReactElement {
	const { theme } = useUnistyles();
	const [pressed, setPressed] = useState(false);
	const content = isLoading ? (skeleton ?? <CardSkeletonStack />) : children;
	const bare =
		!isLoading && (typeof content === "string" || typeof content === "number");
	const inner = bare ? <RNText style={body(theme)}>{content}</RNText> : content;
	const laidOut: ReactNode = hasMediaChild(content)
		? groupMedia(content)
		: inner;
	const surfaceStyle = [
		surface(theme, variant, padding),
		{ gap: GAP },
		applySlot(applySlot({}, style), slotStyles?.root),
	];
	if (!onPress) {
		return (
			<View testID={testID} style={surfaceStyle}>
				{laidOut}
			</View>
		);
	}
	const effectiveDisabled = disabled || isLoading;
	return (
		<Pressable
			testID={testID}
			onPress={() => {
				// guarded internally so disabled/loading cards can't fire even
				// when the host still delivers the event
				if (!effectiveDisabled) onPress();
			}}
			onPressIn={() => setPressed(true)}
			onPressOut={() => setPressed(false)}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={disabled ? { disabled: true } : undefined}
			disabled={effectiveDisabled}
			style={surfaceStyle}
		>
			{pressed && !effectiveDisabled && (
				<View testID="k-card-pressed" style={pressedLayer(theme)} />
			)}
			{laidOut}
		</Pressable>
	);
}
