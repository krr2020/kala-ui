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

import type { ReactElement, ReactNode } from "react";
import { isValidElement, useEffect, useRef, useState } from "react";
import {
	AccessibilityInfo,
	Keyboard,
	Text as RNText,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import {
	descriptionStyle,
	rootStyle,
	titleStyle,
	viewportStyle,
} from "./toast.styles";
import type {
	ToastDescriptionProps,
	ToastProps,
	ToastTitleProps,
} from "./toast.types";

/** joins the text of Title/Description children; icons and other
 * non-text nodes contribute nothing (no empty announcement ever fires) */
function collectAnnouncementText(node: ReactNode): string {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) {
		return node
			.map(collectAnnouncementText)
			.filter((part) => part.length > 0)
			.join(", ");
	}
	if (isValidElement(node)) {
		return collectAnnouncementText(
			(node.props as { children?: ReactNode }).children,
		);
	}
	return "";
}

export function Toast({
	open,
	onOpenChange,
	duration,
	position = "bottom",
	children,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-toast",
}: ToastProps): ReactElement | null {
	const { theme } = useUnistyles();
	const insets = useSafeAreaInsets();
	// a bottom toast must clear the keyboard too, whichever is the taller
	// surface; 0 means no keyboard visible
	const [kbHeight, setKbHeight] = useState(0);
	useEffect(() => {
		const show = Keyboard.addListener("keyboardDidShow", (e) => {
			setKbHeight(e.endCoordinates.height);
		});
		const hide = Keyboard.addListener("keyboardDidHide", () => setKbHeight(0));
		// a toast can mount while a field's keyboard is already open; with
		// no keyboard reported the nav-bar inset is the bottom surface
		const openKb = Keyboard.metrics();
		if (openKb) setKbHeight(openKb.height);
		return () => {
			show.remove();
			hide.remove();
		};
	}, []);
	// timer effect stays keyed on [open, duration] only — a new inline
	// callback each render must not restart the countdown
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;

	useEffect(() => {
		if (!open || duration === undefined) return;
		const timer = setTimeout(() => onOpenChangeRef.current?.(false), duration);
		return () => clearTimeout(timer);
	}, [open, duration]);

	// role=alert only retints the node for screen readers already focused
	// nearby; an explicit announcement is what actually interrupts
	useEffect(() => {
		if (!open) return;
		const text =
			accessibilityLabel?.trim() || collectAnnouncementText(children).trim();
		if (text) AccessibilityInfo.announceForAccessibility(text);
	}, [open, accessibilityLabel, children]);

	if (!open) return null;

	return (
		<View
			testID="k-toast-viewport"
			pointerEvents="box-none"
			style={[
				viewportStyle(position, {
					top: insets.top,
					bottom: Math.max(insets.bottom, kbHeight),
				}),
				applySlot({}, slotStyles?.viewport),
			]}
		>
			<View
				testID={testID}
				// one a11y element for the whole toast (role=alert)
				accessible={true}
				accessibilityRole="alert"
				accessibilityLabel={accessibilityLabel}
				style={[
					rootStyle(theme),
					applySlot(applySlot({}, style), slotStyles?.root),
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
	slotStyles,
	testID = "k-toast-title",
}: ToastTitleProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={applySlot([titleStyle(theme), style], slotStyles?.root)}
		>
			{children}
		</RNText>
	);
}

function ToastDescription({
	children,
	style,
	slotStyles,
	testID = "k-toast-description",
}: ToastDescriptionProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={applySlot([descriptionStyle(theme), style], slotStyles?.root)}
		>
			{children}
		</RNText>
	);
}

Toast.Title = ToastTitle;
Toast.Description = ToastDescription;
