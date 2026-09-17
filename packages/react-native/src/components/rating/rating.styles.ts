import type { ViewStyle } from "react-native";

/** muted foreground at 30% alpha — RN hex strings take an 8-digit form */
export function emptyStarColor(mutedForeground: string): string {
	return `${mutedForeground}4D`;
}

export function root(disabled: boolean): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		opacity: disabled ? 0.5 : 1,
	};
}

export function starHit(): ViewStyle {
	return {
		minWidth: 44,
		minHeight: 44,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 2,
	};
}
