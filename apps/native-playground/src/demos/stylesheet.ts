import { StyleSheet } from "react-native-unistyles";

// Shared demo surface styles — one theme-closed stylesheet so every
// section (and the App screen shell) restyles together on a theme
// switch; no per-module token drift.
export const demoStyles = StyleSheet.create((theme) => ({
	screen: {
		flex: 1,
		backgroundColor: theme.background,
		paddingTop: 64,
		paddingBottom: 32,
		paddingHorizontal: 16,
		gap: 16,
	},
	title: {
		color: theme.foreground,
		fontSize: 24,
		fontWeight: "700",
	},
	current: {
		color: theme.mutedForeground,
		fontSize: 14,
	},
	picker: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	chip: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: theme.border,
		backgroundColor: theme.card,
	},
	chipText: {
		color: theme.foreground,
		fontSize: 13,
	},
	chipActive: {
		backgroundColor: theme.primary,
		borderColor: theme.primary,
	},
	chipTextActive: {
		color: theme.primaryForeground,
		fontWeight: "600",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	swatch: {
		width: "30%",
		aspectRatio: "1.6",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme.border,
		justifyContent: "flex-end",
	},
	swatchLabel: {
		color: theme.foreground,
		fontSize: 11,
		textAlign: "center",
		paddingBottom: 6,
	},
	sectionTitle: {
		color: theme.foreground,
		fontSize: 18,
		fontWeight: "600",
	},
	componentRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		gap: 8,
	},
}));

export const SWATCH_TOKENS = [
	"background",
	"foreground",
	"card",
	"primary",
	"secondary",
	"muted",
	"accent",
	"destructive",
	"success",
	"warning",
	"error",
	"info",
] as const;
