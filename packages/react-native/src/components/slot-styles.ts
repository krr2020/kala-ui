/**
 * Tier-3 slot styles (REACT-NATIVE-STRATEGY.md, customization ladder):
 * every component accepts `styles={{ root: {...}, <part>: {...} }}` keyed
 * by its marker parts. Precedence is uniform: library defaults → slot
 * entry (slots win); on the root the legacy `style` prop still works but
 * sits BELOW styles.root, so the per-part hatch stays the finest grain.
 */
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export type SlotStyle = ViewStyle | TextStyle;

export interface SlotStyles {
	root?: StyleProp<ViewStyle>;
	[key: string]: StyleProp<SlotStyle> | undefined;
}

/**
 * Merge one part's library base with its slot entry. Returns an ordered
 * style array — the slot last so it overrides the base on conflict.
 */
export function applySlot<
	B extends StyleProp<ViewStyle> | StyleProp<TextStyle>,
	S extends StyleProp<SlotStyle>,
>(base: B, slot: S): StyleProp<SlotStyle> {
	if (slot === undefined || slot === null) return base as StyleProp<SlotStyle>;
	if (Array.isArray(base)) return [...base, slot];
	return [base, slot];
}
