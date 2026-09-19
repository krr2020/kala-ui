import { StyleSheet } from "react-native-unistyles";

// Shared demo surface styles — one theme-closed stylesheet so every
// section (and the App screen shell) restyles together on a theme
// switch; no per-module token drift.
export const demoStyles = StyleSheet.create((theme) => ({
	screen: {
		flex: 1,
		backgroundColor: theme.background,
		paddingTop: 8,
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
		alignItems: "center",
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
		// gap + 1px inner divider == theme↔group seam (10 + 1 + 10) so the
		// header rows sit on one vertical rhythm; the gap pads BOTH sides of
		// the inner divider, so the inner seam is 2×gap + 1
		gap: 10,
		// no vertical padding and no attached hairline — the space above
		// and below the chip tier comes from previewContent's single gap so
		// both sides of the tier stay symmetric
		// scrolls inside the content ScrollView — break out of its 16px
		// gutter so the horizontal rows span full width; the ScrollView's
		// own background covers the overscroll, no opaque fill needed here
		marginHorizontal: -16,
	},
	// persistent theme switcher strip under the chip rows — theme-axis
	// padding mirrors the content inset while staying out of the scroll;
	// one line: the label is fixed and the chip scroll flexes to the
	// remaining width so overflow scrolls instead of wrapping
	themeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 10,
		backgroundColor: theme.background,
	},
	themeScroll: {
		flex: 1,
	},
	// divider between the group and component rows — explicit themed
	// hairline so the row tiers read as distinct levels
	rowDivider: {
		height: 1,
		backgroundColor: theme.border,
	},
	groupChip: {
		borderRadius: 999,
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
	// group-row segregation by package: each segment gets a non-pressable
	// uppercase header; app-package chips swap the transparent pill for a
	// filled tint so the @kala-ui/react-native vs -app boundary reads at
	// a glance
	segment: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	// vertical rule between the library and app segments — inline child of
	// the same scrolling row so it never drops to its own line
	segmentRule: {
		width: 1,
		alignSelf: "stretch",
		backgroundColor: theme.border,
	},
	sectionHeader: {
		paddingVertical: 8,
		paddingHorizontal: 4,
	},
	sectionHeaderText: {
		color: theme.mutedForeground,
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	appChip: {
		backgroundColor: theme.accent,
		borderColor: theme.secondary,
	},
	appChipText: {
		fontStyle: "italic",
	},
	routeContent: {
		gap: 32,
		// horizontal gutter lives on the scroll CONTENT — padding on the
		// ScrollView FRAME would clip child drawing (elevated shadows)
		// without adding scrollable space; must stay in sync with
		// chipRowContent's 16px re-inset so chip rows and content share one rail
		paddingHorizontal: 16,
		// end-of-scroll breathing room lives on the scroll CONTENT — the
		// shell's SafeAreaView already consumes the gesture-bar inset, and
		// padding on the ScrollView frame would clip the viewport without
		// adding scrollable space
		paddingBottom: 72,
	},
	// fixed back-navigation tier above the theme row — full-width row so
	// the whole strip is the tap target while keeping the content rail
	pinnedBackRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		minHeight: 44,
		paddingHorizontal: 16,
		backgroundColor: theme.background,
	},
	// scroll content for the preview screen — chips lead, so unlike
	// routeContent there is no large inter-section gap at the top; the
	// horizontal gutter and end-of-scroll room match routeContent
	previewContent: {
		gap: 20,
		paddingHorizontal: 16,
		paddingBottom: 72,
	},
	componentRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		gap: 8,
	},
	// fixed-size anchor target for Indicator demos — gives the
	// absolutely-anchored dot a corner to sit on; the muted fill (no
	// stroke) keeps the withBorder ring, which paints in theme.background,
	// readable
	indicatorTarget: {
		width: 48,
		height: 48,
		borderRadius: 10,
		backgroundColor: theme.muted,
	},
	// caption column under an anchored target: 48-wide rail so long
	// labels wrap as captions, never as text inside the target box
	indicatorFigure: {
		width: 48,
		alignItems: "center",
		gap: 4,
	},
	// label-above-control pairing: the column stack Field gives you for free
	fieldRow: {
		alignSelf: "stretch",
		gap: 8,
	},
	// landing + route screens — full-width stacked cards, never an inline
	// row: package segregation reads as two distinct destinations
	landingHero: {
		gap: 4,
	},
	landingCard: {
		gap: 6,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: theme.border,
		backgroundColor: theme.card,
	},
	landingCardHead: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	landingCardTitle: {
		color: theme.foreground,
		fontSize: 18,
		fontWeight: "700",
	},
	landingCardMeta: {
		color: theme.mutedForeground,
		fontSize: 13,
	},
	listColumn: {
		gap: 12,
	},
	listRowTitle: {
		color: theme.foreground,
		fontSize: 15,
		fontWeight: "600",
	},
	backButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		minHeight: 44,
		alignSelf: "flex-start",
	},
	backLabel: {
		color: theme.foreground,
		fontSize: 14,
		fontWeight: "500",
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
