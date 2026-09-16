/**
 * Toast: declarative controlled toast — web's sonner toaster is an
 * imperative DOM portal with no native equivalent, so apps render
 * <Toast open={...}> and own the state. The auto-dismiss timer lives in
 * one effect keyed on [open, duration]: it restarts on reopen or
 * reschedule and is cleared on close/unmount, so no stale callback can
 * fire after the app already closed the toast. The viewport passes
 * touches through (pointerEvents box-none) so an open toast never
 * blocks the screen behind it.
 */

import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type {
	ToastDescriptionProps,
	ToastProps,
	ToastTitleProps,
} from "./toast.types";

export function Toast({
	open,
	onOpenChange,
	duration,
	position = "bottom",
	children,
	accessibilityLabel,
	style,
	styles,
	testID = "k-toast",
}: ToastProps): ReactElement | null {
	const { theme } = useUnistyles();
	// timer effect stays keyed on [open, duration] only — a new inline
	// callback each render must not restart the countdown
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;

	useEffect(() => {
		if (!open || duration === undefined) return;
		const timer = setTimeout(() => onOpenChangeRef.current?.(false), duration);
		return () => clearTimeout(timer);
	}, [open, duration]);

	if (!open) return null;

	return (
		<View
			testID="k-toast-viewport"
			pointerEvents="box-none"
			style={[
				{
					...({ position: "absolute", inset: 0 } as const),
					zIndex: 200,
					justifyContent: position === "top" ? "flex-start" : "flex-end",
					padding: 16,
				},
				styles?.viewport,
			]}
		>
			<View
				testID={testID}
				// one a11y element for the whole toast (role=alert)
				accessible={true}
				accessibilityRole="alert"
				accessibilityLabel={accessibilityLabel}
				style={[
					{
						alignSelf: "stretch",
						backgroundColor: theme.card,
						borderWidth: 1,
						borderColor: theme.border,
						borderRadius: 10,
						padding: 14,
						gap: 2,
					},
					applySlot(applySlot({}, style), styles?.root),
				]}
			>
				{children}
			</View>
		</View>
	);
}

function ToastTitle({
	children,
	style,
	styles,
	testID = "k-toast-title",
}: ToastTitleProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={applySlot(
				[{ color: theme.foreground, fontSize: 15, fontWeight: "600" }, style],
				styles?.root,
			)}
		>
			{children}
		</RNText>
	);
}

function ToastDescription({
	children,
	style,
	styles,
	testID = "k-toast-description",
}: ToastDescriptionProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={applySlot(
				[{ color: theme.mutedForeground, fontSize: 14 }, style],
				styles?.root,
			)}
		>
			{children}
		</RNText>
	);
}

Toast.Title = ToastTitle;
Toast.Description = ToastDescription;
