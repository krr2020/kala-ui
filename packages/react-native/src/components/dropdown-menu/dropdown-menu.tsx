/**
 * DropdownMenu: overflow-actions surface. The native counterpart of the
 * web's Radix popover menu is a bottom-sheet ActionSheet on the shared
 * Sheet engine — same surface Select uses. Action rows commit and close;
 * checkbox/radio rows toggle in place (multi-select menus stay open).
 */
import { Check } from "lucide-react-native";
import type { ComponentRef, ReactElement } from "react";
import { Fragment, useRef, useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Sheet } from "../sheet";
import { applySlot } from "../slot-styles";
import type { MenuTheme } from "./dropdown-menu.styles";
import {
	chevronStyle,
	contentStyle,
	emptyTextStyle,
	indicatorStyle,
	labelTextStyle,
	rowBase,
	rowTextStyle,
	separatorStyle,
	triggerLabelStyle,
	triggerStyle,
} from "./dropdown-menu.styles";
import type {
	DropdownMenuItem,
	DropdownMenuProps,
} from "./dropdown-menu.types";

function renderMenuItem(
	item: DropdownMenuItem,
	theme: MenuTheme,
	prefix: string,
	close: () => void,
	itemStyles?: ReturnType<typeof applySlot>,
): ReactElement {
	if (item.type === "separator") {
		return (
			<View
				key={item.key}
				testID={`${prefix}-separator`}
				style={separatorStyle(theme)}
			/>
		);
	}

	if (item.type === "label") {
		return (
			<View key={item.key} testID={`${prefix}-label`} style={rowBase}>
				<RNText
					numberOfLines={1}
					style={labelTextStyle(theme)}
				>
					{item.label}
				</RNText>
			</View>
		);
	}

	if (item.type === "checkbox" || item.type === "radio") {
		const isCheckbox = item.type === "checkbox";
		const press = () => {
			if (isCheckbox) {
				(
					item as { onCheckedChange: (checked: boolean) => void }
				).onCheckedChange(!item.checked);
			} else {
				item.onCheckedChange?.(true);
			}
		};
		return (
			<Pressable
				key={item.key}
				testID={`${prefix}-${item.type}-item`}
				accessibilityRole="button"
				accessibilityLabel={item.label}
				accessibilityState={{
					disabled: item.disabled ?? false,
					checked: item.checked,
				}}
				disabled={item.disabled ?? false}
				onPress={press}
				style={applySlot(
					{ ...rowBase, opacity: item.disabled ? 0.5 : 1 },
					itemStyles,
				)}
			>
				<View style={{ width: 16, alignItems: "center" }}>
					{item.checked ? (
						isCheckbox ? (
							<View testID="k-menu-item-indicator">
								<Check size={14} color={theme.primary} />
							</View>
						) : (
							<View
								testID="k-menu-item-indicator"
								style={indicatorStyle(theme)}
							/>
						)
					) : null}
				</View>
				<RNText
					numberOfLines={1}
					style={rowTextStyle(
						theme,
						item.disabled ? "mutedForeground" : "foreground",
					)}
				>
					{item.label}
				</RNText>
			</Pressable>
		);
	}

	return (
		<Pressable
			key={item.key}
			testID={`${prefix}-item`}
			accessibilityRole="button"
			accessibilityLabel={item.label}
			accessibilityState={{ disabled: item.disabled ?? false }}
			disabled={item.disabled ?? false}
			onPress={() => {
				item.onSelect?.();
				close();
			}}
			style={applySlot(
				{ ...rowBase, opacity: item.disabled ? 0.5 : 1 },
				itemStyles,
			)}
		>
			<RNText
				numberOfLines={1}
				style={rowTextStyle(
					theme,
					item.disabled === true
						? "mutedForeground"
						: item.destructive === true
							? "destructive"
							: "foreground",
				)}
			>
				{item.label}
			</RNText>
		</Pressable>
	);
}

export function DropdownMenu({
	items,
	triggerLabel = "More actions",
	snap,
	dismissable,
	style,
	slotStyles,
	testID = "k-dropdown-menu",
}: DropdownMenuProps): ReactElement {
	const { theme } = useUnistyles();
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<ComponentRef<typeof Pressable> | null>(null);
	const close = () => setOpen(false);
	const itemStyles = applySlot({}, slotStyles?.item);

	return (
		<Fragment>
			<Pressable
				testID={testID}
				ref={triggerRef}
				accessibilityRole="button"
				accessibilityLabel={triggerLabel}
				accessibilityState={{ expanded: open }}
				onPress={() => setOpen((prev) => !prev)}
				style={[
					triggerStyle(theme),
					applySlot(
						applySlot(applySlot({}, style), slotStyles?.root),
						slotStyles?.trigger,
					),
				]}
			>
				<RNText
					numberOfLines={1}
					style={triggerLabelStyle(theme)}
				>
					{triggerLabel}
				</RNText>
				<RNText style={chevronStyle(theme)}>▾</RNText>
			</Pressable>
			<Sheet
				open={open}
				onClose={close}
				triggerRef={triggerRef}
				snap={snap}
				dismissable={dismissable}
			>
				<View
					testID="k-dropdown-menu-content"
					style={applySlot(contentStyle, slotStyles?.content)}
				>
					{items.length === 0 ? (
						<RNText
							testID="k-dropdown-menu-empty"
							style={emptyTextStyle(theme)}
						>
							No actions
						</RNText>
					) : (
						items.map((item) =>
							renderMenuItem(item, theme, "k-dropdown-menu", close, itemStyles),
						)
					)}
				</View>
			</Sheet>
		</Fragment>
	);
}

export type { MenuTheme };
export { renderMenuItem };
