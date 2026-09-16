import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import type { AvatarSize } from "../avatar";

export interface AvatarItem {
	/** full name — rendered by Avatar as image alt/initials and summarized in the group label */
	name: string;
	/** optional remote/local image source; initials render without it */
	source?: ImageSourcePropType;
}

export interface AvatarGroupProps {
	avatars: AvatarItem[];
	/** visible avatar count before the "+N" overflow chip; default 4 */
	max?: number;
	/** passes through to each Avatar */
	size?: AvatarSize;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
