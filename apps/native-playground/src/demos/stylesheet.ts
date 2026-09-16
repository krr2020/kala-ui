import { StyleSheet } from "react-native-unistyles";

// Shared demo surface styles — one theme-closed stylesheet so every
// section (and the App screen shell) restyles together on a theme
// switch; no per-module token drift.
export const demoStyles = StyleSheet.create((theme) => ({
	screen: {
		flex: 1,
		backgroundColor: theme.background,
		paddingTop: 8,
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
	block: {
		gap: 8,
	},
	blockLabel: {
		color: theme.mutedForeground,
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	routeBar: {
		flexGrow: 0,
	},
	// edge gutter for the horizontal chip rows — first/last chips keep
	// the same 16px inset as the content while scrolling
	chipRowContent: {
		paddingLeft: 16,
		paddingRight: 16,
	},
	chipRows: {
		gap: 6,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: theme.border,
		// sits above the themed content ScrollView — without an explicit
		// fill the raw Android window background shows through
		backgroundColor: theme.background,
	},
	// divider between the group and component rows — explicit themed
	// hairline so the row tiers read as distinct levels
	rowDivider: {
		height: 1,
		backgroundColor: theme.border,
	},
	groupChip: {
		borderRadius: 999,
		borderColor: theme.foreground,
		backgroundColor: "transparent",
	},
	groupChipText: {
		fontWeight: "700",
		fontSize: 12,
		letterSpacing: 0.3,
	},
	filterChip: {
		borderRadius: 999,
		backgroundColor: "transparent",
	},
	routeContent: {
		gap: 24,
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
