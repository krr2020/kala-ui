import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
/**
 * Web status hues have no themed token in globals.css; native maps
 * online→theme.success and offline→theme.mutedForeground.
 */
export type AvatarStatus = "none" | "online" | "offline";

export interface AvatarProps {
	/** Person/entity name — feeds the accessibility label and fallback initials. */
	name?: string;
	/** Remote or local image; when it fails to load the fallback initials show. */
	source?: ImageSourcePropType;
	size?: AvatarSize;
	shape?: AvatarShape;
	status?: AvatarStatus;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
