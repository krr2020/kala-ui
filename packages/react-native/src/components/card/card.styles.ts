/**
 * Non-component wiring for Card: variant surfaces, part style tables,
 * and the marker palette mapping. Pure mapping helpers take the theme
 * as a parameter so components stay the only thing in card.tsx.
 */
import type {
	DimensionValue,
	ImageStyle,
	TextStyle,
	ViewStyle,
} from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import type {
	CardMarkerColor,
	CardMarkerPosition,
	CardMarkerVariant,
	CardPadding,
	CardVariant,
} from "./card.types";

export const PADDING: Record<CardPadding, number> = {
	none: 0,
	md: tokens.space.cardPad,
};

/** Inner spacing between stacked parts / bare children. */
export const GAP = 8;

/** hex → #RRGGBBAA; non-hex colors pass through untouched. */
export function withAlpha(hex: string, alpha: number): string {
	if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
	const byte = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
		.toString(16)
		.padStart(2, "0");
	return `${hex}${byte}`;
}

export function surface(
	theme: KalaTheme,
	variant: CardVariant,
	padding: CardPadding,
): ViewStyle {
	const base: ViewStyle = {
		backgroundColor: theme.card,
		borderRadius: tokens.radius.card,
		padding: PADDING[padding],
	};
	if (variant === "elevated") {
		return {
			...base,
			borderWidth: 0,
			shadowColor: theme.shadowColor,
			shadowOpacity: 0.12,
			shadowRadius: 8,
			shadowOffset: { width: 0, height: 2 },
			elevation: 3,
		};
	}
	if (variant === "outlined") {
		return { ...base, borderWidth: 1, borderColor: theme.borderStrong };
	}
	return {
		...base,
		borderWidth: 1,
		borderColor: withAlpha(theme.border, theme.cardBorderAlpha),
	};
}

/**
 * Media children force this inner clip wrapper instead of overflow on
 * the root — overflow hidden would shear off Android elevation shadows.
 */
export const CLIP: ViewStyle = {
	overflow: "hidden",
	borderRadius: tokens.radius.card,
};

export const HEADER: ViewStyle = {
	padding: tokens.space.cardPad,
	gap: 6,
};

export function title(theme: KalaTheme): TextStyle {
	return {
		fontSize: tokens.size.font.lg,
		fontWeight: "600",
		color: theme.cardForeground,
	};
}

export function subtitle(theme: KalaTheme): TextStyle {
	return {
		fontSize: tokens.size.font.sm,
		fontWeight: "500",
		color: theme.mutedForeground,
	};
}

export function description(theme: KalaTheme): TextStyle {
	return {
		fontSize: tokens.size.font.sm,
		color: theme.mutedForeground,
	};
}

export function body(theme: KalaTheme): TextStyle {
	return {
		fontSize: tokens.size.font.sm,
		color: theme.cardForeground,
	};
}

export const CONTENT: ViewStyle = {
	padding: tokens.space.cardPad,
	paddingTop: 0,
};

export function footer(theme: KalaTheme): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		gap: GAP,
		borderTopWidth: 1,
		borderTopColor: theme.separator,
		paddingHorizontal: tokens.space.cardPad,
		paddingVertical: 16,
	};
}

export function action(): ViewStyle {
	return { marginLeft: "auto" };
}

export const IMAGE: ImageStyle = {
	width: "100%",
	aspectRatio: 16 / 9,
};

export const OVERLAY: ViewStyle = {
	position: "absolute",
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	justifyContent: "flex-end",
	padding: tokens.space.cardPad,
};

export const MARKER_POSITION: Record<CardMarkerPosition, ViewStyle> = {
	"top-left": { position: "absolute", top: GAP, left: GAP },
	"top-right": { position: "absolute", top: GAP, right: GAP },
	"bottom-left": { position: "absolute", bottom: GAP, left: GAP },
	"bottom-right": { position: "absolute", bottom: GAP, right: GAP },
};

export function markerShape(variant: CardMarkerVariant): ViewStyle {
	if (variant === "icon") {
		return {
			width: 44,
			height: 44,
			borderRadius: 999,
			alignItems: "center",
			justifyContent: "center",
		};
	}
	return {
		alignSelf: "flex-start",
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 4,
	};
}

export function markerText(foreground: string): TextStyle {
	return {
		fontSize: tokens.size.font.xs,
		fontWeight: "600",
		color: foreground,
	};
}

/**
 * Semantic marker palette. Themes are not required to define every
 * semantic ramp — a missing key degrades to the inverted muted chip.
 */
export function markerColors(
	theme: KalaTheme,
	color: CardMarkerColor,
): { background: string; foreground: string } {
	const muted = { background: theme.cardForeground, foreground: theme.card };
	const ramps: Record<Exclude<CardMarkerColor, "muted">, [string, string]> = {
		primary: [theme.primary, theme.primaryForeground],
		secondary: [theme.secondary, theme.secondaryForeground],
		destructive: [theme.destructive, theme.destructiveForeground],
		success: [theme.success, theme.successForeground],
		warning: [theme.warning, theme.warningForeground],
		info: [theme.info, theme.infoForeground],
	};
	if (color === "muted") return muted;
	const [background, foreground] = ramps[color];
	return background && foreground ? { background, foreground } : muted;
}

/** Fixed skeleton geometry for the isLoading arm. */
export const SKELETON_AVATAR = 40;

export const SKELETON_ROWS: {
	key: string;
	width: DimensionValue;
	height: number;
}[] = [
	{ key: "title", width: "60%", height: 16 },
	{ key: "line-1", width: "100%", height: 12 },
	{ key: "line-2", width: "80%", height: 12 },
];
