/**
 * Sheet: bottom sheet with three snap points (peek/half/full), overlay
 * press-to-dismiss gated by `dismissable`, grabber handle, and drag-to-
 * dismiss via RNGH Pan + Reanimated springs from the motion tokens.
 */
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { motion, tokens } from "../../tokens";
import { applySlot } from "../slot-styles";
import type { SheetBodyProps, SheetProps, SheetSnap } from "./sheet.types";

const SNAP_HEIGHT: Record<SheetSnap, number | `${number}%`> = {
	peek: 120,
	half: "50%",
	full: "90%",
};

const DRAG_DISMISS_THRESHOLD = 96;

export function Sheet({
	open,
	onClose,
	snap = "peek",
	dismissable = true,
	style,
	styles,
	children,
}: SheetProps): ReactElement | null {
	const { theme } = useUnistyles();
	const ty = useSharedValue(0);

	const pan = Gesture.Pan()
		.onUpdate((event) => {
			ty.value = Math.max(0, event.translationY);
		})
		.onEnd((event) => {
			if (event.translationY > DRAG_DISMISS_THRESHOLD) {
				runOnJS(onClose)();
			} else {
				ty.value = withSpring(0, motion.spring.gentle);
			}
		});

	const sheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: ty.value }],
	}));

	if (!open) return null;

	return (
		<View
			testID="k-sheet-root"
			style={applySlot(
				applySlot(
					{
						...({ position: "absolute", inset: 0 } as const),
						zIndex: 100,
					},
					styles?.root,
				),
				style,
			)}
		>
			<Pressable
				testID="k-sheet-overlay"
				accessibilityRole="button"
				accessibilityLabel="Close sheet"
					onPress={dismissable ? onClose : undefined}
					style={applySlot(
						{
							position: "absolute",
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
							backgroundColor: "rgba(0,0,0,0.5)",
						},
						styles?.overlay,
					)}
			/>
			<GestureDetector gesture={pan}>
				<Animated.View
					testID="k-sheet-content"
					accessibilityViewIsModal
					style={[
						sheetStyle,
						applySlot(
							{
								position: "absolute",
								left: 0,
								right: 0,
								bottom: 0,
								height: SNAP_HEIGHT[snap],
								backgroundColor: theme.card,
								borderTopLeftRadius: tokens.radius.card,
								borderTopRightRadius: tokens.radius.card,
								borderTopWidth: 1,
								borderColor: theme.border,
								paddingTop: 8,
								paddingBottom: tokens.space.cardPad,
								paddingHorizontal: tokens.space.gutter,
								gap: 12,
							},
							styles?.content,
						),
					]}
				>
					<View
						testID="k-sheet-grabber"
						accessibilityLabel="Drag to dismiss"
						style={applySlot(
							{
								alignSelf: "center",
								width: 36,
								height: 4,
								borderRadius: 2,
								backgroundColor: theme.muted,
							},
							styles?.grabber,
						)}
					/>
					{children}
				</Animated.View>
			</GestureDetector>
		</View>
	);
}

export function SheetBody({
	children,
	styles,
}: SheetBodyProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View testID="k-sheet-body" style={applySlot({ gap: 8 }, styles?.root)}>
			{typeof children === "string" || typeof children === "number" ? (
				<Text style={{ color: theme.foreground, fontSize: 14 }}>
					{children}
				</Text>
			) : (
				children
			)}
		</View>
	);
}

Sheet.Body = SheetBody;
