/**
 * Non-component wiring for Steps: the numbered circle geometry and the
 * root/step/connector/text tables for both orientations.
 */

import type { KalaTheme } from "@kala-ui/react-native/types";
import type { TextStyle, ViewStyle } from "react-native";
import type { StepsOrientation } from "./steps.types";

export const CIRCLE = 32;

export const rootStyle = (orientation: StepsOrientation): ViewStyle => ({
	flexDirection: orientation === "vertical" ? "column" : "row",
	alignItems: orientation === "vertical" ? "flex-start" : "flex-start",
});

export function stepStyle(
	orientation: StepsOrientation,
	isLast: boolean,
): ViewStyle {
	return {
		flex: orientation === "vertical" ? undefined : 1,
		flexDirection: "column",
		alignItems: orientation === "vertical" ? "flex-start" : "center",
		paddingBottom: orientation === "vertical" && !isLast ? 32 : 0,
	};
}

/** horizontal connector runs from the circle's center to the step edge */
export const hLineStyle = (theme: KalaTheme): ViewStyle => ({
	position: "absolute",
	top: CIRCLE / 2 - 1,
	left: "50%",
	right: 0,
	height: 2,
	backgroundColor: theme.separator,
});

/** vertical connector hangs below the circle, rail-width 2 */
export const vLineStyle = (theme: KalaTheme): ViewStyle => ({
	position: "absolute",
	top: CIRCLE + 8,
	bottom: 0,
	left: CIRCLE / 2 - 1,
	width: 2,
	backgroundColor: theme.separator,
});

export function indicatorStyle(
	theme: KalaTheme,
	state: { isActive: boolean; isCompleted: boolean },
): ViewStyle {
	const active = state.isActive || state.isCompleted;
	return {
		width: CIRCLE,
		height: CIRCLE,
		borderRadius: CIRCLE / 2,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
		transform: [{ scale: state.isActive ? 1.1 : 1 }],
		borderColor: active ? theme.primary : theme.border,
		backgroundColor: active ? theme.primary : theme.background,
	};
}

export function numberStyle(
	theme: KalaTheme,
	state: { isActive: boolean; isCompleted: boolean },
): TextStyle {
	return {
		fontSize: 14,
		fontWeight: "600",
		color:
			state.isActive || state.isCompleted
				? theme.primaryForeground
				: theme.mutedForeground,
	};
}

export function labelBlockStyle(orientation: StepsOrientation): ViewStyle {
	return {
		marginTop: orientation === "vertical" ? 0 : 8,
		marginLeft: orientation === "vertical" ? 12 : 0,
		alignItems: orientation === "vertical" ? "flex-start" : "center",
		flex: orientation === "vertical" ? 1 : undefined,
	};
}

export function titleStyle(theme: KalaTheme, isActive: boolean): TextStyle {
	return {
		fontSize: 14,
		fontWeight: "500",
		color: isActive ? theme.primary : theme.foreground,
	};
}

export function descriptionStyle(theme: KalaTheme): TextStyle {
	return {
		fontSize: 12,
		marginTop: 2,
		color: theme.mutedForeground,
	};
}
