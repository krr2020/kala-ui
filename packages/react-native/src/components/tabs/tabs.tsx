import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import type { ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Badge } from "../badge";
import { Icon } from "../icon";
import { Indicator } from "../indicator";
import { applySlot } from "../slot-styles";
import {
	resolveTabsVariant,
	tabsBadgeColor,
	tabsBadgeVariant,
	tabsDotColor,
	tabsIconColor,
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
			// the dot is an absolute-positioned zero-size overlay pinned to the
			// tab's top-right corner; a flex wrapper would zero the row's
			// intrinsic width and collapse the label
			const overlayStyle: ViewStyle = {
				position: "absolute",
				top: 6,
				right: 6,
				width: 0,
				height: 0,
			};
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
						<Indicator
							size={8}
							offset={4}
							color={tabsDotColor(onActivePill)}
							disabled={item.indicator !== true}
							slotStyles={{ root: overlayStyle }}
						/>
							<View
								testID="k-tab-row"
								style={{
									alignSelf: "stretch",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									gap: 6,
								}}
							>
							{item.icon !== undefined && (
								<Icon
									icon={item.icon}
										size="sm"
										color={tabsIconColor({ look, selected })}
									/>
							)}
							<RNText
								numberOfLines={2}
								ellipsizeMode="tail"
								style={tabsTabTextStyle({ look, selected, theme })}
							>
								{item.label}
							</RNText>
							{item.badge !== undefined && (
								<Badge
									testID="k-tab-badge"
										variant={tabsBadgeVariant(onActivePill)}
										color={tabsBadgeColor(onActivePill)}
									shape="pill"
									numberOfLines={1}
									style={{ maxWidth: 72, alignSelf: "center" }}
								>
									{String(item.badge)}
								</Badge>
							)}
						</View>
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
