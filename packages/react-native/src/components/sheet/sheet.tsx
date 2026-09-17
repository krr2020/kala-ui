/**
 * Sheet: bottom sheet with fixed snap points (peek/half/full) or
 * content-hugging sizing (auto, clamped by maxHeight) inside a native
 * transparent Modal, overlay press-to-dismiss gated by `dismissable`,
 * Android hardware back via Modal onRequestClose, grabber handle, and
 * drag-to-dismiss via RNGH Pan + Reanimated. Entrance and exit are eased
 * timing slides (bottom→snap on open, snap→bottom on close) — springs are
 * reserved for the drag spring-back gesture. The Modal (not an absolute
 * fill) owns the window: an `inset`-shorthand absolute root silently
 * collapses on native, so the sheet is a flex:1 child of the modal window
 * instead.
 */

import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { motion, tokens } from "../../tokens";
import { Icon } from "../icon";
import { applySlot } from "../slot-styles";
import {
	composeOffset,
	OFFSCREEN_Y,
	SHEET_EASE,
	sheetCloseHit,
	sheetHeader,
	sheetTitle,
} from "./sheet.styles";
import type { SheetBodyProps, SheetProps, SheetSnap } from "./sheet.types";

const SNAP_HEIGHT: Record<Exclude<SheetSnap, "auto">, number | `${number}%`> = {
	peek: 120,
	half: "50%",
	full: "90%",
};

const MAX_HEIGHT_RATIO = 0.85;

const ENTER_CONFIG = {
	duration: motion.duration.base,
	easing: SHEET_EASE,
} as const;
const EXIT_CONFIG = {
	duration: motion.duration.fast,
	easing: SHEET_EASE,
} as const;

const DRAG_DISMISS_THRESHOLD = 96;

// pressable carrying the fade-in overlay opacity
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Sheet({
	open,
	onClose,
	snap = "peek",
	maxHeight,
	title,
	showClose = true,
	dismissable = true,
	scrollable = false,
	avoidKeyboard = false,
	style,
	slotStyles,
	children,
}: SheetProps): ReactElement | null {
	const { theme } = useUnistyles();
	const [mounted, setMounted] = useState(open);
	const { height: windowHeight } = useWindowDimensions();

	// entry/exit offset: OFFSCREEN_Y until the content is measured, then
	// the snap height (offscreen start) springing to 0, or back on exit
	const entry = useSharedValue(OFFSCREEN_Y);
	const overlay = useSharedValue(0);
	// user drag offset, composed with entry so both can act at once
	const ty = useSharedValue(0);

	useEffect(() => {
		if (open) {
			setMounted(true);
			// enter as soon as the height is known; OFFSCREEN_Y until then
			if (entry.value !== OFFSCREEN_Y) {
				entry.value = withTiming(0, ENTER_CONFIG);
				overlay.value = withTiming(1, ENTER_CONFIG);
			}
			return;
		}
		if (!mounted) return;
		// slide back down, then unmount when it completes
		overlay.value = withTiming(0, EXIT_CONFIG);
		entry.value = withTiming(entry.value + 10000, EXIT_CONFIG, (finished) => {
			if (finished) runOnJS(setMounted)(false);
		});
	}, [open, mounted, entry, overlay]);

	const onContentLayout = useCallback(
		(event: { nativeEvent: { layout: { height: number } } }) => {
			if (entry.value === OFFSCREEN_Y && open) {
				entry.value = event.nativeEvent.layout.height;
				entry.value = withTiming(0, ENTER_CONFIG);
				overlay.value = withTiming(1, ENTER_CONFIG);
			}
		},
		[entry, overlay, open],
	);

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
		transform: [{ translateY: composeOffset(entry.value, ty.value) }],
	}));

	const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));

	if (!mounted) return null;

	return (
		<Modal
			testID="k-sheet-modal"
			visible
			transparent
			animationType="none"
			statusBarTranslucent
			// Android hardware back; a locked sheet stays open
			onRequestClose={dismissable ? onClose : () => {}}
		>
			{/* the Modal is its own native window — gestures inside it need
			 * their own root view or the drag-to-dismiss pan never attaches */}
			<GestureHandlerRootView testID="k-sheet-gesture-root" style={{ flex: 1 }}>
				<View
					testID="k-sheet-root"
					style={applySlot(applySlot({ flex: 1 }, slotStyles?.root), style)}
				>
					<AnimatedPressable
						testID="k-sheet-overlay"
						accessibilityRole="button"
						accessibilityLabel="Close sheet"
						onPress={dismissable ? onClose : undefined}
						style={[
							overlayStyle,
							applySlot(
								{
									position: "absolute",
									top: 0,
									right: 0,
									bottom: 0,
									left: 0,
									backgroundColor: "rgba(0,0,0,0.5)",
								},
								slotStyles?.overlay,
							),
						]}
					/>
					<KeyboardAvoidingView
						behavior={
							avoidKeyboard && Platform.OS === "ios" ? "padding" : undefined
						}
						pointerEvents="box-none"
						style={{ flex: 1, justifyContent: "flex-end" }}
					>
						<GestureDetector gesture={pan}>
							<Animated.View
								testID="k-sheet-content"
								accessibilityViewIsModal
								onLayout={onContentLayout}
								style={[
									sheetStyle,
									applySlot(
										{
											position: "absolute",
											left: 0,
											right: 0,
											bottom: 0,
											// auto hugs content under maxHeight; fixed snaps pin height
											...(snap === "auto"
												? {
														maxHeight:
															maxHeight ??
															Math.round(windowHeight * MAX_HEIGHT_RATIO),
													}
												: { height: SNAP_HEIGHT[snap] }),
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
										slotStyles?.content,
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
										slotStyles?.grabber,
									)}
								/>
								{title ? (
									<View testID="k-sheet-header" style={sheetHeader()}>
										<Text
											testID="k-sheet-title"
											style={applySlot(sheetTitle(theme), slotStyles?.title)}
										>
											{title}
										</Text>
										{showClose && dismissable ? (
											<Pressable
												testID="k-sheet-close"
												accessibilityRole="button"
												accessibilityLabel="Close"
												onPress={onClose}
												style={sheetCloseHit()}
											>
												<Icon icon={X} size="sm" color="mutedForeground" />
											</Pressable>
										) : null}
									</View>
								) : null}
								{scrollable ? (
									<ScrollView
										testID="k-sheet-scroll"
										showsVerticalScrollIndicator={false}
										contentContainerStyle={{ gap: 4, paddingBottom: 8 }}
									>
										{children}
									</ScrollView>
								) : (
									children
								)}
							</Animated.View>
						</GestureDetector>
					</KeyboardAvoidingView>
				</View>
			</GestureHandlerRootView>
		</Modal>
	);
}

export function SheetBody({
	children,
	slotStyles,
}: SheetBodyProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View testID="k-sheet-body" style={applySlot({ gap: 8 }, slotStyles?.root)}>
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
