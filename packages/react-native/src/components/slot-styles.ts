/**
 * Slot-style overrides: every component accepts `styles={{ root: {...},
 * <part>: {...} }}` keyed by its marker parts. Precedence is uniform:
 * library defaults → slot entry (slots win); on the root the legacy
 * `style` prop still works but sits BELOW styles.root, so the per-part
 * hatch stays the finest grain.
 */
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

export type SlotStyle = ViewStyle | TextStyle;

export interface SlotStyles {
	root?: StyleProp<ViewStyle>;
	[key: string]: StyleProp<SlotStyle> | undefined;
}

/**
 * Merge one part's library base with its slot entry. Returns an ordered
 * style array — the slot last so it overrides the base on conflict. The
 * return takes the SLOT's style kind, so an ImageStyle slot (Avatar) or
 * TextStyle slot stays assignable to its host's exact style prop.
 */
export function applySlot<
	B extends StyleProp<ViewStyle> | StyleProp<TextStyle> | StyleProp<ImageStyle>,
	S extends ViewStyle | TextStyle | ImageStyle,
>(base: B, slot?: StyleProp<S>): StyleProp<S> {
	if (slot === undefined || slot === null) return base as StyleProp<S>;
	if (Array.isArray(base)) return [...base, slot] as StyleProp<S>;
	return [base, slot] as StyleProp<S>;
}
