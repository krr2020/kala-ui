/**
 * AlertDialog: destructive-confirmation modal sharing Dialog's layout
 * vocabulary. Defaults to NOT dismissable (no overlay press, no hardware
 * back) — dismissal only happens through the explicit Action/Cancel
 * affordances, mirroring web radix alert semantics. The container
 * surfaces as a single accessibility alert element.
 */
import { createContext, useContext } from "react";
import type { ReactElement } from "react";
import { Modal, Text as RNText, View } from "react-native";
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

export function AlertDialog({
	open,
	onOpenChange,
	dismissable = false,
	accessibilityLabel,
	testID = "k-alert-dialog",
	children,
}: AlertDialogProps): ReactElement | null {
	const { theme } = useUnistyles();

	return (
		<Modal
			visible={open}
			transparent
			statusBarTranslucent
			animationType="fade"
			onRequestClose={() => {
				if (dismissable) onOpenChange(false);
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
			<View
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
					style={{
						width: "90%",
						maxWidth: 512,
						borderRadius: tokens.radius.card,
						backgroundColor: theme.card,
						borderWidth: 1,
						borderColor: theme.border,
						overflow: "hidden",
					}}
				>
					<AlertDialogContext.Provider value={{ close: () => onOpenChange(false) }}>
						{children}
					</AlertDialogContext.Provider>
				</View>
			</View>
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
		<View
			testID={testID}
			style={[{ paddingHorizontal: 24, paddingVertical: 16 }, style]}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: theme.foreground, fontSize: 14 }}>{children}</RNText>
			) : (
				children
			)}
		</View>
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
