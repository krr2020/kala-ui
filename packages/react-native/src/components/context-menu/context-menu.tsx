/**
 * ContextMenu: long-press actions for an arbitrary surface. The web
 * right-click maps to longPress on touch; the menu itself is the shared
 * Sheet engine with DropdownMenu's row renderer, so both menus behave
 * identically once open.
 */
import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { renderMenuItem } from "../dropdown-menu/dropdown-menu";
import { Sheet } from "../sheet";
import { applySlot } from "../slot-styles";
import type { ContextMenuProps } from "./context-menu.types";

export function ContextMenu({
	items,
	children,
	snap,
	dismissable,
	onClose,
	style,
	slotStyles,
	testID = "k-context-menu",
}: ContextMenuProps): ReactElement {
	const { theme } = useUnistyles();
	const [open, setOpen] = useState(false);
	const close = () => {
		setOpen(false);
		onClose?.();
	};

	return (
		<>
			<Pressable
				testID={testID}
				onLongPress={() => setOpen(true)}
				delayLongPress={300}
				style={applySlot(
					applySlot({ alignSelf: "stretch" }, slotStyles?.root),
					style,
				)}
			>
				<View style={{ flexDirection: "row" }} testID="k-context-menu-child">
					{children}
				</View>
			</Pressable>
			<Sheet open={open} onClose={close} snap={snap} dismissable={dismissable}>
				<View
					testID="k-context-menu-content"
					style={applySlot({ gap: 2 }, slotStyles?.content)}
				>
					{items.map((item) =>
						renderMenuItem(
							item,
							theme,
							"k-context-menu",
							close,
							applySlot({}, slotStyles?.item),
						),
					)}
				</View>
			</Sheet>
		</>
	);
}
