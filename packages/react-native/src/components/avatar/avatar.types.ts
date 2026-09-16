import type {
	ImageSourcePropType,
	ImageStyle,
	StyleProp,
	ViewStyle,
} from "react-native";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
/**
 * online renders a success-hued corner dot, offline a muted dot;
 * none hides it entirely.
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
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		image?: StyleProp<ImageStyle>;
		fallback?: StyleProp<ViewStyle>;
		status?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
