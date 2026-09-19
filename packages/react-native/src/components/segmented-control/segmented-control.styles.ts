import type {
	SegmentedControlRadius,
	SegmentedControlSize,
} from "./segmented-control.types";

export const SEGMENT_FONT: Record<SegmentedControlSize, number> = {
	xs: 11,
	sm: 13,
	md: 14,
	lg: 16,
	xl: 18,
};

export const SEGMENT_HEIGHT: Record<SegmentedControlSize, number> = {
	xs: 32,
	sm: 36,
	md: 40,
	lg: 48,
	xl: 56,
};

export const SEGMENT_RADIUS: Record<SegmentedControlRadius, number> = {
	xs: 4,
	sm: 6,
	md: 8,
	lg: 12,
	xl: 16,
	full: 999,
};

/** Inset between the track's outer radius and the active segment surface. */
export const SEGMENT_TRACK_PADDING = 4;

/**
 * Sizes below the 44dp touch floor keep their visual height and grow only
 * their vertical press area — never sideways, so adjacent segments cannot
 * steal each other's taps.
 */
export function segmentHitSlop(
	height: number,
): { top: number; bottom: number; left: number; right: number } {
	const overflow = Math.max(0, (44 - height) / 2);
	return { top: overflow, bottom: overflow, left: 0, right: 0 };
}

/**
 * The active segment surface sits inside the track's padding, so it needs a
 * tighter corner than the track itself or its points poke past the track's
 * rounded edge.
 */
export function segmentIndicatorRadius(radius: SegmentedControlRadius): number {
	if (radius === "full") return 999;
	return Math.max(SEGMENT_RADIUS[radius] - SEGMENT_TRACK_PADDING, 2);
}
