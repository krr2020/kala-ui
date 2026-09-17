/**
 * Shared non-surface helpers for the Card compound family. Lives apart
 * from card.tsx so every part file can import it without cycles.
 */
import type { ReactNode } from "react";
import { Children } from "react";
import { Text as RNText } from "react-native";
import type { KalaTheme } from "../../types";
import { body } from "./card.styles";
import { CardImage } from "./card-image";
import { CardImageOverlay } from "./card-image-overlay";

/** RN Views cannot host raw strings — wrap bare children in themed body text. */
export function wrapBare(children: ReactNode, theme: KalaTheme): ReactNode {
	if (typeof children === "string" || typeof children === "number") {
		return <RNText style={body(theme)}>{children}</RNText>;
	}
	return children;
}

/** True when the child element is a CardImage or CardImageOverlay. */
export function isMedia(
	child: ReactNode,
): child is React.ReactElement {
	return (
		!!child &&
		typeof child === "object" &&
		"type" in child &&
		(child.type === CardImage || child.type === CardImageOverlay)
	);
}

export function hasMediaChild(children: ReactNode): boolean {
	let media = false;
	Children.forEach(children, (child) => {
		if (isMedia(child)) media = true;
	});
	return media;
}
