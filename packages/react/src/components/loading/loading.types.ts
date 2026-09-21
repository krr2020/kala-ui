import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface PageLoaderProps {
	ref?: React.Ref<HTMLDivElement>;
	/** Loading message displayed under the spinner */
	message?: string;
	className?: string;
	style?: React.CSSProperties;
	slotStyles?: SlotStyles;
}

export interface SectionLoaderProps {
	ref?: React.Ref<HTMLDivElement>;
	/** Loading message displayed under the spinner */
	message?: string;
	className?: string;
	/** Minimum height for the loading container */
	minHeight?: string;
	style?: React.CSSProperties;
	slotStyles?: SlotStyles;
}
