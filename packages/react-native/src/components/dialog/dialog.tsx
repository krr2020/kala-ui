/**
 * Dialog: controlled native modal (RN Modal + transparent backdrop — no
 * portal library needed). Dismissal is gated by `dismissable` for both
 * the overlay press and hardware back (Modal's onRequestClose). Sizes
 * map the web vocabulary: sm/md/lg clamp to a centered panel, `full`
 * opts out of the clamp for content-heavy overlays — the same contract
 * as web Dialog's "full".
 */
import type { ReactElement } from "react";
import { Modal, Pressable, Text as RNText, View } from "react-native";
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
	const close = () => onOpenChange(false);
	const isFull = size === "full";

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
			<View
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
			</View>
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
	return (
		<View testID={testID} style={[{ paddingHorizontal: 24, paddingVertical: 16 }, style]}>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: theme.foreground, fontSize: 14 }}>{children}</RNText>
			) : (
				children
			)}
		</View>
	);
}

Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
