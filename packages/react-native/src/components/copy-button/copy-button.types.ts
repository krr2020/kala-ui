import type { ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { ButtonColor, ButtonVariant } from "../button/button.types";

/** Injects the platform clipboard writer; RN has no navigator.clipboard. */
export type ClipboardWriter = (text: string) => Promise<void>;

export interface CopyButtonProps {
	/** Text to copy to clipboard */
	value: string;
	/** Duration in ms to show the success state */
	timeout?: number;
	/** Platform clipboard writer; defaults to navigator.clipboard.writeText when present */
	writeClipboard?: ClipboardWriter;
	/** Called once per failed copy (writer rejection or missing API) */
	onError?: (error: Error) => void;
	/** Element shown in the copy state (default: Copy icon) */
	copyIcon?: ReactElement;
	/** Element shown in the success state (default: Check icon) */
	checkIcon?: ReactElement;
	/** Accessible label */
	accessibilityLabel?: string;
	variant?: ButtonVariant;
	color?: ButtonColor;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
}
