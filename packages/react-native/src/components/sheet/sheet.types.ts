import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type SheetSnap = "peek" | "half" | "full";

export interface SheetProps {
	open: boolean;
	onClose: () => void;
	snap?: SheetSnap;
	/** false blocks overlay-press dismissal (back/escape paths still fire) */
	dismissable?: boolean;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		overlay?: StyleProp<ViewStyle>;
		content?: StyleProp<ViewStyle>;
		grabber?: StyleProp<ViewStyle>;
	};
	children: ReactNode;
}

export interface SheetBodyProps {
	children: ReactNode;
	/** Slot overrides for the body column. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
}
