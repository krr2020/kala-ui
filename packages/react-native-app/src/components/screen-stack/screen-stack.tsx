/**
 * ScreenStack: the animated screen-pattern engine from the app spec —
 * screens enter from any edge (right/left/top/bottom) or scale in from
 * the center dialog-style, always on a settled eased timing (never a
 * spring), and popping reverses the same motion to reveal the screen
 * beneath. Covered screens stay mounted, so state and scroll survive
 * the round trip. Controlled entirely by `entries`.
 */
import { useEffect, useRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
	AccessibilityInfo,
	BackHandler,
	Platform,
	Pressable,
	useWindowDimensions,
	View,
} from "react-native";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import {
	CENTER_SCALE_START,
	ENTER_CONFIG,
	EXIT_CONFIG,
	scrimColor,
} from "./screen-stack.styles";
import type {
	ScreenStackEntry,
	ScreenStackPresentation,
	ScreenStackProps,
} from "./screen-stack.types";
import {
	assertUniqueKeys,
	diffStack,
	enterOffsetFor,
} from "./screen-stack.utils";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const absoluteFill = {
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
} as const;

type LayerPhase = "settled" | "entering" | "exiting";

type LayerSpec = {
	entry: ScreenStackEntry;
	phase: LayerPhase;
};

function entryPresentation(entry: ScreenStackEntry): ScreenStackPresentation {
	return entry.presentation ?? "push";
}

function hasScrim(presentation: ScreenStackPresentation): boolean {
	return presentation === "modal" || presentation === "center";
}

function ScreenLayer({
	spec,
	active,
	isTop,
	windowWidth,
	windowHeight,
	reduceMotion,
	onExited,
	onScrimPress,
	scrimInk,
	scrimStyle,
}: {
	spec: LayerSpec;
	active: boolean;
	isTop: boolean;
	windowWidth: number;
	windowHeight: number;
	reduceMotion: boolean;
	onExited: (key: string) => void;
	onScrimPress: (() => void) | null;
	scrimInk: string;
	scrimStyle?: StyleProp<ViewStyle>;
}): React.JSX.Element {
	const { entry, phase } = spec;
	const presentation = entryPresentation(entry);
	const progress = useSharedValue(phase === "entering" ? 0 : 1);

	const horizontal = presentation === "push" || presentation === "left";
	const enter = enterOffsetFor(
		presentation,
		horizontal ? windowWidth : windowHeight,
	);

	// the parent rebuilds onExited every render; a dep on it would restart
	// in-flight transitions, so route it through a latest-callback ref
	const onExitedRef = useRef(onExited);
	onExitedRef.current = onExited;

	useEffect(() => {
		if (phase === "entering") {
			if (reduceMotion || presentation === "none") {
				progress.value = 1;
			} else {
				progress.value = withTiming(1, ENTER_CONFIG);
			}
			return;
		}
		if (phase === "exiting") {
			// worklet callbacks may only capture primitives: `entry` carries React
			// children, which reanimated cannot copy across the bridge
			const exitKey = entry.key;
			const exitCallback = onExitedRef.current;
			if (reduceMotion || presentation === "none") {
				progress.value = 0;
				exitCallback(exitKey);
			} else {
				progress.value = withTiming(0, EXIT_CONFIG, (finished) => {
					if (finished) runOnJS(exitCallback)(exitKey);
				});
			}
		}
		// rotation resizes the window mid-flight; the enter distance is read
		// inside the animated style, so a restart is unnecessary and jarring
	}, [phase, presentation, reduceMotion, progress, entry.key]);

	const layerStyle = useAnimatedStyle(() => {
		if (enter === null) return {};
		if (enter.axis === "scale") {
			return {
				opacity: progress.value,
				transform: [
					{
						scale:
							CENTER_SCALE_START + (1 - CENTER_SCALE_START) * progress.value,
					},
				],
			};
		}
		const offset = (1 - progress.value) * enter.start;
		return {
			transform: [
				enter.axis === "y" ? { translateY: offset } : { translateX: offset },
			],
		};
	});

	const scrimStyleAnim = useAnimatedStyle(() => ({ opacity: progress.value }));

	return (
		<View
			testID={`k-screen-${entry.key}`}
			style={{ ...absoluteFill, zIndex: active ? 2 : 1 }}
			// only the top screen may take touches; covered screens stay
			// mounted for state retention but never steal input
			pointerEvents={isTop ? "auto" : "none"}
			accessibilityElementsHidden={!isTop}
			importantForAccessibility={isTop ? "auto" : "no-hide-descendants"}
		>
			{hasScrim(presentation) && active ? (
				<AnimatedPressable
					testID="k-screen-stack-scrim"
					accessibilityRole="button"
					accessibilityLabel="Dismiss"
					onPress={onScrimPress ?? undefined}
					disabled={!onScrimPress}
					style={[
						{ ...absoluteFill, backgroundColor: scrimInk },
						scrimStyle,
						scrimStyleAnim,
					]}
				/>
			) : null}
			<Animated.View
				testID={`k-screen-content-${entry.key}`}
				style={[absoluteFill, layerStyle]}
			>
				{entry.children}
			</Animated.View>
		</View>
	);
}

export function ScreenStack({
	entries,
	onRequestPop,
	dismissOnScrimPress = false,
	style,
	styles,
	testID = "k-screen-stack-root",
}: ScreenStackProps): React.JSX.Element | null {
	const { theme } = useUnistyles();
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const [reduceMotion, setReduceMotion] = useState(false);
	const [enteringKey, setEnteringKey] = useState<string | null>(null);
	const [exiting, setExiting] = useState<LayerSpec | null>(null);
	const prevEntries = useRef(entries);

	assertUniqueKeys(entries);

	useEffect(() => {
		const query = AccessibilityInfo.isReduceMotionEnabled?.();
		if (query && typeof query.then === "function") {
			query.then(setReduceMotion).catch(() => setReduceMotion(false));
		}
		const sub = AccessibilityInfo.addEventListener?.(
			"reduceMotionChanged",
			setReduceMotion,
		);
		return () => sub?.remove?.();
	}, []);

	// Render-phase state sync (React-sanctioned derived state): classify the
	// prop change and record the transition before this render commits, so
	// the very first paint after a pop already carries the exit layer.
	const transition = diffStack(prevEntries.current, entries);
	if (transition.type !== "none") {
		prevEntries.current = entries;
		switch (transition.type) {
			case "push":
				setExiting(null);
				setEnteringKey(transition.key);
				break;
			case "replace":
				setExiting({ entry: transition.from, phase: "exiting" });
				setEnteringKey(transition.to.key);
				break;
			case "pop":
				setExiting({ entry: transition.entry, phase: "exiting" });
				setEnteringKey(null);
				break;
			default:
				setExiting(null);
				setEnteringKey(null);
		}
	}

	// Android hardware back pops while a screen covers the root; at the
	// root the subscription is absent so the OS handles the press.
	useEffect(() => {
		if (Platform.OS !== "android" || entries.length < 2) return;
		const sub = BackHandler.addEventListener("hardwareBackPress", () => {
			onRequestPop();
			return true;
		});
		return () => sub.remove();
	}, [entries.length, onRequestPop]);

	const onExited = (key: string): void => {
		setExiting((current) => (current?.entry.key === key ? null : current));
	};

	if (entries.length === 0 && !exiting) return null;

	const layers: LayerSpec[] = entries.map((entry) => ({
		entry,
		phase: enteringKey === entry.key ? "entering" : "settled",
	}));
	// the outgoing screen renders ABOVE the revealed one until it finishes
	if (exiting) {
		layers.push(exiting);
	}
	const topKey = entries.length > 0 ? entries[entries.length - 1].key : null;

	return (
		<View testID={testID} style={[{ flex: 1 }, style, styles?.root]}>
			{layers.map((spec) => (
				<ScreenLayer
					key={spec.entry.key}
					spec={spec}
					active={spec.phase !== "exiting"}
					isTop={spec.phase === "exiting" || spec.entry.key === topKey}
					windowWidth={windowWidth}
					windowHeight={windowHeight}
					reduceMotion={reduceMotion}
					onExited={onExited}
					onScrimPress={
						spec.entry.key === topKey && dismissOnScrimPress
							? onRequestPop
							: null
					}
					scrimInk={scrimColor(theme)}
					scrimStyle={styles?.scrim}
				/>
			))}
		</View>
	);
}
