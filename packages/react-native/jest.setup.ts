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

jest.mock('react-native-unistyles', () =>
	require('react-native-unistyles/mocks'),
);

jest.mock('react-native-reanimated', () => {
	const React = require('react');
	const { View } = require('react-native');

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

jest.mock('react-native-gesture-handler', () => {
	const React = require('react');

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
			const { View } = require('react-native');
			return React.createElement(View, props);
		},
	};
});

import { StyleSheet } from 'react-native-unistyles';

StyleSheet.configure({
	themes,
	settings: {
		initialTheme: 'light',
	},
});
