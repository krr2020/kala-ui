/**
 * ListItemAvatar: circular image with an initials fallback when the
 * image is absent or fails to load.
 */
import type { ReactElement } from "react";
import { useState } from "react";
import { Image, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { AVATAR_SIZES } from "./list.styles";
import type { ListItemAvatarProps } from "./list.types";

function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.slice(0, 2)
		.join("");
}

export function ListItemAvatar({
	source,
	name,
	size = "md",
	style,
	testID = "k-list-item-avatar",
}: ListItemAvatarProps): ReactElement {
	const { theme } = useUnistyles();
	const [imgError, setImgError] = useState(false);
	const dim = AVATAR_SIZES[size];
	return (
		<View
			testID={testID}
			style={[
				{
					width: dim,
					height: dim,
					borderRadius: dim / 2,
					overflow: "hidden" as const,
					backgroundColor: String(theme.muted),
					alignItems: "center",
					justifyContent: "center",
				},
				style,
			]}
		>
			{source && !imgError ? (
				<Image
					testID={`${testID}-image`}
					source={source}
					style={{ width: "100%", height: "100%" }}
					onError={() => setImgError(true)}
				/>
			) : (
				<RNText style={{ color: String(theme.mutedForeground) }}>
					{initials(name ?? "")}
				</RNText>
			)}
		</View>
	);
}
