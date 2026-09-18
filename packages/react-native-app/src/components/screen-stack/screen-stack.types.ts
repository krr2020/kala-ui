import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/** How a screen appears over (and disappears from) the stack. */
export type ScreenStackPresentation =
	| "push"
	| "left"
	| "modal"
	| "top"
	| "center"
	| "none";

export type ScreenStackEntry = {
	/**
	 * Stable, unique identity. The stack diffs by key: appending one key
	 * pushes, dropping the top pops, a same-length top change replaces,
	 * anything else is an instant reset.
	 */
	key: string;
	/** Defaults to "push". */
	presentation?: ScreenStackPresentation;
	children: ReactNode;
};

export type ScreenStackProps = {
	/** entries[0] is the root and always stays mounted; the last is visible. */
	entries: ScreenStackEntry[];
	/**
	 * Android hardware back and (when enabled) modal scrim press delegate
	 * here — the app owns the navigation state and pops one entry.
	 */
	onRequestPop: () => void;
	/** Allow the modal scrim to pop. Off by default: destructive tasks
	 * must not be dismissable by an accidental scrim tap (pattern 5). */
	dismissOnScrimPress?: boolean;
	style?: StyleProp<ViewStyle>;
	styles?: {
		root?: StyleProp<ViewStyle>;
		scrim?: StyleProp<ViewStyle>;
	};
	testID?: string;
};
