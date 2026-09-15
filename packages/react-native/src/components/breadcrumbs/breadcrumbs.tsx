/**
 * Breadcrumbs: trail navigation. The web href <a> becomes a per-item
 * onPress; the last crumb is the current page — plain text, announced
 * with a "(current page)" suffix (RN has no aria-current).
 */
import { ChevronRight } from "lucide-react-native";
import type { ReactElement, ReactNode } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { BreadcrumbsProps } from "./breadcrumbs.types";

export function Breadcrumbs({
	items,
	separator,
	style,
	styles,
	testID = "k-breadcrumbs",
}: BreadcrumbsProps): ReactElement | null {
	const { theme } = useUnistyles() as unknown as {
		theme: Record<string, string>;
	};

	if (items.length === 0) return null;

	const separatorNode: ReactNode = separator ? (
		<RNText style={{ fontSize: 14, color: theme.mutedForeground }}>
			{separator}
		</RNText>
	) : (
		<ChevronRight size={14} color={theme.mutedForeground} />
	);

	return (
		<View
			testID={testID}
			accessibilityLabel="breadcrumb"
			style={applySlot(
				{
					flexDirection: "row",
					flexWrap: "wrap",
					alignItems: "center",
					gap: 8,
				},
				applySlot(style, styles?.root),
			)}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;
				const content = (
					<>
						{isLast ? (
							<RNText
								numberOfLines={1}
								style={{
									fontSize: 14,
									fontWeight: "600",
									color: theme.foreground,
								}}
							>
								{item.label}
							</RNText>
						) : (
							<RNText
								numberOfLines={1}
								style={{
									fontSize: 14,
									color: item.onPress ? theme.primary : theme.mutedForeground,
								}}
							>
								{item.label}
							</RNText>
						)}
						{!isLast ? (
							<View testID="k-breadcrumbs-separator">{separatorNode}</View>
						) : null}
					</>
				);
				const rowStyle = {
					flexDirection: "row" as const,
					alignItems: "center" as const,
					gap: 8,
				};
				if (!isLast && item.onPress) {
					return (
						<Pressable
							// biome-ignore lint/suspicious/noArrayIndexKey: crumb position in the trail is the identity
							key={`${item.label}-${index}`}
							testID="k-breadcrumbs-item"
							onPress={item.onPress}
							style={rowStyle}
						>
							{content}
						</Pressable>
					);
				}
				return (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: crumb position in the trail is the identity
						key={`${item.label}-${index}`}
						testID="k-breadcrumbs-item"
						accessibilityLabel={
							isLast ? `${item.label} (current page)` : undefined
						}
						style={rowStyle}
					>
						{content}
					</View>
				);
			})}
		</View>
	);
}
