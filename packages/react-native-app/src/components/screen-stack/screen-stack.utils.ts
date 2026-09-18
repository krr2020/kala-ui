import type {
	ScreenStackEntry,
	ScreenStackPresentation,
} from "./screen-stack.types";

export type StackTransition =
	| { type: "init" }
	| { type: "none" }
	| { type: "push"; key: string }
	| { type: "pop"; entry: ScreenStackEntry }
	| { type: "replace"; from: ScreenStackEntry; to: ScreenStackEntry }
	| { type: "reset" };

export type EnterOffset =
	| { axis: "x"; start: number }
	| { axis: "y"; start: number }
	| { axis: "scale" };

/**
 * Offscreen start for an entering screen, by presentation: the edge it
 * slides from (sign = which side of the resting position), or the
 * dialog-style centered scale path. "none" and reduced motion skip this.
 */
export function enterOffsetFor(
	presentation: ScreenStackPresentation,
	distance: number,
): EnterOffset | null {
	switch (presentation) {
		case "push":
			return { axis: "x", start: distance };
		case "left":
			return { axis: "x", start: -distance };
		case "modal":
			return { axis: "y", start: distance };
		case "top":
			return { axis: "y", start: -distance };
		case "center":
			return { axis: "scale" };
		default:
			return null;
	}
}

/**
 * Throws when two entries share a key — stack identity is the diffing
 * contract, so duplicates are a programming error, not a fallback case.
 */
export function assertUniqueKeys(entries: ScreenStackEntry[]): void {
	const seen = new Set<string>();
	for (const entry of entries) {
		if (seen.has(entry.key)) {
			throw new Error(
				`ScreenStack entries have a duplicate key: "${entry.key}"`,
			);
		}
		seen.add(entry.key);
	}
}

const commonPrefixLength = (
	prev: ScreenStackEntry[],
	next: ScreenStackEntry[],
): number => {
	let i = 0;
	while (i < prev.length && i < next.length && prev[i].key === next[i].key) {
		i++;
	}
	return i;
};

/**
 * Classifies how `next` differs from `prev`. Same array instance or equal
 * keys → "none"; longer → push; one shorter with a matching prefix → pop;
 * same length with only the top changed → replace; anything else (changed
 * root, reorder, multi-pop) → reset.
 */
export function diffStack(
	prev: ScreenStackEntry[],
	next: ScreenStackEntry[],
): StackTransition {
	if (prev === next) return { type: "none" };
	if (prev.length === 0) return { type: "init" };

	const common = commonPrefixLength(prev, next);
	if (next.length === prev.length && common === prev.length) {
		return { type: "none" };
	}
	if (next.length === prev.length + 1 && common === prev.length) {
		return { type: "push", key: next[next.length - 1].key };
	}
	if (next.length === prev.length - 1 && common === next.length) {
		return { type: "pop", entry: prev[prev.length - 1] };
	}
	if (next.length === prev.length && common === prev.length - 1) {
		return {
			type: "replace",
			from: prev[prev.length - 1],
			to: next[next.length - 1],
		};
	}
	return { type: "reset" };
}
