/**
 * Banner: solid-tone, page-level notification strip. 'fixed' is an
 * absolute-position mapping (RN has no viewport-fixed); the live region
 * default mirrors the web role=status → polite announcement.
 */

import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import type { ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { KalaTheme, RampBase } from "../../types";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type {
	BannerColor,
	BannerPosition,
	BannerProps,
	BannerSkeletonConfig,
} from "./banner.types";

const DEFAULT_SKELETON: Required<BannerSkeletonConfig> = {
	showIcon: true,
	showCloseButton: true,
};

function tone(
	color: BannerColor,
	theme: KalaTheme,
): {
	bg: string;
	fg: string;
} {
	return {
		bg: theme[color as RampBase],
		fg: theme[`${color as RampBase}Foreground`],
	};
}

function positionStyle(position: BannerPosition): ViewStyle {
	return position === "fixed"
		? { position: "absolute", top: 0, left: 0, right: 0, elevation: 4 }
		: { position: "relative" };
}

function SkeletonRow({
	config,
}: {
	config: Required<BannerSkeletonConfig>;
}): ReactElement {
	return (
		<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
			{config.showIcon ? (
				<Skeleton variant="circle" animated style={{ width: 16, height: 16 }} />
			) : null}
			<Skeleton animated style={{ height: 16, flex: 1, maxWidth: 256 }} />
			{config.showCloseButton ? (
				<Skeleton animated style={{ width: 16, height: 16 }} />
			) : null}
		</View>
	);
}

export function Banner({
	children,
	color = "info",
	position = "fixed",
	onClose,
	role = "status",
	isLoading = false,
	skeletonConfig,
	skeleton,
	accessibilityLabel,
	style,
	styles,
	testID = "k-banner",
}: BannerProps): ReactElement {
	const { theme } = useUnistyles();
	const { bg, fg } = tone(color, theme);
	const isAlert = role === "alert";

	return (
		<View
			testID={testID}
			accessible
			accessibilityRole={isAlert ? "alert" : undefined}
			accessibilityLabel={accessibilityLabel}
			accessibilityLiveRegion={isAlert ? "assertive" : "polite"}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 16,
					paddingHorizontal: 16,
					paddingVertical: 12,
					backgroundColor: bg,
				},
				positionStyle(position),
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			<View
				testID="k-banner-content"
				style={[
					{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
					applySlot({}, styles?.content),
				]}
			>
				{isLoading ? (
					skeleton !== undefined ? (
						skeleton
					) : (
						<SkeletonRow config={{ ...DEFAULT_SKELETON, ...skeletonConfig }} />
					)
				) : typeof children === "string" || typeof children === "number" ? (
					<RNText style={{ color: fg, fontSize: 14, fontWeight: "500" }}>
						{children}
					</RNText>
				) : (
					children
				)}
			</View>
			{onClose ? (
				<Pressable
					testID="k-banner-close"
					accessibilityRole="button"
					accessibilityLabel="Close banner"
					hitSlop={8}
					onPress={onClose}
					style={[{ padding: 4 }, applySlot({ opacity: 0.9 }, styles?.close)]}
				>
					<X size={16} color={fg} />
				</Pressable>
			) : null}
		</View>
	);
}
