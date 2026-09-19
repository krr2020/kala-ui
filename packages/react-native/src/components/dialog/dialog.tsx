/**
 * Dialog: controlled native modal (RN Modal + transparent backdrop — no
 * portal library needed). Dismissal is gated by `dismissable` for the
 * overlay press, hardware back (Modal's onRequestClose), AND the
 * drag-to-dismiss gesture (raw responder protocol — no gesture
 * library). Content avoids the on-screen keyboard so inputs
 * in the dialog stay visible. Sizes map the web vocabulary: sm/md/lg
 * clamp to a centered panel, `full` opts out of the clamp.
 */

import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { useRef, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";
import { useOverlayFocus } from "../../lib/use-overlay-focus.utils";
import { applySlot } from "../slot-styles";
import {
	cardStyle,
	closeStyle,
	DRAG_DISMISS_THRESHOLD,
	safeTopPadding,
	scrimStyle,
} from "./dialog.styles";
import type { DialogProps } from "./dialog.types";
import { DialogBody } from "./dialog-body";
import { DialogDescription } from "./dialog-description";
import { DialogFooter } from "./dialog-footer";
import { DialogHeader } from "./dialog-header";
import { DialogTitle } from "./dialog-title";

export function Dialog({
	open,
	onOpenChange,
	triggerRef,
	dismissable = true,
	showCloseButton = true,
	size = "md",
	accessibilityLabel,
	accessibilityRole,
	slotStyles,
	testID = "k-dialog",
	children,
}: DialogProps): ReactElement | null {
	const { theme } = useUnistyles();
	const insets = useSafeAreaInsets();
	const isFull = size === "full";
	const [dragDy, setDragDy] = useState(0);
	// start Y of the active drag; null = no gesture in flight
	const dragStart = useRef<number | null>(null);
	// latest callback without re-binding handlers mid-gesture
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;

	const close = () => onOpenChangeRef.current(false);
	const cardRef = useRef<View | null>(null);
	// RN Modal tears its content down the moment visible flips false, so
	// the exited edge is simply !open here
	useOverlayFocus(cardRef, open, !open, triggerRef);

	const responders = dismissable
		? {
				onStartShouldSetResponder: () => true,
				onResponderGrant: (e: { nativeEvent: { pageY: number } }) => {
					dragStart.current = e.nativeEvent.pageY;
					setDragDy(0);
				},
				onResponderMove: (e: { nativeEvent: { pageY: number } }) => {
					if (dragStart.current === null) return;
					// downward drag only — upward is clamped at 0
					setDragDy(Math.max(0, e.nativeEvent.pageY - dragStart.current));
				},
				onResponderRelease: (e: { nativeEvent: { pageY: number } }) => {
					if (dragStart.current !== null) {
						const dy = Math.max(0, e.nativeEvent.pageY - dragStart.current);
						dragStart.current = null;
						setDragDy(0);
						if (dy >= DRAG_DISMISS_THRESHOLD) close();
					}
				},
				onResponderTerminate: () => {
					dragStart.current = null;
					setDragDy(0);
				},
			}
		: {};

	return (
		<Modal
			testID="k-dialog-modal"
			visible={open}
			transparent
			statusBarTranslucent
			navigationBarTranslucent
			animationType="fade"
			onRequestClose={() => {
				if (dismissable) close();
			}}
		>
			<Pressable
				testID={`${testID}-overlay`}
				accessibilityRole="button"
				accessibilityLabel="Close dialog"
				onPress={dismissable ? close : undefined}
				style={applySlot(scrimStyle(theme), slotStyles?.overlay)}
			/>
			{/* box-none: the wrapper only positions the card; taps outside it
			    fall through to the overlay Pressable beneath */}
			<KeyboardAvoidingView
				testID={`${testID}-keyboard-view`}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={0}
				pointerEvents="box-none"
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					alignItems: "center",
					justifyContent: "center",
					// statusBarTranslucent draws under the bar — pad the wrapper
					// to the safe-area top inset and clear the gesture nav bar at
					// the bottom; tiered cards keep their 16 rail, full bleeds
					// horizontally but still clears both bars
					padding: isFull ? 0 : 16,
					paddingTop:
						(isFull ? 0 : 16) + safeTopPadding(insets.top || undefined),
					paddingBottom: isFull ? insets.bottom : 16,
				}}
			>
				<View
					testID={testID}
					ref={cardRef}
					// always one a11y container for the card — the screen reader
					// lands here on open instead of re-scanning loose children
					accessible
					accessibilityViewIsModal
					accessibilityLabel={accessibilityLabel ?? "Dialog"}
					accessibilityRole={accessibilityRole}
					{...responders}
					style={applySlot(cardStyle(theme, size, dragDy), slotStyles?.root)}
				>
					{children}
					{showCloseButton ? (
						<Pressable
							testID="k-dialog-close"
							accessibilityRole="button"
							accessibilityLabel="Close dialog"
							hitSlop={8}
							onPress={close}
							style={applySlot(closeStyle(), slotStyles?.close)}
						>
							<X size={20} color={theme.foreground} />
						</Pressable>
					) : null}
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
