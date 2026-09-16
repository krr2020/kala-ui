/**
 * Avatar: renders the image when a source is given and has not errored,
 * else themed-initials fallback. The rounded clip lives on the media
 * layer — a root-level clip would shear off the corner status dot.
 */
import type { ReactElement } from "react";
import { useState } from "react";
import { Image, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { initialsFor } from "../../lib/text.utils";
import { applySlot } from "../slot-styles";
import { BOX, DOT, FALLBACK_FONT, RADIUS, RING } from "./avatar.styles";
import type { AvatarProps } from "./avatar.types";

export function Avatar({
	name,
	source,
	size = "md",
	shape = "circle",
	status = "none",
	style,
	slotStyles,
	testID = "k-avatar",
}: AvatarProps): ReactElement {
	const { theme } = useUnistyles();
	const [failed, setFailed] = useState(false);
	const radius = RADIUS[shape];
	const showImage = source !== undefined && !failed;

	return (
		<View
			testID={testID}
			// one a11y element so role=image + name surface to screen readers
			accessible={true}
			accessibilityRole="image"
			accessibilityLabel={name}
			style={[
				{ width: BOX[size], height: BOX[size] },
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{showImage ? (
				<Image
					testID="k-avatar-image"
					source={source}
					onError={() => setFailed(true)}
					style={applySlot(
						{
							width: "100%",
							height: "100%",
							borderRadius: radius,
						},
						slotStyles?.image,
					)}
				/>
			) : (
				<View
					testID="k-avatar-fallback"
					style={applySlot(
						{
							width: "100%",
							height: "100%",
							borderRadius: radius,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: theme.primary,
						},
						slotStyles?.fallback,
					)}
				>
					<RNText
						style={{
							color: theme.primaryForeground,
							fontSize: FALLBACK_FONT[size],
							fontWeight: "500",
						}}
					>
						{initialsFor(name)}
					</RNText>
				</View>
			)}
			{status !== "none" && (
				<View
					testID="k-avatar-status"
					style={applySlot(
						{
							position: "absolute",
							right: 0,
							bottom: 0,
							width: DOT[size],
							height: DOT[size],
							borderRadius: 999,
							backgroundColor:
								status === "online" ? theme.success : theme.mutedForeground,
							borderWidth: RING[size],
							borderColor: theme.background,
						},
						slotStyles?.status,
					)}
				/>
			)}
		</View>
	);
}
