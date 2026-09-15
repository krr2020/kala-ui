/**
 * Dialog: controlled native modal (RN Modal + transparent backdrop — no
 * portal library needed). Dismissal is gated by `dismissable` for the
 * overlay press, hardware back (Modal's onRequestClose), AND the
 * drag-to-dismiss gesture (raw responder protocol, wave-8 Slider style —
 * no gesture library). Content avoids the on-screen keyboard so inputs
 * in the dialog stay visible. Sizes map the web vocabulary: sm/md/lg
 * clamp to a centered panel, `full` opts out of the clamp.
 */
import { useRef, useState } from "react";
import type { ReactElement } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text as RNText,
	View,
} from "react-native";
import { X } from "lucide-react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import type {
	DialogPartProps,
	DialogProps,
	DialogSize,
	DialogTextProps,
} from "./dialog.types";

const MAX_WIDTH: Record<Exclude<DialogSize, "full">, number> = {
	sm: 384,
	md: 512,
	lg: 672,
};

const DRAG_DISMISS_THRESHOLD = 96;
const MIN_DRAG_OPACITY = 0.5;

export function Dialog({
	open,
	onOpenChange,
	dismissable = true,
	showCloseButton = true,
	size = "md",
	accessibilityLabel,
	testID = "k-dialog",
	children,
}: DialogProps): ReactElement | null {
	const { theme } = useUnistyles();
	const [dragDy, setDragDy] = useState(0);
	// start Y of the active drag; null = no gesture in flight
	const dragStart = useRef<number | null>(null);
	// latest callback without re-binding handlers mid-gesture
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;

	const close = () => onOpenChangeRef.current(false);
	const isFull = size === "full";

	// drag opacity fades linearly to 0.5 across the threshold distance
	const dragOpacity =
		1 - Math.min(dragDy, DRAG_DISMISS_THRESHOLD) * (1 - MIN_DRAG_OPACITY) / DRAG_DISMISS_THRESHOLD;

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
			visible={open}
			transparent
			statusBarTranslucent
			animationType="fade"
			onRequestClose={() => {
				if (dismissable) close();
			}}
		>
			<Pressable
				testID="k-dialog-overlay"
				accessibilityRole="button"
				accessibilityLabel="Close dialog"
				onPress={dismissable ? close : undefined}
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					backgroundColor: "rgba(0,0,0,0.5)",
				}}
			/>
			{/* box-none: the wrapper only positions the card; taps outside it
			    fall through to the overlay Pressable beneath */}
			<KeyboardAvoidingView
				testID="k-dialog-keyboard-view"
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
					padding: 16,
				}}
			>
				<View
					testID={testID}
					accessibilityViewIsModal
					accessibilityLabel={accessibilityLabel}
					{...responders}
					style={{
						width: isFull ? "100%" : "90%",
						height: isFull ? "100%" : undefined,
						maxWidth: isFull ? undefined : MAX_WIDTH[size],
						maxHeight: isFull ? undefined : "90%",
						borderRadius: isFull ? 0 : tokens.radius.card,
						backgroundColor: theme.card,
						borderWidth: 1,
						borderColor: theme.border,
						overflow: "hidden",
						opacity: dragOpacity,
					}}
				>
					{children}
					{showCloseButton ? (
						<Pressable
							testID="k-dialog-close"
							accessibilityRole="button"
							accessibilityLabel="Close dialog"
							hitSlop={8}
							onPress={close}
							style={{
								position: "absolute",
								top: 10,
								right: 10,
								padding: 6,
								borderRadius: tokens.radius.control,
							}}
						>
							<X size={20} color={theme.foreground} />
						</Pressable>
					) : null}
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

function DialogHeader({ children, style, testID = "k-dialog-header" }: DialogPartProps) {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[
				{
					paddingHorizontal: 24,
					paddingVertical: 16,
					borderBottomWidth: 1,
					borderColor: theme.border,
					gap: 6,
				},
				style,
			]}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: theme.foreground, fontSize: 14 }}>{children}</RNText>
			) : (
				children
			)}
		</View>
	);
}

function DialogFooter({ children, style, testID = "k-dialog-footer" }: DialogPartProps) {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[
				{
					flexDirection: "row",
					justifyContent: "flex-end",
					flexWrap: "wrap",
					gap: 8,
					paddingHorizontal: 24,
					paddingVertical: 16,
					borderTopWidth: 1,
					borderColor: theme.border,
					backgroundColor: theme.muted,
				},
				style,
			]}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: theme.foreground, fontSize: 14 }}>{children}</RNText>
			) : (
				children
			)}
		</View>
	);
}

function DialogTitle({ children, style, testID = "k-dialog-title" }: DialogTextProps) {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			accessibilityRole="header"
			style={[{ color: theme.foreground, fontSize: 18, fontWeight: "600" }, style]}
		>
			{children}
		</RNText>
	);
}

function DialogDescription({
	children,
	style,
	testID = "k-dialog-description",
}: DialogTextProps) {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[{ color: theme.mutedForeground, fontSize: 14 }, style]}
		>
			{children}
		</RNText>
	);
}

function DialogBody({ children, style, testID = "k-dialog-body" }: DialogPartProps) {
	const { theme } = useUnistyles();
	// ScrollView: long content scrolls; taps survive an open keyboard
	// ("handled") so pressing Submit doesn't dismiss the keyboard first
	// and swallow the press
	return (
		<ScrollView
			testID={testID}
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
			style={style}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: theme.foreground, fontSize: 14 }}>{children}</RNText>
			) : (
				children
			)}
		</ScrollView>
	);
}

Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
