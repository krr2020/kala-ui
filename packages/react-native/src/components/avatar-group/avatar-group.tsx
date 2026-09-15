import type { ReactElement } from "react";
import type { ImageSourcePropType } from "react-native";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { AvatarSize } from "../avatar";
import { Avatar } from "../avatar";
import { applySlot } from "../slot-styles";
import type { AvatarGroupProps } from "./avatar-group.types";

// Must mirror Avatar's BOX scale; the ring wrapper adds a 2px border on
// top of the avatar box so overlapping members read as stacked chips.
const BOX: Record<AvatarSize, number> = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
	xl: 64,
};

/**
 * AvatarGroup: overlapping avatar stack with a "+N" overflow chip. Web
 * wraps each avatar in a tooltip; RN has no hover idiom, so the group
 * container itself carries the names as its accessibilityLabel.
 */
export function AvatarGroup({
	avatars,
	max = 4,
	size = "md",
	style,
	styles,
	testID = "k-avatar-group",
}: AvatarGroupProps): ReactElement {
	const { theme } = useUnistyles();

	const visible = avatars.slice(0, Math.max(0, max));
	const overflow = avatars.length - Math.max(0, max);
	const dim = BOX[size];
	const ringed = dim + 4;

	const member = (name: string, source: ImageSourcePropType | undefined) => (
		<View
			key={name}
			style={{
				width: ringed,
				height: ringed,
				borderRadius: ringed / 2,
				borderWidth: 2,
				borderColor: theme.card,
				overflow: "hidden",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Avatar name={name} source={source} size={size} />
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
			style={[
				{ flexDirection: "row", alignItems: "center" },
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			{visible.map((avatar, index) => (
				<View
					key={avatar.name}
					style={index === 0 ? undefined : { marginLeft: -8 }}
				>
					{member(avatar.name, avatar.source)}
				</View>
			))}
			{overflow > 0 ? (
				<View
					testID="k-avatar-group-overflow"
					style={{
						width: ringed,
						height: ringed,
						borderRadius: ringed / 2,
						backgroundColor: theme.muted,
						borderWidth: 2,
						borderColor: theme.card,
						alignItems: "center",
						justifyContent: "center",
						marginLeft: -8,
					}}
				>
					<RNText
						style={{
							fontSize: Math.max(10, Math.round(dim / 3)),
							color: theme.foreground,
							fontWeight: "500",
						}}
					>
						+{overflow}
					</RNText>
				</View>
			) : null}
		</View>
	);
}
