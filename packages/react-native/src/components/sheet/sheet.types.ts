import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type SheetSnap = "auto" | "peek" | "half" | "full";

export interface SheetProps {
	open: boolean;
	onClose: () => void;
	snap?: SheetSnap;
	/** caps snap="auto" content height (px); defaults to 85% of the window */
	maxHeight?: number;
	/** renders a header row above the content; no title means no header */
	title?: string;
	/** pinned below the body — stays visible while scrollable content moves
	 * and above the software keyboard */
	footer?: ReactNode;
	/** shows the header close icon (forced off when dismissable=false) */
	showClose?: boolean;
	/** false blocks overlay-press dismissal (back/escape paths still fire) */
	dismissable?: boolean;
	/** wraps children in a ScrollView so long bodies scroll; off keeps
	 * fixed-content behavior (Dialog/AlertDialog default) */
	scrollable?: boolean;
	/** slides above the software keyboard — picker search fields need it */
	avoidKeyboard?: boolean;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		overlay?: StyleProp<ViewStyle>;
		content?: StyleProp<ViewStyle>;
		grabber?: StyleProp<ViewStyle>;
		title?: StyleProp<ViewStyle>;
	};
	children: ReactNode;
}

export interface SheetBodyProps {
	children: ReactNode;
	/** Slot overrides for the body column. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
}
