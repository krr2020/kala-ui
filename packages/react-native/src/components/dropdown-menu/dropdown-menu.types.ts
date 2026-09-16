import type { StyleProp, ViewStyle } from "react-native";
import type { SheetSnap } from "../sheet";

export interface DropdownMenuActionItem {
	/** absent type marks a plain action row */
	type?: undefined;
	/** stable row identity for list keys */
	key: string;
	label: string;
	destructive?: boolean;
	disabled?: boolean;
	onSelect?: () => void;
}

export interface DropdownMenuCheckboxItem {
	type: "checkbox";
	key: string;
	label: string;
	checked: boolean;
	disabled?: boolean;
	onCheckedChange: (checked: boolean) => void;
}

export interface DropdownMenuRadioItem {
	type: "radio";
	key: string;
	label: string;
	checked: boolean;
	disabled?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

export interface DropdownMenuLabelItem {
	type: "label";
	key: string;
	label: string;
}

export interface DropdownMenuSeparatorItem {
	type: "separator";
	key: string;
}

export type DropdownMenuItem =
	| DropdownMenuActionItem
	| DropdownMenuCheckboxItem
	| DropdownMenuRadioItem
	| DropdownMenuLabelItem
	| DropdownMenuSeparatorItem;

export interface DropdownMenuProps {
	items: DropdownMenuItem[];
	/** trigger copy; also the accessibilityLabel fallback */
	triggerLabel?: string;
	/** sheet snap point for the action surface; peek fits short lists */
	snap?: SheetSnap;
	/** false blocks overlay-press dismissal */
	dismissable?: boolean;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		trigger?: StyleProp<ViewStyle>;
		content?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
