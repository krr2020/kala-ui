import type { ReactNode } from "react";
import type {
	ImageSourcePropType,
	ImageStyle,
	StyleProp,
	TextStyle,
	ViewStyle,
} from "react-native";

export type CardVariant = "flat" | "elevated" | "outlined";
/** `none` drops root padding so CardImage / compound parts own their own. */
export type CardPadding = "none" | "md";

/**
 * Card is a pure surface by default — no onPress, no press feedback.
 * Passing onPress turns it into a pressable with button semantics and
 * a radius-clipped pressed layer, the way web cards compose a button.
 */
export interface CardProps {
	children?: ReactNode;
	/** flat = hairline border, elevated = shadow, outlined = strong border. */
	variant?: CardVariant;
	/** Root padding; compound layouts pass "none" and let parts pad. */
	padding?: CardPadding;
	/** Swaps children for the built-in skeleton stack. */
	isLoading?: boolean;
	/** Replaces the generated skeleton entirely. */
	skeleton?: ReactNode;
	/** Makes the card pressable with button a11y semantics. */
	onPress?: () => void;
	/** Disables the pressable arm; never fires onPress while set. */
	disabled?: boolean;
	/** Optional label when the card's content isn't its own description. */
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface CardHeaderProps {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface CardTitleProps {
	children: ReactNode;
	style?: StyleProp<TextStyle>;
	slotStyles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}

export interface CardSubtitleProps {
	children: ReactNode;
	style?: StyleProp<TextStyle>;
	slotStyles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}

export interface CardDescriptionProps {
	children: ReactNode;
	style?: StyleProp<TextStyle>;
	slotStyles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}

export interface CardActionProps {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface CardContentProps {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface CardFooterProps {
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface CardImageProps {
	source: ImageSourcePropType;
	/** Feeds the accessibility label; RN images have no alt attribute. */
	alt?: string;
	/** Rounds only the top corners so media meets following anatomy flush. */
	flush?: boolean;
	/** Defaults: width 100%, aspect 16/9, cover. */
	style?: StyleProp<ImageStyle>;
	slotStyles?: {
		root?: StyleProp<ImageStyle>;
	};
	testID?: string;
}

export interface CardImageOverlayProps {
	children?: ReactNode;
	/** Dark backdrop behind the content so copy reads on any image. @default true */
	scrim?: boolean;
	style?: StyleProp<ViewStyle>;
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export type CardMarkerPosition =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";
export type CardMarkerVariant = "default" | "icon";
export type CardMarkerColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted";

export interface CardMarkerProps {
	children?: ReactNode;
	/** Corner the marker pins to. @default "top-left" */
	position?: CardMarkerPosition;
	/** default = text chip, icon = 44dp circle. @default "default" */
	variant?: CardMarkerVariant;
	/** Semantic palette; missing theme ramps fall back to the muted chip. */
	color?: CardMarkerColor;
	style?: StyleProp<ViewStyle>;
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
