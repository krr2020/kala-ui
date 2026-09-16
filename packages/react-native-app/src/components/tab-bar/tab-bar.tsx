/**
 * TabBar: the bottom navigation bar. Data-driven items (the row renderer
 * stays internal), controlled selection, and the 44dp touch floor on
 * every tab. Selected state tints from theme primary so the bar restyles
 * with the active Unistyles theme.
 */
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { TabBarItemData, TabBarProps } from "./tab-bar.types";

const HEIGHT = 56;
const ICON = 22;

function TabBarItem({
	item,
	selected,
	onPress,
}: {
	item: TabBarItemData;
	selected: boolean;
	onPress: () => void;
}) {
	const { theme } = useUnistyles();
	const Icon = item.icon;
	const tint = selected ? theme.primary : theme.mutedForeground;
	return (
		<Pressable
			testID={`k-tab-bar-item-${item.value}`}
			accessibilityRole="tab"
			accessibilityLabel={item.label}
			accessibilityState={{
				selected,
				disabled: item.disabled || undefined,
			}}
			disabled={item.disabled}
			onPress={onPress}
			style={{
				flex: 1,
				minHeight: 44,
				minWidth: 44,
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
			}}
		>
			{Icon ? <Icon size={ICON} color={tint} /> : null}
			<Text numberOfLines={1} style={{ color: tint, fontSize: 11 }}>
				{item.label}
			</Text>
		</Pressable>
	);
}

export function TabBar({
	items,
	value,
	onChange,
	style,
	styles,
	testID = "k-tab-bar",
}: TabBarProps): ReactElement {
	const { theme } = useUnistyles();

	return (
		<View
			testID={testID}
			accessibilityRole="tablist"
			style={[
				{
					height: HEIGHT,
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: theme.background,
					borderTopWidth: 1,
					borderTopColor: theme.border,
					paddingHorizontal: 4,
				},
				style,
				styles?.root,
			]}
		>
			{items.map((item) => (
				<TabBarItem
					key={item.value}
					item={item}
					selected={item.value === value}
					onPress={() => onChange(item.value)}
				/>
			))}
		</View>
	);
}
