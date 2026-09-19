/**
 * Register the kala themes for tests. Unistyles 3.3's native path pulls
 * NitroModules (not present in jest), so tests run against the official
 * unistyles mock — it resolves themes/styles in pure JS from the themes
 * registered below. Reanimated/worklets and RNGH have no native runtime
 * under jest either, so they get behavior-preserving JS mocks (springs
 * snap instantly; pan gestures record but never drive native threads).
 * Real-device rendering is covered by the playground.
 */
import 'react-native-unistyles/mocks';
import { themes } from './src/themes';

// zero-inset default keeps component geometry deterministic in tests;
// __setSafeAreaInsets lets individual suites pin non-zero bars

jest.mock(
  'react-native-unistyles',
  () => require('react-native-unistyles/mocks'),
  // virtual: the factory is self-contained, so jest must not try to
  // resolve the real native package to canonicalize the mock key —
  // pnpm's nested layout makes that resolution flaky under jest-expo.
  { virtual: true }
);

jest.mock('react-native-reanimated', () => {
	const React = require('react');
	const { View } = require('react-native');

	const Animated = {
		createAnimatedComponent: (component: unknown) => component,
		View: (props: unknown) => React.createElement(View, props),
	};

	// real reanimated invokes the completion callback (finished=true)
	// when an animation ends; the mock mirrors that synchronously so
	// exit-then-unmount wiring stays observable under jest. Configs are
	// recorded so tests can pin timing/easing vs spring usage per path.
	const makeAnimate = () => {
		const calls: Record<string, unknown>[] = [];
		const fn = (to: unknown, a?: unknown, b?: unknown) => {
			const config = typeof a === 'function' ? undefined : a;
			const callback = typeof a === 'function' ? a : b;
			calls.push({ to, config });
			if (typeof callback === 'function') callback(true);
			return to;
		};
		return Object.assign(fn, { mockConfigs: calls });
	};
	const withTiming = makeAnimate();
	const withSpring = makeAnimate();
	// Easing must come from reanimated (worklet-compatible); the mock's
	// bezier just echoes the control points so config assertions compare
	// the same object shape the real runtime produces
	const Easing = {
		bezier: (...points: number[]) => ({ __bezier: points }),
	};
	return {
		__esModule: true,
		default: Animated,
		Animated,
		Easing,
		useSharedValue: (initial: unknown) => {
			// identity-stable across renders like the real runtime — a fresh
			// object per render would reset every animation offset and break
			// post-interaction style assertions
			const ref = (
				React as typeof import('react')
			).useRef<{ value: unknown } | undefined>(undefined);
			if (!ref.current) ref.current = { value: initial };
			return ref.current;
		},
		useAnimatedStyle: (factory: () => unknown) => factory(),
		withSpring,
		withTiming,
		runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
	};
});

// RN 0.86's Modal needs a native modal host view that does not exist
// under test-renderer — it renders nothing, swallowing the whole dialog
// subtree. Render through a plain View keyed on `visible` instead;
// onRequestClose stays on the host so hardware-back wiring stays testable.
// A Proxy keeps every other export lazy — spreading the real barrel would
// trip TurboModule getters (DevMenu) that jest never registers.
jest.mock('react-native', () => {
	const rn = jest.requireActual('react-native');
	const React = require('react');
	const Modal = ({
		visible = true,
		children,
		...rest
	}: {
		visible?: boolean;
		children?: React.ReactNode;
	} & Record<string, unknown>) =>
		visible === false
			? null
			: React.createElement(rn.View, rest, children);
	return new Proxy(rn, {
		get: (target: object, prop: string | symbol) =>
			prop === 'Modal' ? Modal : Reflect.get(target, prop),
	});
});

// zero-inset default keeps component geometry deterministic in tests;
// mockSafeAreaInsets is mutable via the exported setter so individual
// suites can pin non-zero system bars (jest hoists factories: only
// `mock`-prefixed out-of-scope names are reachable inside them)
const mockSafeAreaInsets = {
	current: { top: 0, bottom: 0, left: 0, right: 0 } as {
		top: number;
		bottom: number;
		left: number;
		right: number;
	},
};
jest.mock(
	'react-native-safe-area-context',
	() => ({
		__esModule: true,
		useSafeAreaInsets: () => mockSafeAreaInsets.current,
		__setSafeAreaInsets: (insets: typeof mockSafeAreaInsets.current) => {
			mockSafeAreaInsets.current = insets;
		},
	}),
	{ virtual: true }
);

jest.mock('react-native-gesture-handler', () => {
	const React = require('react');

	// the most recent pan gesture is exported so suites can pin activation
	// windows (direction gating) — the mock never drives a native runtime
	let lastPan: Record<string, unknown> | undefined;
	const pan = () => {
		const gesture: Record<string, unknown> = {
			onUpdate: () => gesture,
			onEnd: () => gesture,
			enabled: () => gesture,
			runOnJS: () => gesture,
			activeOffsetY: (value: unknown) => {
				gesture.activeOffsetY = value;
				return gesture;
			},
			failOffsetY: (value: unknown) => {
				gesture.failOffsetY = value;
				return gesture;
			},
		};
		lastPan = gesture;
		return gesture;
	};

	return {
		__esModule: true,
		Gesture: { Pan: pan },
		get __lastPan() {
			return lastPan;
		},
		GestureDetector: ({ children }: { children: React.ReactNode }) =>
			React.createElement(React.Fragment, null, children),
		GestureHandlerRootView: (props: unknown) => {
			const { View } = require('react-native');
			return React.createElement(View, props);
		},
		// Pressable renders as the RN one in tests — the native gesture
		// runtime does not exist under jest. RN's Pressable resolves
		// style/children callback forms, so the mock must too or style
		// assertions walk unresolved functions
		Pressable: (props: Record<string, unknown>) => {
			const { Pressable } = require('react-native');
			const resolve = (value: unknown): unknown =>
				typeof value === 'function' && value.prototype === undefined
					? value({ pressed: false })
					: value;
			const next: Record<string, unknown> = {
					...props,
				style: resolve(props.style),
			};
			if (typeof props.children === 'function') {
				next.children = resolve(props.children);
			}
			return React.createElement(Pressable, next);
		},
	};
});

// The virtual unistyles mock is registered by this side-effect import
// (keyed by the unresolved specifier); resolve StyleSheet through the
// explicit mock registry — the real CJS barrel needs NitroModules and has
// no configure. A same-specifier STATIC import would hoist before the
// registration above and bypass the mock.
import 'react-native-unistyles/mocks';

const { StyleSheet } = require('react-native-unistyles');

StyleSheet.configure({
	themes,
	settings: {
		initialTheme: 'light',
	},
});
