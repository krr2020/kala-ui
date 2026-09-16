/**
 * AvatarGroup: overlapping avatar stack with a "+N" overflow chip. Web
 * wraps each avatar in a tooltip; RN has no hover idiom, so the group
 * container itself carries the names as its accessibilityLabel.
 */
import type { ReactElement } from "react";
import type { ImageSourcePropType } from "react-native";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Avatar } from "../avatar";
import {
	container,
	memberOffset,
	memberRing,
	overflowChip,
	overflowText,
	ringedFor,
} from "./avatar-group.styles";
import type { AvatarGroupProps } from "./avatar-group.types";

export function AvatarGroup({
	avatars,
	max = 4,
	size = "md",
	style,
	slotStyles,
	testID = "k-avatar-group",
}: AvatarGroupProps): ReactElement {
	const { theme } = useUnistyles();

	// floor once so fractional max values slice and count whole avatars
	const shown = Math.floor(Math.max(0, max));
	const visible = avatars.slice(0, shown);
	const overflow = avatars.length - shown;
	const ringed = ringedFor(size);

	const member = (
		name: string,
		source: ImageSourcePropType | undefined,
		index: number,
	) => (
		// names may repeat, so keys cannot ride on the name alone
		<View
			key={`${index}-${name}`}
			style={index === 0 ? undefined : memberOffset()}
		>
			<View style={memberRing(ringed, theme.card)}>
				<Avatar name={name} source={source} size={size} />
			</View>
		</View>
	);

	return (
		<View
			testID={testID}
			accessibilityLabel={[
				...visible.map((avatar) => avatar.name),
				overflow > 0 ? `+${overflow} more` : null,
			]
				.filter(Boolean)
				.join(", ")}
			style={container(style, slotStyles?.root)}
		>
			{visible.map((avatar, index) =>
				member(avatar.name, avatar.source, index),
			)}
			{overflow > 0 ? (
				<View
					testID="k-avatar-group-overflow"
					style={overflowChip(ringed, theme.muted, theme.card)}
				>
					<RNText style={overflowText(size, theme.foreground)}>
						+{overflow}
					</RNText>
				</View>
			) : null}
		</View>
	);
}
