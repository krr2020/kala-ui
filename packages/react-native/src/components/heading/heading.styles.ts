/**
 * Non-component wiring for Heading: the token-backed h1–h6 font ramp,
 * weight and align maps, and the tracking-tight letterspacing.
 */
import type { TextStyle } from "react-native";
import { tokens } from "../../tokens";
import type { HeadingAlign, HeadingSize, HeadingWeight } from "./heading.types";

export const FONT_SIZE: Record<HeadingSize, number> = {
	h1: tokens.size.font["4xl"],
	h2: tokens.size.font["3xl"],
	h3: tokens.size.font["2xl"],
	h4: tokens.size.font.xl,
	h5: tokens.size.font.lg,
	h6: tokens.size.font.md,
};

export const FONT_WEIGHT: Record<HeadingWeight, TextStyle["fontWeight"]> = {
	default: 700,
	medium: 500,
	semibold: 600,
	extrabold: 800,
};

export const ALIGN: Record<HeadingAlign, "left" | "center" | "right"> = {
	left: "left",
	center: "center",
	right: "right",
};

/** tracking-tight, in dp */
export const TRACKING_TIGHT = -0.5;
