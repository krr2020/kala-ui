import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	resolveTabsVariant,
	tabsBadgeStyle,
	tabsBadgeTextStyle,
	tabsDotStyle,
	tabsTabStyle,
	tabsTabTextStyle,
	tabsTrackStyle,
	tabsUnderlineStyle,
} from "./tabs.styles";
import type { TabsItem, TabsProps } from "./tabs.types";

export function Tabs({
	items,
	value,
	defaultValue,
	onValueChange,
	orientation = "horizontal",
	variant,
	children,
	accessibilityLabel,
	slotStyles,
	testID = "k-tabs",
}: TabsProps): ReactElement {
	const { theme } = useUnistyles();
	// controlled lock: a provided value prop always wins over internal state
	const controlled = value !== undefined;
	const [internal, setInternal] = useState<string>(
		() => defaultValue ?? items[0]?.value ?? "",
	);
	const active = controlled ? (value as string) : internal;
	const select = (next: string) => {
		if (!controlled) setInternal(next);
		onValueChange?.(next);
	};

	const vertical = orientation === "vertical";
	const look = resolveTabsVariant(variant);

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			style={applySlot(
				{
					flexDirection: vertical ? "row" : "column",
					gap: 16,
				},
				slotStyles?.root,
			)}
		>
			<View
				testID="k-tab-list"
				accessible={true}
				accessibilityRole="tablist"
				style={applySlot(
					tabsTrackStyle({ look, vertical, theme }),
					slotStyles?.list,
				)}
			>
				{items.map((item: TabsItem) => {
					const selected = item.value === active;
					const disabled = item.disabled === true;
					const onActivePill = look === "pill" && selected;
					// badge count rides the a11y name so screen-reader users hear the
					// pending-work signal too
					const a11yName =
						item.badge !== undefined
							? `${item.label} ${item.badge}`
							: item.label;
					return (
						<Pressable
							key={item.value}
							testID="k-tab"
							accessibilityRole="tab"
							accessibilityLabel={a11yName}
							accessibilityState={{ selected, disabled }}
							disabled={disabled}
							onPress={() => select(item.value)}
							style={applySlot(
								tabsTabStyle({ look, selected, disabled, theme }),
								slotStyles?.tab,
							)}
						>
							{look === "line" && selected && (
								<View
									testID="k-tab-indicator"
									style={applySlot(
										tabsUnderlineStyle({ theme, vertical }),
										slotStyles?.indicator,
									)}
								/>
								)}
							{item.indicator === true && (
								<View
									testID="k-tab-dot"
									style={tabsDotStyle({ onActivePill, theme })}
								/>
							)}
							<RNText style={tabsTabTextStyle({ look, selected, theme })}>
								{item.label}
							</RNText>
							{item.badge !== undefined && (
								<View
									testID="k-tab-badge"
									style={tabsBadgeStyle({ onActivePill, theme })}
								>
									<RNText
										numberOfLines={1}
										style={tabsBadgeTextStyle({ onActivePill, theme })}
									>
										{String(item.badge)}
									</RNText>
								</View>
							)}
						</Pressable>
					);
				})}
			</View>
			<View testID={`k-tab-content-${active}`} style={{ flex: 1 }}>
				{typeof children === "string" || typeof children === "number" ? (
					<RNText style={{ color: theme.foreground, fontSize: 14 }}>
						{children}
					</RNText>
				) : (
					children
				)}
			</View>
		</View>
	);
}
