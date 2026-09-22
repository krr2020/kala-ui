/**
 * MetricCard: title / value / change-or-subtitle block with a tone
 * accent bar. Web tints the whole card; on native the accent bar keeps
 * text on-theme while staying readable over both themes. Numbers are
 * formatted en-US so the value reads the same on every device locale.
 */

import type { ThemeToken } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	accentStyle,
	bodyStyle,
	cardStyle,
	changeStyle,
	subtitleStyle,
	TONE_BG,
	titleRowStyle,
	titleStyle,
	valueStyle,
} from "./metric-card.styles";
import type { MetricCardProps } from "./metric-card.types";
import { MetricCardSkeleton } from "./metric-card-skeleton";

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
	const { theme } = useUnistyles();

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
		<View testID={testID} style={[cardStyle(theme), style, styles?.root]}>
			<View
				testID="k-metric-card-accent"
				style={accentStyle(
					String(theme[(TONE_BG[tone] ?? "muted") as ThemeToken]),
				)}
			/>
			<View style={bodyStyle}>
				<View style={titleRowStyle}>
					<Text numberOfLines={1} style={titleStyle(theme)}>
						{title}
					</Text>
					{icon}
				</View>
				<Text style={valueStyle(theme)}>
					{typeof value === "number" ? value.toLocaleString("en-US") : value}
				</Text>
				{change !== undefined ? (
					<Text style={changeStyle(changeColor)}>
						{sign} {changeText}
					</Text>
				) : subtitle ? (
					<Text style={subtitleStyle(theme)}>{subtitle}</Text>
				) : null}
			</View>
		</View>
	);
}
