/**
 * TabBar: the bottom navigation bar. Data-driven items (the row renderer
 * stays internal), controlled selection, and the 44dp touch floor on
 * every tab. Selected state tints from theme primary so the bar restyles
 * with the active Unistyles theme.
 */
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { barStyle, ICON, itemLabelStyle, itemStyle } from "./tab-bar.styles";
import type { TabBarItemData, TabBarProps } from "./tab-bar.types";

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
			style={itemStyle}
		>
			{Icon ? <Icon size={ICON} color={tint} /> : null}
			<Text numberOfLines={1} style={itemLabelStyle(tint)}>
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
			style={[barStyle(theme), style, styles?.root]}
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
