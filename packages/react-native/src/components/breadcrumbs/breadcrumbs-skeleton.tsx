/**
 * BreadcrumbsSkeleton: loading placeholder matching the crumb trail —
 * `depth` skeleton crumbs joined by separator glyphs.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type { BreadcrumbsSkeletonProps } from "./breadcrumbs.types";

export function BreadcrumbsSkeleton({
	depth = 3,
	separator = "/",
	style,
	testID = "k-breadcrumbs-skeleton",
}: BreadcrumbsSkeletonProps): ReactElement {
	const { theme } = useUnistyles() as unknown as {
		theme: Record<string, string>;
	};

	return (
		<View
			testID={testID}
			accessibilityLabel="Loading breadcrumbs"
			accessibilityState={{ busy: true }}
			style={applySlot(
				{ flexDirection: "row", alignItems: "center", gap: 8 },
				style,
			)}
		>
			{Array.from({ length: depth }).map((_, index) => (
				<View
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton slot position is the identity
					key={`crumb-${index}`}
					style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
				>
					<View testID="k-breadcrumbs-skeleton-crumb">
						<Skeleton style={{ width: 80, height: 12 }} />
					</View>
					{index < depth - 1 ? (
						<RNText
							testID="k-breadcrumbs-skeleton-separator"
							style={{ fontSize: 14, color: theme.mutedForeground }}
						>
							{separator}
						</RNText>
					) : null}
				</View>
			))}
		</View>
	);
}
