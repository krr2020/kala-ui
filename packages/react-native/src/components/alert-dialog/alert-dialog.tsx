/**
 * AlertDialog: destructive-confirmation modal sharing Dialog's layout
 * vocabulary and mobile hardening (drag-to-dismiss gated by
 * `dismissable`, keyboard avoidance, scrollable body). Defaults to NOT
 * dismissable — no overlay press, no hardware back, no drag — dismissal
 * only happens through the explicit Action/Cancel affordances, mirroring
 * web radix alert semantics. The container surfaces as a single
 * accessibility alert element.
 */
import { createContext, useContext, useRef, useState } from "react";
import type { ReactElement } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	Text as RNText,
	View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import { Button } from "../button";
import type { ButtonProps } from "../button";
import type {
	AlertDialogPartProps,
	AlertDialogProps,
	AlertDialogTextProps,
} from "./alert-dialog.types";

interface AlertDialogContextValue {
	close: () => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

const DRAG_DISMISS_THRESHOLD = 96;
const MIN_DRAG_OPACITY = 0.5;

export function AlertDialog({
	open,
	onOpenChange,
	dismissable = false,
	accessibilityLabel,
	testID = "k-alert-dialog",
	children,
}: AlertDialogProps): ReactElement | null {
	const { theme } = useUnistyles();
	const [dragDy, setDragDy] = useState(0);
	// start Y of the active drag; null = no gesture in flight
	const dragStart = useRef<number | null>(null);
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;

	const dragOpacity =
		1 -
		(Math.min(dragDy, DRAG_DISMISS_THRESHOLD) * (1 - MIN_DRAG_OPACITY)) /
			DRAG_DISMISS_THRESHOLD;

	const responders = dismissable
		? {
				onStartShouldSetResponder: () => true,
				onResponderGrant: (e: { nativeEvent: { pageY: number } }) => {
					dragStart.current = e.nativeEvent.pageY;
					setDragDy(0);
				},
				onResponderMove: (e: { nativeEvent: { pageY: number } }) => {
					if (dragStart.current === null) return;
					setDragDy(Math.max(0, e.nativeEvent.pageY - dragStart.current));
				},
				onResponderRelease: (e: { nativeEvent: { pageY: number } }) => {
					if (dragStart.current !== null) {
						const dy = Math.max(0, e.nativeEvent.pageY - dragStart.current);
						dragStart.current = null;
						setDragDy(0);
						if (dy >= DRAG_DISMISS_THRESHOLD) onOpenChangeRef.current(false);
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
				if (dismissable) onOpenChangeRef.current(false);
			}}
		>
			<View
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					backgroundColor: "rgba(0,0,0,0.5)",
				}}
			/>
			<KeyboardAvoidingView
				testID="k-alert-dialog-keyboard-view"
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
					// one a11y element for the whole alert (same idiom as Alert/Toast)
					accessible
					accessibilityRole="alert"
					accessibilityLabel={accessibilityLabel}
					{...responders}
					style={{
						width: "90%",
						maxWidth: 512,
						borderRadius: tokens.radius.card,
						backgroundColor: theme.card,
						borderWidth: 1,
						borderColor: theme.border,
						overflow: "hidden",
						opacity: dragOpacity,
					}}
				>
					<AlertDialogContext.Provider value={{ close: () => onOpenChangeRef.current(false) }}>
						{children}
					</AlertDialogContext.Provider>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

function AlertDialogHeader({
	children,
	style,
	testID = "k-alert-dialog-header",
}: AlertDialogPartProps) {
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

function AlertDialogFooter({
	children,
	style,
	testID = "k-alert-dialog-footer",
}: AlertDialogPartProps) {
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

function AlertDialogTitle({
	children,
	style,
	testID = "k-alert-dialog-title",
}: AlertDialogTextProps) {
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

function AlertDialogDescription({
	children,
	style,
	testID = "k-alert-dialog-description",
}: AlertDialogTextProps) {
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

function AlertDialogBody({
	children,
	style,
	testID = "k-alert-dialog-body",
}: AlertDialogPartProps) {
	const { theme } = useUnistyles();
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

/** Both affordances close the dialog first, then run their own onPress. */
function AlertDialogAction({
	onPress,
	testID = "k-alert-dialog-action",
	children,
	...buttonProps
}: ButtonProps): ReactElement {
	const ctx = useContext(AlertDialogContext);
	return (
		<Button
			{...buttonProps}
			testID={testID}
			onPress={() => {
				ctx?.close();
				onPress?.();
			}}
		>
			{children}
		</Button>
	);
}

function AlertDialogCancel({
	onPress,
	testID = "k-alert-dialog-cancel",
	children,
	...buttonProps
}: ButtonProps): ReactElement {
	const ctx = useContext(AlertDialogContext);
	return (
		<Button
			{...buttonProps}
			variant="outline"
			testID={testID}
			onPress={() => {
				ctx?.close();
				onPress?.();
			}}
		>
			{children}
		</Button>
	);
}

AlertDialog.Header = AlertDialogHeader;
AlertDialog.Footer = AlertDialogFooter;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Body = AlertDialogBody;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;
