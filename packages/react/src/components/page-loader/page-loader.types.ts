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
