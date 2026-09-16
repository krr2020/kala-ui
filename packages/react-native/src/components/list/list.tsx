/**
 * List: themed card surface of rows. Web ul/li semantics map to
 * accessibilityRole list/list_item (advisory on RN); `href` opens via
 * Linking since RN has no anchor. Dividers are index-based views, not
 * CSS — full-bleed 1px regardless of dense padding.
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { dividerStyle, surfaceStyle } from "./list.styles";
import type { ListProps } from "./list.types";
import { SkeletonRow } from "./list-skeleton";

export function List({
	divided = true,
	dense = false,
	isLoading = false,
	skeletonConfig,
	skeleton,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-list",
	children,
}: ListProps): ReactElement {
	const { theme } = useUnistyles();

	const surface = [
		surfaceStyle(theme),
		applySlot(applySlot({}, style), slotStyles?.root),
	];

	if (isLoading) {
		const {
			variant = "simple",
			itemCount = 3,
			dense: skDense = false,
			showDividers = true,
		} = skeletonConfig ?? {};
		return (
			<View
				testID={testID}
				accessibilityRole="list"
				accessibilityLabel={accessibilityLabel}
				style={surface}
			>
				{skeleton ??
					Array.from({ length: itemCount }, (_, index) => {
						const slot = `skeleton-row-${index + 1}`;
						return (
							<View key={slot}>
								<View
									style={{
										paddingHorizontal: dense || skDense ? 12 : 16,
										paddingVertical: dense || skDense ? 8 : 12,
									}}
								>
									<SkeletonRow variant={variant} dense={dense || skDense} />
								</View>
								{showDividers && index < itemCount - 1 ? (
									<View testID="k-list-divider" style={dividerStyle(theme)} />
								) : null}
							</View>
						);
					})}
			</View>
		);
	}

	const items = Array.isArray(children) ? children : [children];
	const last = items.length - 1;
	return (
		<View
			testID={testID}
			accessibilityRole="list"
			accessibilityLabel={accessibilityLabel}
			style={surface}
		>
			{items.map((item, index) => {
				const own =
					typeof item === "object" && item !== null && "key" in item
						? (item as { key?: unknown }).key
						: null;
				const rowKey =
					typeof own === "string" || typeof own === "number"
						? own
						: `row-${index}`;
				return (
					<View key={rowKey}>
						{item}
						{divided && index < last ? (
							<View testID="k-list-divider" style={dividerStyle(theme)} />
						) : null}
					</View>
				);
			})}
		</View>
	);
}
