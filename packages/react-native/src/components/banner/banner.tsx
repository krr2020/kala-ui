/**
 * Banner: solid-tone, page-level notification strip. 'fixed' is an
 * absolute-position mapping (RN has no viewport-fixed); the live region
 * default mirrors the web role=status → polite announcement.
 */

import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import {
	closeStyle,
	contentStyle,
	DEFAULT_SKELETON,
	plainTextStyle,
	positionStyle,
	rootStyle,
	skeletonCloseStyle,
	skeletonIconStyle,
	skeletonLineStyle,
	skeletonRowStyle,
	tone,
} from "./banner.styles";
import type { BannerProps, BannerSkeletonConfig } from "./banner.types";

function SkeletonRow({
	config,
}: {
	config: Required<BannerSkeletonConfig>;
}): ReactElement {
	return (
		<View style={skeletonRowStyle}>
			{config.showIcon ? (
				<Skeleton variant="circle" animated style={skeletonIconStyle} />
			) : null}
			<Skeleton animated style={skeletonLineStyle} />
			{config.showCloseButton ? (
				<Skeleton animated style={skeletonCloseStyle} />
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
	slotStyles,
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
				rootStyle(bg),
				positionStyle(position),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			<View
				testID="k-banner-content"
				style={[
					contentStyle,
					applySlot({}, slotStyles?.content),
				]}
			>
				{isLoading ? (
					skeleton !== undefined ? (
						skeleton
					) : (
						<SkeletonRow config={{ ...DEFAULT_SKELETON, ...skeletonConfig }} />
					)
				) : typeof children === "string" || typeof children === "number" ? (
					<RNText style={plainTextStyle(fg)}>{children}</RNText>
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
					style={[closeStyle, applySlot({}, slotStyles?.close)]}
				>
					<X size={16} color={fg} />
				</Pressable>
			) : null}
		</View>
	);
}
