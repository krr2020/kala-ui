import { View } from "react-native";
import { Skeleton } from "../skeleton";
import { GAP, SKELETON_AVATAR, SKELETON_ROWS } from "./card.styles";

export function CardSkeletonStack() {
	return (
		<View
			testID="k-card-skeleton"
			style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
		>
			<Skeleton
				variant="circle"
				style={{ width: SKELETON_AVATAR, height: SKELETON_AVATAR }}
			/>
			<View style={{ flex: 1, gap: GAP }}>
				{SKELETON_ROWS.map((row, i) => (
					<Skeleton key={i} style={{ width: row.width, height: row.height }} />
				))}
			</View>
		</View>
	);
}
