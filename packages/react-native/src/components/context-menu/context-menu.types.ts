import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { DropdownMenuItem } from "../dropdown-menu/dropdown-menu.types";
import type { SheetSnap } from "../sheet";

export interface ContextMenuProps {
	/** action rows sharing the DropdownMenu item shape */
	items: DropdownMenuItem[];
	/** the wrapped surface — long-press it to open the menu */
	children: ReactNode;
	snap?: SheetSnap;
	/** false blocks overlay-press dismissal */
	dismissable?: boolean;
	/** fires whenever the menu closes (overlay, drag, or action commit) */
	onClose?: () => void;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		content?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
