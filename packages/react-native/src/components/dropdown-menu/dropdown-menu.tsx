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
import type {
	DropdownMenuItem,
	DropdownMenuProps,
} from "./dropdown-menu.types";

interface MenuTheme {
	foreground: string;
	mutedForeground: string;
	primary: string;
	destructive: string;
	separator: string;
	card: string;
	border: string;
}

function renderMenuItem(
	item: DropdownMenuItem,
	theme: MenuTheme,
	prefix: string,
	close: () => void,
	itemStyles?: ReturnType<typeof applySlot>,
): ReactElement {
	const rowBase = {
		minHeight: 44,
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
	};

	if (item.type === "separator") {
		return (
			<View
				key={item.key}
				testID={`${prefix}-separator`}
				style={{ height: 1, backgroundColor: theme.separator }}
			/>
		);
	}

	if (item.type === "label") {
		return (
			<View key={item.key} testID={`${prefix}-label`} style={rowBase}>
				<RNText
					numberOfLines={1}
					style={{
						fontSize: 12,
						fontWeight: "600",
						color: theme.mutedForeground,
					}}
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
								style={{
									width: 8,
									height: 8,
									borderRadius: 4,
									backgroundColor: theme.primary,
								}}
							/>
						)
					) : null}
				</View>
				<RNText
					numberOfLines={1}
					style={{
						flex: 1,
						fontSize: 14,
						color: item.disabled ? theme.mutedForeground : theme.foreground,
					}}
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
				style={{
					flex: 1,
					fontSize: 14,
					color:
						item.disabled === true
							? theme.mutedForeground
							: item.destructive === true
								? theme.destructive
								: theme.foreground,
				}}
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
					{
						minHeight: 36,
						flexDirection: "row",
						alignItems: "center",
						gap: 6,
						paddingHorizontal: 12,
						borderWidth: 1,
						borderRadius: 8,
						borderColor: theme.border,
						backgroundColor: theme.card,
					},
					applySlot(
						applySlot(applySlot({}, style), slotStyles?.root),
						slotStyles?.trigger,
					),
				]}
			>
				<RNText
					numberOfLines={1}
					style={{ fontSize: 14, color: theme.foreground }}
				>
					{triggerLabel}
				</RNText>
				<RNText style={{ fontSize: 12, color: theme.mutedForeground }}>
					▾
				</RNText>
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
					style={applySlot({ gap: 2 }, slotStyles?.content)}
				>
					{items.length === 0 ? (
						<RNText
							testID="k-dropdown-menu-empty"
							style={{ fontSize: 14, color: theme.mutedForeground }}
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
