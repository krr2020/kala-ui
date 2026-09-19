import type { TextStyle, ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import type { BadgeColor, BadgeVariant } from "../badge/badge.types";
import type { IndicatorColor } from "../indicator/indicator.types";
import type { IconColor } from "../icon/icon.types";
import type { TabsVariant } from "./tabs.types";

/**
 * Style tables for the two Tabs looks. `line` (default): a bare track split
 * by a 1px themed divider, the active tab carrying a muted fill plus a 2px
 * primary underline/rail on the divider edge. `pill`: a fully-rounded muted
 * wrapper with the active trigger filled primary (SegmentedControl instead
 * slides a background-colored thumb inside its muted track). Count chips and
 * status dots are the Badge and Indicator components — the helpers below
 * only map tab context onto their variant/color props.
 */

export type TabsLook = "line" | "pill";

// Matches the segmented-control full-radius precedent; shape tokens carry no
// "full" entry.
const RADIUS_FULL = 999;

// Anything other than the literal "pill" resolves to line, so a stray variant
// string can never produce a hybrid (primary fill + underline) or an
// unstyled tab.
export const resolveTabsVariant = (
	variant: TabsVariant | undefined,
): TabsLook => (variant === "pill" ? "pill" : "line");

export const tabsTrackStyle = ({
	look,
	vertical,
	theme,
}: {
	look: TabsLook;
	vertical: boolean;
	theme: KalaTheme;
}): ViewStyle =>
	look === "pill"
		? {
				flexDirection: vertical ? "column" : "row",
				gap: 4,
				alignSelf: "flex-start",
				padding: 4,
				borderRadius: RADIUS_FULL,
				backgroundColor: theme.muted,
			}
		: {
				flexDirection: vertical ? "column" : "row",
				gap: 4,
				alignSelf: "stretch",
				...(vertical
					? { borderLeftWidth: 1, borderLeftColor: theme.border }
					: { borderBottomWidth: 1, borderBottomColor: theme.border }),
			};

interface TabStyleInput {
	look: TabsLook;
	selected: boolean;
	disabled: boolean;
	theme: KalaTheme;
}

export const tabsTabStyle = ({
	look,
	selected,
	disabled,
	theme,
}: TabStyleInput): ViewStyle => ({
	minHeight: 44,
	flexDirection: "row",
	alignItems: "center",
	gap: 6,
	paddingHorizontal: 14,
	justifyContent: "center",
	borderRadius: look === "pill" ? RADIUS_FULL : tokens.radius.control,
	...(disabled ? { opacity: 0.5 } : {}),
	...(look === "pill" && selected
		? { backgroundColor: theme.primary }
		: look === "line" && selected
			? { backgroundColor: theme.muted }
			: {}),
});

// The line-variant selection marker: an absolutely-positioned zero-size box
// whose 2px themed border IS the underline/rail — bottom edge when tabs run
// horizontally, leading edge when stacked vertically. It sits on top of the
// track's 1px divider (2px primary over 1px border).
export const tabsUnderlineStyle = ({
	theme,
	vertical,
}: {
	theme: KalaTheme;
	vertical: boolean;
}): ViewStyle =>
	vertical
		? {
				position: "absolute",
				top: 0,
				bottom: 0,
				left: -1,
				borderLeftWidth: 2,
				borderLeftColor: theme.primary,
			}
		: {
				position: "absolute",
				left: 0,
				right: 0,
				bottom: -1,
				borderBottomWidth: 2,
				borderBottomColor: theme.primary,
			};

export const tabsTabTextStyle = ({
	look,
	selected,
	theme,
}: {
	look: TabsLook;
	selected: boolean;
	theme: KalaTheme;
}): TextStyle => ({
	color: selected
		? look === "pill"
			? theme.primaryForeground
			: theme.foreground
		: theme.mutedForeground,
	fontSize: 14,
	fontWeight: selected ? "600" : "500",
});

// Count chip beside the label: subtle-muted on plain tab surfaces; solid
// secondary keeps the chip readable on the primary-filled active pill.
export const tabsBadgeVariant = (
	onActivePill: boolean,
): BadgeVariant => (onActivePill ? "solid" : "subtle");

export const tabsBadgeColor = (
	onActivePill: boolean,
): BadgeColor => (onActivePill ? "secondary" : "muted");

// Notification dot color: primary on plain surfaces, secondary on the
// active pill so it never disappears into the primary fill.
export const tabsDotColor = (onActivePill: boolean): IndicatorColor =>
	onActivePill ? "secondary" : "primary";

export const tabsIconColor = ({
	look,
	selected,
}: {
	look: TabsLook;
	selected: boolean;
}): IconColor =>
	look === "pill" && selected
		? "primaryForeground"
		: selected
			? "foreground"
			: "mutedForeground";
