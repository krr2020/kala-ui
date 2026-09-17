/**
 * Card root: themed surface container. Compound parts live in their own
 * files. Runs of consecutive media children (image + overlay) share one
 * clip wrapper so overflow hidden never shears the Android elevation
 * shadow or the card anatomy.
 */
import type { ReactElement, ReactNode } from "react";
import { Children } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { hasMediaChild, isMedia } from "./card.shared";
import { body, CLIP, CLIP_TOP, GAP, surface } from "./card.styles";
import type { CardProps } from "./card.types";
import { CardImage } from "./card-image";
import { CardSkeletonStack } from "./card-skeleton";

/**
 * Wrap each run of consecutive media children in its own clip View.
 * A run with no flow-sized media (overlay-only) is emitted unwrapped —
 * a clip View holding only absolutely-positioned children collapses
 * to zero height and would render nothing.
 */
function groupMedia(children: ReactNode): ReactNode {
	const out: ReactNode[] = [];
	let run: ReactNode[] = [];
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
				<View testID="k-card-clip" style={CLIP} key={`clip-${out.length}`}>
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
	// A clip that ends the card keeps its bottom corners rounded; a
	// clip with anatomy below it goes square so the media meets the next
	// part flush.
	const last = out[out.length - 1];
	const isClip = (node: ReactNode) =>
		!!node &&
		typeof node === "object" &&
		"props" in node &&
		(node as { props?: { testID?: string } }).props?.testID === "k-card-clip";
	if (!isClip(last)) {
		for (let i = 0; i < out.length; i++) {
			if (isClip(out[i])) {
				const clipChildren = (
					out[i] as React.ReactElement<{ children: ReactNode }>
				).props.children;
				out[i] = (
					<View testID="k-card-clip" style={CLIP_TOP} key={`clip-${i}`}>
						{clipChildren}
					</View>
				);
			}
		}
	}
	return out;
}

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
		!isLoading && (typeof content === "string" || typeof content === "number");
	const inner = bare ? <RNText style={body(theme)}>{content}</RNText> : content;
	const laidOut: ReactNode = hasMediaChild(content)
		? groupMedia(content)
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
