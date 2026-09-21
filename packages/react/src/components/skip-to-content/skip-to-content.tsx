/**
 * SkipToContent Component
 * Allows keyboard users to bypass navigation and jump directly to main content
 * WCAG 2.1 AA Criterion 2.4.1 - Bypass Blocks
 */

import type * as React from "react";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";

export interface SkipToContentProps {
	/** ID of the main content element to skip to */
	targetId?: string;
	/** Custom text for the skip link */
	text?: string;
	/** Additional CSS classes */
	className?: string;
	style?: React.CSSProperties;
	slotStyles?: SlotStyles;
}

export function SkipToContent({
	targetId = "main-content",
	text = "Skip to main content",
	className,
	style,
	slotStyles: slotStylesRaw,
}: SkipToContentProps) {
	const slotStyles = useSlotStyles("skip-to-content", slotStylesRaw);
	const root = applySlot(
		cn(
			// Screen reader only by default
			"sr-only",
			// When focused, become visible
			"focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999]",
			"focus:px-4 focus:py-2 focus:rounded-md",
			"focus:bg-primary focus:text-primary-foreground",
			"kala-focus-ring",
			"focus:font-medium focus:text-sm",
			"transition-colors",
			className,
		),
		slotStyles?.root,
	);
	return (
		<a
			data-kala-component="skip-to-content"
			href={`#${targetId}`}
			style={mergeStyle(style, root.style)}
			className={root.className}
		>
			{text}
		</a>
	);
}
