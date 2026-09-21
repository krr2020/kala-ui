import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface TreeItem {
	id: string;
	label: string;
	children?: TreeItem[];
	icon?: React.ReactNode;
	disabled?: boolean;
}

export interface TreeViewProps
	extends Omit<React.ComponentProps<"ul">, "onSelect"> {
	/** Tree data */
	data: TreeItem[];
	/** Selected item id(s) */
	selected?: string | string[];
	/** Default expanded item ids */
	defaultExpanded?: string[];
	/** Callback when selection changes */
	onSelect?: (id: string) => void;
	/** Multi-select mode */
	multiSelect?: boolean;
	slotStyles?: SlotStyles;
}
