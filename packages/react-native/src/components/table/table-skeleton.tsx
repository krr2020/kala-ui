/**
 * TableSkeleton: loading placeholder shaped like the grid — a head row
 * per column and rows×columns skeleton cells. Index keys (stable), no
 * crypto dependency.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type { TableSkeletonConfig } from "./table.types";

export function TableSkeleton({
	rows = 5,
	columns = 4,
	headers,
	styles,
	testID = "k-table-skeleton",
}: TableSkeletonConfig & {
	styles?: {
		root?: import("react-native").StyleProp<import("react-native").ViewStyle>;
		head?: import("react-native").StyleProp<import("react-native").ViewStyle>;
		cell?: import("react-native").StyleProp<import("react-native").ViewStyle>;
	};
	testID?: string;
}): ReactElement {
	const { theme } = useUnistyles() as unknown as {
		theme: Record<string, string>;
	};
	const displayHeaders = headers ?? Array.from({ length: columns }, () => null);

	return (
		<View
			testID={testID}
			style={applySlot(
				{
					borderWidth: 1,
					borderRadius: 8,
					borderColor: theme.border,
					backgroundColor: theme.card,
				},
				styles?.root,
			)}
		>
			<View
				testID="k-table-header"
				style={applySlot(
					{
						flexDirection: "row",
						backgroundColor: theme.muted,
						paddingVertical: 10,
						paddingHorizontal: 12,
						gap: 8,
					},
					styles?.head,
				)}
			>
				{displayHeaders.map((header, index) => (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton column position is the identity
						key={`head-${index}`}
						testID="k-table-head"
						style={{ flex: 1, minHeight: 16 }}
					>
						{header ? (
							<RNText
								style={{
									fontSize: 12,
									fontWeight: "600",
									color: theme.foreground,
								}}
							>
								{header}
							</RNText>
						) : (
							<Skeleton style={{ width: 72, height: 12 }} />
						)}
					</View>
				))}
			</View>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<View
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton row position is the identity
					key={`row-${rowIndex}`}
					testID="k-table-row"
					style={{
						flexDirection: "row",
						paddingVertical: 10,
						paddingHorizontal: 12,
						gap: 8,
						borderTopWidth: 1,
						borderTopColor: theme.border,
					}}
				>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<View
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cell position is the identity
							key={`cell-${colIndex}`}
							testID="k-table-cell"
							style={[{ flex: 1 }, applySlot({}, styles?.cell)]}
						>
							<Skeleton style={{ height: 12 }} />
						</View>
					))}
				</View>
			))}
		</View>
	);
}
