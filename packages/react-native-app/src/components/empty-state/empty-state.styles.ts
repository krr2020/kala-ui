/**
 * Style tables and pure mappers for EmptyState: the dashed surface
 * builder, icon circle, and text styles — theme/token-in, style-out.
 */
import type { ViewStyle } from "react-native";
import { tokens } from "@kala-ui/react-native";
import type { KalaTheme } from "@kala-ui/react-native/types";
import type { EmptyStateProps } from "./empty-state.types";

export const MIN_HEIGHT = { sm: 150, md: 300, lg: 500 } as const;

export const surfaceStyle = (
	size: EmptyStateProps["size"],
	color: EmptyStateProps["color"],
	theme: KalaTheme,
): ViewStyle => {
	const destructive = color === "destructive";
	return {
		alignItems: "center",
		justifyContent: "center",
		minHeight: MIN_HEIGHT[size ?? "md"],
		padding: size === "sm" ? 16 : 32,
		borderRadius: tokens.radius.card,
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: destructive ? theme.destructive : theme.border,
		backgroundColor: destructive
			? `${theme.destructive}1A`
			: `${theme.muted}33`,
	};
};

export const iconCircleStyle = (theme: KalaTheme): ViewStyle => ({
	width: 80,
	height: 80,
	borderRadius: 999,
	backgroundColor: theme.muted,
	alignItems: "center",
	justifyContent: "center",
});

export const titleStyle = (theme: KalaTheme) => ({
	marginTop: 16,
	fontSize: 18,
	fontWeight: "600" as const,
	color: theme.foreground,
	textAlign: "center" as const,
});

export const descriptionStyle = (theme: KalaTheme) => ({
	marginTop: 8,
	marginBottom: 16,
	fontSize: 14,
	color: theme.mutedForeground,
	textAlign: "center" as const,
});
