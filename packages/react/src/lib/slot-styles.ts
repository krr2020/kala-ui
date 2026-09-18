/**
 * Slot-style overrides for web: every component accepts
 * `slotStyles={{ root: ..., <part>: ... }}` keyed by its marker parts.
 *
 * Precedence is uniform and mirrors the React Native package: library
 * defaults → legacy `className`/`style` → slot entry (slots win). A slot
 * value is either a Tailwind class string (merged with `cn`, slot last) or
 * an inline style object (merged via `mergeStyle`, slot keys winning) — * the two channels coexist, they never displace each other.
 */
import type { ClassValue } from "clsx";
import type * as React from "react";
import { cn } from "./utils";

export type SlotStyle = string | React.CSSProperties;

export interface SlotStyles {
	root?: SlotStyle;
	[key: string]: SlotStyle | undefined;
}

export interface AppliedSlot {
	className: string;
	style?: React.CSSProperties;
}

/**
 * Merge one part's library base with its slot entry. A string slot is
 * appended after the base classes (so tailwind-merge lets it win on
 * conflict); an object slot is returned verbatim as inline style for
 * `mergeStyle` to place above the legacy `style` prop.
 */
export function applySlot(
	base: ClassValue,
	slot?: SlotStyle | null,
): AppliedSlot {
	if (slot === undefined || slot === null) {
		return { className: cn(base) };
	}
	if (typeof slot === "string") {
		return { className: cn(base, slot) };
	}
	return { className: cn(base), style: slot };
}

/**
 * Merge the inline-style channel: slot keys override the user's `style`
 * prop per key, disjoint keys combine. `undefined` on both sides stays
 * `undefined` so components never emit an empty style attribute.
 */
export function mergeStyle(
	base: React.CSSProperties | undefined,
	slot?: React.CSSProperties | null,
): React.CSSProperties | undefined {
	if (slot === undefined || slot === null) return base;
	if (base === undefined || base === null) return slot;
	return { ...base, ...slot };
}
