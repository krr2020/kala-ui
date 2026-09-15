/**
 * Timeline: vertical status rail. Data-driven items (the Steps
 * convention) rather than the web's cloneElement compound children —
 * each entry gets a status-colored dot and a connector line to the
 * next entry.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type {
	TimelineItemData,
	TimelineProps,
	TimelineStatus,
} from "./timeline.types";

const DOT = 32;

export function Timeline({
	items,
	style,
	styles,
	testID = "k-timeline",
}: TimelineProps): ReactElement {
	const { theme } = useUnistyles() as unknown as {
		theme: Record<string, string>;
	};

	const dotSurface = (status: TimelineStatus) => {
		switch (status) {
			case "success":
				return { backgroundColor: theme.success };
			case "error":
				return { backgroundColor: theme.destructive };
			case "warning":
				return { backgroundColor: theme.warning };
			case "pending":
				return { backgroundColor: theme.muted, borderWidth: 2 };
			default:
				return { backgroundColor: theme.primary };
		}
	};

	return (
		<View
			testID={testID}
			style={applySlot(
				{ flexDirection: "column" },
				applySlot(style, styles?.root),
			)}
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
						style={[
							{ flexDirection: "row", gap: 16 },
							applySlot({}, styles?.item),
						]}
					>
						<View style={{ flexDirection: "column", alignItems: "center" }}>
							<View
								testID="k-timeline-dot"
								style={[
									{
										width: DOT,
										height: DOT,
										borderRadius: DOT / 2,
										alignItems: "center",
										justifyContent: "center",
										zIndex: 1,
										borderColor: theme.mutedForeground,
									},
									dotSurface(status),
									applySlot({}, styles?.dot),
								]}
							>
								<View
									style={{
										width: 8,
										height: 8,
										borderRadius: 4,
										backgroundColor:
											status === "pending"
												? theme.mutedForeground
												: theme.primaryForeground,
									}}
								/>
							</View>
							{!isLast ? (
								<View
									testID="k-timeline-line"
									style={{
										width: 2,
										flex: 1,
										minHeight: 24,
										marginTop: 4,
										backgroundColor: theme.border,
									}}
								/>
							) : null}
						</View>
						<View style={{ flex: 1, paddingBottom: isLast ? 0 : 24 }}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "flex-start",
									justifyContent: "space-between",
									gap: 8,
								}}
							>
								{item.title ? (
									<RNText
										numberOfLines={1}
										style={{
											flex: 1,
											fontSize: 14,
											fontWeight: "500",
											color: theme.foreground,
										}}
									>
										{item.title}
									</RNText>
								) : null}
								{item.timestamp ? (
									<RNText
										numberOfLines={1}
										style={{ fontSize: 12, color: theme.mutedForeground }}
									>
										{item.timestamp}
									</RNText>
								) : null}
							</View>
							{item.description ? (
								<RNText
									numberOfLines={2}
									style={{
										marginTop: 4,
										fontSize: 14,
										color: theme.mutedForeground,
									}}
								>
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
