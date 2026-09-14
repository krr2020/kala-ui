/**
 * Avatar: single-component collapse of the web Root/Image/Fallback trio —
 * Radix's load-state machine becomes: render the image when a source is
 * given and has not errored, else fallback initials on a themed bg.
 * Status hues have no globals.css token; online→success, offline→
 * mutedForeground (documented mapping, not silent drift).
 */
import { useState } from "react";
import type { ReactElement } from "react";
import { Image, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistiles";
import type { AvatarProps, AvatarShape, AvatarSize, AvatarStatus } from "./avatar.types";

const BOX: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
const DOT: Record<AvatarSize, number> = { xs: 6, sm: 8, md: 10, lg: 12, xl: 16 };
const FALLBACK_FONT: Record<AvatarSize, number> = {
	xs: 12,
	sm: 14,
	md: 14,
	lg: 16,
	xl: 20,
};
const RADIUS: Record<AvatarShape, number> = {
	circle: 999,
	rounded: 8,
	square: 0,
};

function initials(name?: string): string {
	const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return "–";
	return words
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

export function Avatar({
	name,
	source,
	size = "md",
	shape = "circle",
	status = "none",
	style,
	testID = "k-avatar",
}: AvatarProps): ReactElement {
	const { theme } = useUnistyles();
	const [failed, setFailed] = useState(false);
	const box = BOX[size];
	const showImage = source !== undefined && !failed;

	return (
		<View
			testID={testID}
			accessibilityRole="image"
			accessibilityLabel={name}
			style={[
				{
					width: box,
					height: box,
					borderRadius: RADIUS[shape],
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
				},
				style,
			]}
		>
			{showImage ? (
				<Image
					testID="k-avatar-image"
					source={source}
					onError={() => setFailed(true)}
					style={{
						width: "100%",
						height: "100%",
						borderRadius: RADIUS[shape],
					}}
				/>
			) : (
				<View
					testID="k-avatar-fallback"
					style={{
						width: "100%",
						height: "100%",
						borderRadius: RADIUS[shape],
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: theme.primary,
					}}
				>
					<RNText
						style={{
							color: theme.primaryForeground,
							fontSize: FALLBACK_FONT[size],
							fontWeight: "500",
						}}
					>
						{initials(name)}
					</RNText>
				</View>
			)}
			{status !== "none" && (
				<View
					testID="k-avatar-status"
					style={{
						position: "absolute",
						right: 0,
						bottom: 0,
						width: DOT[size],
						height: DOT[size],
						borderRadius: 999,
						backgroundColor:
							status === "online" ? theme.success : theme.mutedForeground,
						borderWidth: 2,
						borderColor: theme.background,
					}}
				/>
			)}
		</View>
	);
}
