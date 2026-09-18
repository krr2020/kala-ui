import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The entry's export LIST is the contract (importing the entry pulls
 * react-native, which vitest cannot execute). Same technique as
 * packages/react-native's tokens-parity pin: no `export *` escapes, and
 * the pinned names are exactly what the package ships.
 */
const entry = readFileSync(resolve(__dirname, "../index.ts"), "utf8");

function exportNames(): Set<string> {
	expect(entry).not.toMatch(/export\s+\*/);
	const names = new Set<string>();
	for (const m of entry.matchAll(
		/export\s+(?:type\s+)?\{([^}]*)\}\s*from\s*"[^"]+";/g,
	)) {
		for (const part of m[1].split(",")) {
			const name = part
				.trim()
				.replace(/^type /, "")
				.split(" as ")
				.pop();
			if (name) names.add(name);
		}
	}
	expect(names.size).toBeGreaterThan(0);
	return names;
}

describe("entry exports pin", () => {
	it("exports exactly the app-composite surface", () => {
		expect(exportNames()).toEqual(
			new Set([
				"AppShell",
				"AppShellProps",
				"BarChart",
				"BarChartDatum",
				"BarChartProps",
				"ChartSkeleton",
				"ChartSkeletonProps",
				"ClipboardWriter",
				"CopyButton",
				"CopyButtonProps",
				"DataTable",
				"DataTableColumn",
				"DataTableProps",
				"DataTableSkeleton",
				"DataTableSkeletonProps",
				"DonutChart",
				"DonutChartDatum",
				"DonutChartProps",
				"EmptyState",
				"EmptyStateAction",
				"EmptyStateIcon",
				"EmptyStateProps",
				"ErrorBoundary",
				"ErrorBoundaryProps",
				"ErrorFallback",
				"ErrorFallbackProps",
				"ErrorFallbackVariant",
				"Header",
				"HeaderAction",
				"HeaderProps",
				"HeaderSkeleton",
				"HeaderSkeletonProps",
				"List",
				"ListItem",
				"ListItemAction",
				"ListItemActionProps",
				"ListItemAvatar",
				"ListItemAvatarProps",
				"ListItemBadge",
				"ListItemBadgeProps",
				"ListItemContent",
				"ListItemContentProps",
				"ListItemIcon",
				"ListItemIconProps",
				"ListItemIconSize",
				"ListItemProps",
				"ListItemText",
				"ListItemTextProps",
				"ListItemTitle",
				"ListItemTitleProps",
				"ListProps",
				"ListSkeletonConfig",
				"ListSkeletonVariant",
				"LoadingOverlay",
				"LoadingOverlayProps",
				"MetricCard",
				"MetricCardProps",
				"MetricCardSkeleton",
				"MetricCardSkeletonProps",
				"PasswordStrengthIndicator",
				"PasswordStrengthIndicatorProps",
				"ScreenStack",
				"ScreenStackEntry",
				"ScreenStackPresentation",
				"ScreenStackProps",
				"Sparkline",
				"SparklineProps",
				"StackTransition",
				"StepItem",
				"Steps",
				"StepsOrientation",
				"StepsProps",
				"TabBar",
				"TabBarItemData",
				"TabBarProps",
				"TabBarSkeleton",
				"TabBarSkeletonProps",
				"Timeline",
				"TimelineItemData",
				"TimelineProps",
				"TimelineStatus",
				"isActivePath",
			]),
		);
	});
});
