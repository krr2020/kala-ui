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
 * instead. Keyboard avoidance lifts the sheet when the budget allows and
 * otherwise shrinks it by the visible keyboard height so the pinned
 * footer always rides above the keyboard.
 */

import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Keyboard,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import type { KeyboardEventName } from "react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";
import { motion, tokens } from "../../tokens";
import { Icon } from "../icon";
import { applySlot } from "../slot-styles";
import {
	composeOffset,
	keyboardLift,
	keyboardShrink,
	KEYBOARD_BOTTOM_GAP,
	OFFSCREEN_Y,
	sheetCloseBubble,
	sheetCloseHit,
	SHEET_EASE,
	sheetFooter,
	sheetHeader,
	sheetOverlay,
	sheetTitle,
} from "./sheet.styles";
import type { SheetBodyProps, SheetProps, SheetSnap } from "./sheet.types";

const PEEK_HEIGHT = 120;
const HALF_RATIO = 0.5;
const FULL_RATIO = 0.9;

const MAX_HEIGHT_RATIO = 0.85;

const ENTER_CONFIG = {
	duration: motion.duration.slow,
	easing: SHEET_EASE,
} as const;
const EXIT_CONFIG = {
	duration: motion.duration.slow,
	easing: SHEET_EASE,
} as const;

const DRAG_DISMISS_THRESHOLD = 96;

/** static snap height in px (percent snaps resolve against the window) */
function snapPixelHeight(
	snap: Exclude<SheetSnap, "auto">,
	windowHeight: number,
	topInset: number,
): number {
	if (snap === "peek") return PEEK_HEIGHT;
	if (snap === "half") return Math.round(windowHeight * HALF_RATIO);
	return topInset > windowHeight * 0.1
		? windowHeight - topInset
		: Math.round(windowHeight * FULL_RATIO);
}

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
	footer,
	style,
	slotStyles,
	children,
}: SheetProps): ReactElement | null {
	const { theme } = useUnistyles();
	const [mounted, setMounted] = useState(open);
	const { height: windowHeight } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	// measured content height drives the status-bar-safe keyboard lift
	const contentHeight = useRef(0);
	// bottom padding mode: keyboard up swaps the nav-bar clearance for a
	// small gap (the keyboard itself is the surface to clear then)
	const [kbUp, setKbUp] = useState(false);
	// height the sheet sheds while the keyboard covers its lower reach —
	// used when lifting alone can't clear the keyboard (tall/full sheets)
	const [kbShrink, setKbShrink] = useState(0);

	// entry/exit offset: OFFSCREEN_Y until the content is measured, then
	// the snap height (offscreen start) springing to 0, or back on exit
	const entry = useSharedValue(OFFSCREEN_Y);
	const overlay = useSharedValue(0);
	// user drag offset, composed with entry so both can act at once
	const ty = useSharedValue(0);
	// keyboard lift; 0 whenever the shrink already covers the keyboard
	const kb = useSharedValue(0);

	const baseHeight =
		snap === "auto"
			? undefined
			: snapPixelHeight(snap, windowHeight, insets.top);

	// Keyboard avoidance on both platforms: lift the sheet by the visible
	// keyboard height, clamped so the sheet top can never ride into the
	// status bar; when the budget runs out (tall/full sheets) shrink the
	// sheet instead so the pinned footer stays above the keyboard. iOS
	// fires the Will pair; Android only has the Did pair.
	useEffect(() => {
		if (!avoidKeyboard) return;
		const events: { show: KeyboardEventName; hide: KeyboardEventName } =
			Platform.OS === "ios"
				? { show: "keyboardWillShow", hide: "keyboardWillHide" }
				: { show: "keyboardDidShow", hide: "keyboardDidHide" };
		const apply = (height: number): void => {
			const sheetHeight =
				contentHeight.current ||
				(baseHeight ?? Math.round(windowHeight * MAX_HEIGHT_RATIO));
			kb.value = keyboardLift({
				kbHeight: height,
				windowHeight,
				topInset: insets.top,
				sheetHeight,
			});
			// shed only the height that would poke above the top inset once lifted
			setKbShrink(
				keyboardShrink({
					kbHeight: height,
					windowHeight,
					topInset: insets.top,
					sheetHeight,
				}),
			);
			setKbUp(height > 0);
		};
		const show = Keyboard.addListener(events.show, (e) => {
			apply(e.endCoordinates.height);
		});
		const hide = Keyboard.addListener(events.hide, () => apply(0));
		// a sheet can mount while a field's keyboard is already open
		const openKb = Keyboard.metrics();
		if (openKb) apply(openKb.height);
		return () => {
			show.remove();
			hide.remove();
		};
	}, [avoidKeyboard, kb, windowHeight, insets.top, baseHeight]);

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
		(event: {
			nativeEvent: { layout: { height: number } };
		}) => {
			contentHeight.current = event.nativeEvent.layout.height;
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
			transform: [{ translateY: composeOffset(entry.value, ty.value, kb.value) }],
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
			navigationBarTranslucent
			// Android hardware back; a locked sheet stays open
			onRequestClose={dismissable ? onClose : () => {}}
		>
				{/* the Modal is its own native window — gestures inside it need
				 * their own root view or the drag-to-dismiss pan never attaches */}
				<GestureHandlerRootView testID="k-sheet-gesture-root" style={{ flex: 1 }}>
					<View
						testID="k-sheet-root"
						style={applySlot(applySlot({ flex: 1 }, style), slotStyles?.root)}
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
										backgroundColor: sheetOverlay(theme),
									},
									slotStyles?.overlay,
								),
							]}
						/>
						{/* box-none: taps outside the sheet fall through to the overlay */}
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
											// auto hugs content under maxHeight; fixed snaps get
											// their pixel height, shrunk while a keyboard covers
											// the lower reach so the footer stays above it; full
											// snap stops below a translucent status bar
											...(snap === "auto"
												? {
														maxHeight:
															(maxHeight ??
																Math.round(windowHeight * MAX_HEIGHT_RATIO)) -
															kbShrink,
													}
												: {
														height: Math.max(
															0,
															(baseHeight ?? windowHeight) - kbShrink,
														),
													}),
											backgroundColor: theme.card,
											borderTopLeftRadius: tokens.radius.card,
											borderTopRightRadius: tokens.radius.card,
											borderTopWidth: 1,
											borderColor: theme.border,
											paddingTop: 8,
											// nav-bar clearance with the keyboard hidden; a small gap
											// once the keyboard replaces the nav bar as the bottom surface
											paddingBottom: kbUp
												? KEYBOARD_BOTTOM_GAP
												: tokens.space.cardPad + insets.bottom,
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
											backgroundColor: theme.mutedForeground,
										},
										slotStyles?.grabber,
									)}
								/>
								{title ? (
									<View
										testID="k-sheet-header"
										style={applySlot(sheetHeader(theme), slotStyles?.header)}
									>
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
												<View
													testID="k-sheet-close-bubble"
													style={sheetCloseBubble(theme)}
												>
													<Icon icon={X} size="sm" color="mutedForeground" />
												</View>
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
								{footer ? (
									<View testID="k-sheet-footer" style={sheetFooter(theme)}>
										{footer}
									</View>
								) : null}
							</Animated.View>
						</GestureDetector>
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
