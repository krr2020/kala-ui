/**
 * Register the kala themes for tests. Unistyles 3.3's native path pulls
 * NitroModules (not present in jest), so tests run against the official
 * unistyles mock — it resolves themes/styles in pure JS from the themes
 * registered below. Reanimated/worklets and RNGH have no native runtime
 * under jest either, so they get behavior-preserving JS mocks (springs
 * snap instantly; pan gestures record but never drive native threads).
 * Real-device rendering is covered by the playground.
 */
import "react-native-unistyles/mocks";
import { themes } from "../react-native/src/themes";

jest.mock(
	"react-native-unistyles",
	() => require("react-native-unistyles/mocks"),
	// virtual: the factory is self-contained, so jest must not try to
	// resolve the real native package to canonicalize the mock key —
	// pnpm's nested layout makes that resolution flaky under jest-expo.
	{ virtual: true },
);

jest.mock("react-native-reanimated", () => {
	const React = require("react");
	const { View } = require("react-native");

	const Animated = {
		createAnimatedComponent: (component: unknown) => component,
		View: (props: unknown) => React.createElement(View, props),
	};

	return {
		__esModule: true,
		default: Animated,
		Animated,
		useSharedValue: (initial: unknown) => ({ value: initial }),
		useAnimatedStyle: (factory: () => unknown) => factory(),
		withSpring: (to: number) => to,
		withTiming: (to: number) => to,
		runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
	};
});

// RN 0.86's Modal needs a native modal host view that does not exist
// under test-renderer — it renders nothing, swallowing the whole dialog
// subtree. Render through a plain View keyed on `visible` instead;
// onRequestClose stays on the host so hardware-back wiring stays testable.
// A Proxy keeps every other export lazy — spreading the real barrel would
// trip TurboModule getters (DevMenu) that jest never registers.
jest.mock("react-native", () => {
	const rn = jest.requireActual("react-native");
	const React = require("react");
	const Modal = ({
		visible = true,
		children,
		...rest
	}: {
		visible?: boolean;
		children?: React.ReactNode;
	} & Record<string, unknown>) =>
		visible === false ? null : React.createElement(rn.View, rest, children);
	return new Proxy(rn, {
		get: (target: object, prop: string | symbol) =>
			prop === "Modal" ? Modal : Reflect.get(target, prop),
	});
});

jest.mock("react-native-gesture-handler", () => {
	const React = require("react");

	const pan = () => {
		const gesture = {
			onUpdate: () => gesture,
			onEnd: () => gesture,
			enabled: () => gesture,
			runOnJS: () => gesture,
		};
		return gesture;
	};

	return {
		__esModule: true,
		Gesture: { Pan: pan },
		GestureDetector: ({ children }: { children: React.ReactNode }) =>
			React.createElement(React.Fragment, null, children),
		GestureHandlerRootView: (props: unknown) => {
			const { View } = require("react-native");
			return React.createElement(View, props);
		},
	};
});

// The virtual unistyles mock is registered by this side-effect import
// (keyed by the unresolved specifier); resolve StyleSheet through the
// explicit mock registry — the real CJS barrel needs NitroModules and has
// no configure. A same-specifier STATIC import would hoist before the
// registration above and bypass the mock.
import "react-native-unistyles/mocks";

const { StyleSheet } = require("react-native-unistyles");

StyleSheet.configure({
	themes,
	settings: {
		initialTheme: "light",
	},
});
