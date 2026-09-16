/**
 * Non-component wiring for AvatarGroup: overlap geometry derived from
 * the Avatar BOX scale, plus ring/chip style builders. The ring wrapper
 * adds a 2px border on top of the avatar box so overlapping members
 * read as stacked chips.
 */
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { BOX } from "../avatar/avatar.styles";
import type { AvatarSize } from "../avatar/avatar.types";
import { applySlot } from "../slot-styles";

export const RING_WIDTH = 2;

/** Negative left margin every member after the first pulls back by. */
export const OVERLAP = -8;

/** Chip font per size — mirrors round(box/3) with a 10px floor. */
export const OVERFLOW_FONT: Record<AvatarSize, number> = {
	xs: 10,
	sm: 11,
	md: 13,
	lg: 16,
	xl: 21,
};

export function ringedFor(size: AvatarSize): number {
	return BOX[size] + RING_WIDTH * 2;
}

export function memberRing(
	ringed: number,
	borderColor: string,
): ViewStyle {
	return {
		width: ringed,
		height: ringed,
		borderRadius: ringed / 2,
		borderWidth: RING_WIDTH,
		borderColor,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
	};
}

export function memberOffset(): ViewStyle {
	return { marginLeft: OVERLAP };
}

export function overflowChip(
	ringed: number,
	background: string,
	borderColor: string,
): ViewStyle {
	return {
		width: ringed,
		height: ringed,
		borderRadius: ringed / 2,
		backgroundColor: background,
		borderWidth: RING_WIDTH,
		borderColor,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: OVERLAP,
	};
}

export function overflowText(
	size: AvatarSize,
	color: string,
): TextStyle {
	return {
		fontSize: OVERFLOW_FONT[size],
		color,
		fontWeight: "500",
	};
}

export function container(
	style?: StyleProp<ViewStyle>,
	slot?: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
	return [
		{ flexDirection: "row", alignItems: "center" },
		applySlot(applySlot({}, style), slot),
	];
}
