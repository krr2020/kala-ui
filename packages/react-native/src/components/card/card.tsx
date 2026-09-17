/**
 * Card root: themed surface container. Compound parts live in their own
 * files; media children get an inner clip wrapper so overflow hidden
 * never shears the Android elevation shadow or the card anatomy.
 */
import type { ReactElement, ReactNode } from "react";
import { Children } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { CLIP, GAP, body, surface } from "./card.styles";
import { CardSkeletonStack } from "./card-skeleton";
import { hasMediaChild, isMedia } from "./card.shared";
import type { CardProps } from "./card.types";

export function Card({
	children,
	variant = "flat",
	padding = "md",
	isLoading = false,
	skeleton,
	style,
	slotStyles,
	testID = "k-card",
}: CardProps): ReactElement {
	const { theme } = useUnistyles();
	const content = isLoading ? (skeleton ?? <CardSkeletonStack />) : children;
	const bare =
		!isLoading &&
		(typeof content === "string" || typeof content === "number");
	const inner = bare ? (
		<RNText style={body(theme)}>{content}</RNText>
	) : (
		content
	);
	const laidOut: ReactNode = hasMediaChild(content)
		? Children.map(content, (child) =>
				isMedia(child) ? (
					<View testID="k-card-clip" style={CLIP}>
						{child}
					</View>
				) : (
					child
				),
			)
		: inner;
	return (
		<View
			testID={testID}
			style={[
				surface(theme, variant, padding),
				{ gap: GAP },
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{laidOut}
		</View>
	);
}
