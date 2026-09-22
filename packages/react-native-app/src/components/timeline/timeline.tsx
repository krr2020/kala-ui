/**
 * Timeline: vertical status rail. Data-driven items (the Steps
 * convention) rather than the web's cloneElement compound children —
 * each entry gets a status-colored dot and a connector line to the
 * next entry.
 */

import { applySlot } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	contentStyle,
	descriptionStyle,
	dotStyle,
	dotSurfaceStyle,
	innerDotStyle,
	itemStyle,
	lineStyle,
	railStyle,
	rootStyle,
	timestampStyle,
	titleRowStyle,
	titleStyle,
} from "./timeline.styles";
import type { TimelineItemData, TimelineProps } from "./timeline.types";

export function Timeline({
	items,
	style,
	slotStyles,
	testID = "k-timeline",
}: TimelineProps): ReactElement {
	const { theme } = useUnistyles();

	return (
		<View
			testID={testID}
			style={applySlot(rootStyle, applySlot(style, slotStyles?.root))}
		>
			{items.map((item, index) => {
				const status = item.status ?? "default";
				const isLast = index === items.length - 1;
				const label = [item.title, item.timestamp, item.description]
					.filter((part) => part !== undefined && part !== "")
					.join(", ");

				return (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: entry position in the rail is the identity — titles may repeat
						key={`${item.title ?? "item"}-${index}`}
						testID="k-timeline-item"
						accessibilityLabel={label}
						style={[itemStyle, applySlot({}, slotStyles?.item)]}
					>
						<View style={railStyle}>
							<View
								testID="k-timeline-dot"
								style={[
									dotStyle(theme),
									dotSurfaceStyle(theme, status),
									applySlot({}, slotStyles?.dot),
								]}
							>
								<View
									style={innerDotStyle(
										status === "pending"
											? theme.mutedForeground
											: theme.primaryForeground,
									)}
								/>
							</View>
							{!isLast ? (
								<View testID="k-timeline-line" style={lineStyle(theme)} />
							) : null}
						</View>
						<View style={contentStyle(isLast)}>
							<View style={titleRowStyle}>
								{item.title ? (
									<RNText numberOfLines={1} style={titleStyle(theme)}>
										{item.title}
									</RNText>
								) : null}
								{item.timestamp ? (
									<RNText numberOfLines={1} style={timestampStyle(theme)}>
										{item.timestamp}
									</RNText>
								) : null}
							</View>
							{item.description ? (
								<RNText numberOfLines={2} style={descriptionStyle(theme)}>
									{item.description}
								</RNText>
							) : null}
						</View>
					</View>
				);
			})}
		</View>
	);
}

export type { TimelineItemData };
