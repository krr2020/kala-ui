import type { ViewStyle } from "react-native";
import type { AccordionVariant } from "./accordion.types";

/**
 * The single-mode convention treats '' as "nothing open", so controlled and
 * uncontrolled close must normalize to the same empty array.
 */
export function toValues(value: string | string[] | undefined): string[] {
	if (Array.isArray(value)) return value;
	return value ? [value] : [];
}

interface SurfaceTheme {
	card: string;
	border: string;
}

/**
 * Web parity: the default variant is a flat divided list whose LAST row
 * carries no divider (`border-b last:border-b-0`); boxed variants round,
 * separate and clip — with the 8dp gap BETWEEN items only (`space-y-2`).
 */
export function itemSurface(
	variant: AccordionVariant,
	last: boolean,
	theme: SurfaceTheme,
): ViewStyle {
	const base: ViewStyle = {
		backgroundColor: theme.card,
		borderColor: theme.border,
	};
	if (variant === "default") {
		return { ...base, ...(last ? undefined : { borderBottomWidth: 1 }) };
	}
	return {
		...base,
		borderWidth: 1,
		borderRadius: 8,
		overflow: "hidden",
		...(last ? undefined : { marginBottom: 8 }),
	};
}

export function triggerSurface(variant: AccordionVariant): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 12,
		minHeight: 44,
		paddingVertical: variant === "default" ? 16 : 14,
		...(variant !== "default" ? { paddingHorizontal: 16 } : {}),
	};
}

/** Open tint per variant: none / accent / primary (web accordion arms). */
export function openTint(variant: AccordionVariant, accent: string, primary: string): ViewStyle {
	if (variant === "bordered") return { backgroundColor: accent };
	if (variant === "filled") return { backgroundColor: primary };
	return {};
}

export function contentSurface(variant: AccordionVariant): ViewStyle {
	return {
		overflow: "hidden",
		paddingBottom: 16,
		paddingTop: variant === "default" ? 4 : 8,
		...(variant !== "default" ? { paddingHorizontal: 16 } : {}),
	};
}
