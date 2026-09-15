/**
 * MetricCard: title / value / change-or-subtitle block with a tone
 * accent bar. Web tints the whole card; on native the accent bar keeps
 * text on-theme while staying readable over both themes. Numbers are
 * formatted en-US so the value reads the same on every device locale.
 */
import type { ReactElement } from "react";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { MetricCardProps, MetricTone } from "./metric-card.types";
import { MetricCardSkeleton } from "./metric-card-skeleton";

interface ThemeShape {
	[key: string]: string | number;
	foreground: string;
	mutedForeground: string;
	success: string;
	destructive: string;
	border: string;
	card: string;
}

const TONE_BG: Partial<Record<MetricTone, string>> = {
	primary: "primary",
	destructive: "destructive",
	success: "success",
	warning: "warning",
	info: "info",
	muted: "muted",
};

export function MetricCard({
	title,
	value,
	icon,
	change,
	changeLabel,
	subtitle,
	tone = "muted",
	isLoading = false,
	style,
	styles,
	testID = "k-metric-card",
}: MetricCardProps): ReactElement {
	const { theme } = useUnistyles() as unknown as { theme: ThemeShape };

	if (isLoading) {
		return <MetricCardSkeleton style={style} styles={styles} testID={testID} />;
	}

	const changeColor =
		change !== undefined && change > 0
			? theme.success
			: change !== undefined && change < 0
				? theme.destructive
				: theme.mutedForeground;
	const sign =
		change === undefined ? "" : change > 0 ? "↑" : change < 0 ? "↓" : "−";
	const abs = change === undefined ? 0 : Math.abs(change);
	const changeText =
		change === undefined
			? ""
			: changeLabel || (change === 0 ? "No change" : `${abs}% than last week`);

	return (
		<View
			testID={testID}
			style={[
				{
					flexDirection: "row",
					backgroundColor: theme.card,
					borderWidth: 1,
					borderColor: theme.border,
				},
				style,
				styles?.root,
			]}
		>
			<View
				testID="k-metric-card-accent"
				style={{
					width: 4,
					backgroundColor: String(theme[TONE_BG[tone] ?? "muted"]),
				}}
			/>
			<View style={{ flex: 1, padding: 16, gap: 6 }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Text
						numberOfLines={1}
						style={{
							fontSize: 12,
							fontWeight: "600",
							color: theme.mutedForeground,
						}}
					>
						{title}
					</Text>
					{icon}
				</View>
				<Text
					style={{ fontSize: 30, fontWeight: "700", color: theme.foreground }}
				>
					{typeof value === "number" ? value.toLocaleString("en-US") : value}
				</Text>
				{change !== undefined ? (
					<Text style={{ fontSize: 13, color: changeColor }}>
						{sign} {changeText}
					</Text>
				) : subtitle ? (
					<Text style={{ fontSize: 13, color: theme.mutedForeground }}>
						{subtitle}
					</Text>
				) : null}
			</View>
		</View>
	);
}
