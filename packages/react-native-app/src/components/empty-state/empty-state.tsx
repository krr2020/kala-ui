/**
 * EmptyState: the web icon/title/description/action composition on a themed
 * dashed surface. The icon circle is decorative (hidden from a11y); the root
 * announces as a summary labelled with the title, and the action is a
 * 44dp-floor pressable. isLoading swaps the body for skeleton rows.
 */

import { Inbox } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "@kala-ui/react-native";
import { Icon } from "@kala-ui/react-native";
import { Skeleton } from "@kala-ui/react-native";
import { applySlot } from "@kala-ui/react-native";
import {
	descriptionStyle,
	iconCircleStyle,
	surfaceStyle,
	titleStyle,
} from "./empty-state.styles";
import type { EmptyStateIcon, EmptyStateProps } from "./empty-state.types";

export function EmptyState({
	icon,
	title,
	description,
	action,
	color = "default",
	size = "md",
	isLoading = false,
	children,
	accessibilityLabel,
	slotStyles,
	testID = "k-empty-state",
}: EmptyStateProps): ReactElement {
	const { theme } = useUnistyles();
	const surface = surfaceStyle(size, color, theme);

	if (isLoading) {
		return (
			<View testID={testID} style={applySlot(surface, slotStyles?.root)}>
				<Skeleton
					animated={false}
					variant="circle"
					style={{ width: 64, height: 64 }}
				/>
				<Skeleton
					animated={false}
					style={{ width: 140, height: 14, marginTop: 16 }}
				/>
				<Skeleton
					animated={false}
					style={{ width: 200, height: 12, marginTop: 8 }}
				/>
			</View>
		);
	}

	const IconComponent: EmptyStateIcon = icon ?? Inbox;

	return (
		<View
			testID={testID}
			accessible={true}
			accessibilityRole="summary"
			accessibilityLabel={accessibilityLabel ?? title}
			style={applySlot(surface, slotStyles?.root)}
		>
			<View
				testID="k-empty-state-icon"
				accessibilityElementsHidden={true}
				style={applySlot(iconCircleStyle(theme), slotStyles?.icon)}
			>
				<Icon icon={IconComponent} size="xl" color={theme.mutedForeground} />
			</View>
			<RNText
				testID="k-empty-state-title"
				style={applySlot(titleStyle(theme), slotStyles?.title)}
			>
				{title}
			</RNText>
			{description !== undefined && (
				<RNText
					testID="k-empty-state-description"
					style={applySlot(descriptionStyle(theme), slotStyles?.description)}
				>
					{description}
				</RNText>
			)}
			{action && (
				<Pressable
					testID="k-empty-state-action"
					accessibilityRole="button"
					accessibilityLabel={action.label}
					onPress={action.onPress}
					style={applySlot(
						{
							minHeight: 44,
							paddingHorizontal: 16,
							borderRadius: tokens.radius.control,
							backgroundColor: theme.primary,
							alignItems: "center",
							justifyContent: "center",
						},
						slotStyles?.action,
					)}
				>
					<RNText
						style={{
							color: theme.primaryForeground,
							fontSize: 14,
							fontWeight: "600",
						}}
					>
						{action.label}
					</RNText>
				</Pressable>
			)}
			{children}
		</View>
	);
}
