/**
 * EmptyState: the web icon/title/description/action composition on a themed
 * dashed surface. The icon circle is decorative (hidden from a11y); the root
 * announces as a summary labelled with the title, and the action is a
 * 44dp-floor pressable. isLoading swaps the body for skeleton rows.
 */
import type { ReactElement } from "react";
import { Inbox } from "lucide-react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { Icon } from "../icon";
import { Skeleton } from "../skeleton";
import { tokens } from "../../tokens";
import type { EmptyStateIcon, EmptyStateProps } from "./empty-state.types";

const MIN_HEIGHT = { sm: 150, md: 300, lg: 500 } as const;

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
	styles,
	testID = "k-empty-state",
}: EmptyStateProps): ReactElement {
	const { theme } = useUnistyles();
	const destructive = color === "destructive";
	const surface = {
		alignItems: "center" as const,
		justifyContent: "center" as const,
		minHeight: MIN_HEIGHT[size],
		padding: size === "sm" ? 16 : 32,
		borderRadius: tokens.radius.card,
		borderWidth: 1,
		borderStyle: "dashed" as const,
		borderColor: destructive ? theme.destructive : theme.border,
		backgroundColor: destructive ? `${theme.destructive}1A` : `${theme.muted}33`,
	};

	if (isLoading) {
		return (
			<View testID={testID} style={surface}>
				<Skeleton animated={false} variant="circle" style={{ width: 64, height: 64 }} />
				<Skeleton animated={false} style={{ width: 140, height: 14, marginTop: 16 }} />
				<Skeleton animated={false} style={{ width: 200, height: 12, marginTop: 8 }} />
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
			style={applySlot(surface, styles?.root)}
		>
			<View
				testID="k-empty-state-icon"
				accessibilityElementsHidden={true}
				style={applySlot({
					width: 80,
					height: 80,
					borderRadius: 999,
					backgroundColor: theme.muted,
					alignItems: "center",
					justifyContent: "center",
				}, styles?.icon)}
			>
				<Icon icon={IconComponent} size="xl" color={theme.mutedForeground} />
			</View>
			<RNText
				testID="k-empty-state-title"
				style={applySlot(
					{
						marginTop: 16,
						fontSize: 18,
						fontWeight: "600",
						color: theme.foreground,
						textAlign: "center",
					},
					styles?.title,
				)}
			>
				{title}
			</RNText>
			{description !== undefined && (
				<RNText
					testID="k-empty-state-description"
					style={applySlot(
						{
							marginTop: 8,
							marginBottom: 16,
							fontSize: 14,
							color: theme.mutedForeground,
							textAlign: "center",
						},
						styles?.description,
					)}
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
					style={applySlot({
						minHeight: 44,
						paddingHorizontal: 16,
						borderRadius: tokens.radius.control,
						backgroundColor: theme.primary,
						alignItems: "center",
						justifyContent: "center",
					}, styles?.action)}
				>
					<RNText
						style={{ color: theme.primaryForeground, fontSize: 14, fontWeight: "600" }}
					>
						{action.label}
					</RNText>
				</Pressable>
			)}
			{children}
		</View>
	);
}
