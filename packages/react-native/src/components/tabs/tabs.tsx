import { useState } from "react";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import { applySlot } from "../slot-styles";
import type { TabsItem, TabsProps } from "./tabs.types";

export function Tabs({
	items,
	value,
	defaultValue,
	onValueChange,
	orientation = "horizontal",
	children,
	accessibilityLabel,
	styles,
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

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			style={applySlot(
				{
					flexDirection: vertical ? "row" : "column",
					gap: 16,
				},
				styles?.root,
			)}
		>
			<View
				testID="k-tab-list"
				accessible={true}
				accessibilityRole="tablist"
				style={applySlot(
					{
						flexDirection: vertical ? "column" : "row",
						gap: 4,
					},
					styles?.list,
				)}
			>
				{items.map((item: TabsItem) => {
					const selected = item.value === active;
					const disabled = item.disabled === true;
					return (
						<Pressable
							key={item.value}
							testID="k-tab"
							accessibilityRole="tab"
							accessibilityLabel={item.label}
							accessibilityState={{ selected, disabled }}
							disabled={disabled}
							onPress={() => select(item.value)}
							style={applySlot(
								{
									minHeight: 44,
									paddingHorizontal: 14,
									justifyContent: "center",
									borderRadius: tokens.radius.control,
									backgroundColor: selected ? theme.accent : "transparent",
								},
								styles?.tab,
							)}
						>
							<RNText
								style={{
									color: selected
										? theme.accentForeground
										: theme.mutedForeground,
									fontSize: 14,
									fontWeight: selected ? "600" : "500",
								}}
							>
								{item.label}
							</RNText>
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
