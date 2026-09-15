/**
 * Indicator contracts: nine corner/edge anchor positions, offset insets,
 * theme color ramp fills, the border ring, label typography at web parity
 * (fontSize 0.7×size, size/3 side padding), and the processing pulse
 * loop lifecycle.
 */
import { render } from "@testing-library/react-native";
import { Indicator } from "../indicator";

// require (not import): keeps this file off the native-module preflight,
// matching the require-based StyleSheet/Animated access in the other suites
const { Text: RNText } = require("react-native");

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const dot = (screen: Awaited<ReturnType<typeof render>>) =>
	screen.getByTestId("k-indicator-dot", incl);

const POSITION_KEYS = [
	"top",
	"right",
	"bottom",
	"left",
	"marginTop",
	"marginLeft",
] as const;

const positionSignature = (
	screen: Awaited<ReturnType<typeof render>>,
): string => {
	const s = flatStyle(dot(screen));
	return JSON.stringify(
		POSITION_KEYS.map((key) => (s[key] === undefined ? null : s[key])),
	);
};

describe("Indicator", () => {
	it("renders wrapper and dot markers; disabled hides only the dot", async () => {
		const screen = await render(
			<Indicator>
				<RNText>target</RNText>
			</Indicator>,
		);
		expect(screen.getByTestId("k-indicator")).toBeTruthy();
		expect(flatStyle(screen.getByTestId("k-indicator")).position).toBe(
			"relative",
		);
		expect(dot(screen)).toBeTruthy();

		await screen.rerender(
			<Indicator disabled>
				<RNText>target</RNText>
			</Indicator>,
		);
		expect(screen.getByTestId("k-indicator")).toBeTruthy();
		expect(screen.queryByTestId("k-indicator-dot", incl)).toBeNull();
	});

	it("anchors all nine positions with distinct edge signatures", async () => {
		const positions = [
			"top-left",
			"top-center",
			"top-right",
			"middle-left",
			"middle-center",
			"middle-right",
			"bottom-left",
			"bottom-center",
			"bottom-right",
		] as const;
		const screen = await render(
			<Indicator position="top-left">
				<RNText>t</RNText>
			</Indicator>,
		);
		const seen = new Set<string>();
		for (const position of positions) {
			await screen.rerender(
				<Indicator position={position}>
					<RNText>t</RNText>
				</Indicator>,
			);
			const signature = positionSignature(screen);
			expect(seen.has(signature)).toBe(false);
			seen.add(signature);
		}
		expect(seen.size).toBe(positions.length);
	});

	it("corners sit centered on the corner: negative half-size offsets", async () => {
		const screen = await render(
			<Indicator position="top-right" size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const s = flatStyle(dot(screen));
		expect(Number(s.top)).toBe(-5);
		expect(Number(s.right)).toBe(-5);
		expect(s.left).toBeUndefined();
		expect(s.bottom).toBeUndefined();
	});

	it("offset insets the anchored edges only", async () => {
		const screen = await render(
			<Indicator position="top-right" size={10} offset={6}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const s = flatStyle(dot(screen));
		expect(Number(s.top)).toBe(1);
		expect(Number(s.right)).toBe(1);

		// a centered axis is anchored by percentage + margin and stays put
		await screen.rerender(
			<Indicator position="top-center" size={10} offset={4}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const c = flatStyle(dot(screen));
		expect(Number(c.top)).toBe(-1);
		expect(c.left).toBe("50%");
		expect(Number(c.marginLeft)).toBe(-5);
	});

	it("color arms map to distinct theme ramp backgrounds", async () => {
		const { themes } = require("../../themes");
		const arms = [
			"primary",
			"secondary",
			"destructive",
			"success",
			"warning",
			"info",
		] as const;
		const screen = await render(
			<Indicator color="primary" label="9">
				<RNText>t</RNText>
			</Indicator>,
		);
		const seen = new Set<string>();
		for (const arm of arms) {
			await screen.rerender(
				<Indicator color={arm} label="9">
					<RNText>t</RNText>
				</Indicator>,
			);
			const s = flatStyle(dot(screen));
			expect(s.backgroundColor).toBe(themes.light[arm]);
			expect(String(s.color).startsWith("#")).toBe(true);
			seen.add(String(s.backgroundColor));
		}
		expect(seen.size).toBe(arms.length);
	});

	it("withBorder adds a 2px ring in the surface color; default has none", async () => {
		const { themes } = require("../../themes");
		const screen = await render(
			<Indicator size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const plain = flatStyle(dot(screen));
		expect(Number(plain.borderWidth)).toBe(0);

		await screen.rerender(
			<Indicator size={10} withBorder>
				<RNText>t</RNText>
			</Indicator>,
		);
		const ring = flatStyle(dot(screen));
		expect(Number(ring.borderWidth)).toBe(2);
		expect(ring.borderColor).toBe(themes.light.background);
	});

	it("label text is 0.7×size with size/3 side padding; dotless width", async () => {
		const screen = await render(
			<Indicator size={10} label="9+">
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.getByText("9+")).toBeTruthy();
		const s = flatStyle(dot(screen));
		expect(Number(s.fontSize)).toBeCloseTo(7, 10);
		expect(Number(s.paddingHorizontal)).toBeCloseTo(10 / 3, 10);
		expect(Number(s.height)).toBe(10);
		expect(Number(s.minWidth)).toBe(10);
		expect(s.width).toBeUndefined();
		expect(Number(s.borderRadius)).toBe(5);

		await screen.rerender(
			<Indicator size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const bare = flatStyle(dot(screen));
		expect(Number(bare.width)).toBe(10);
		expect(bare.fontSize).toBeUndefined();
	});

	it("processing starts a pulse loop that stops on unmount", async () => {
		const { act } = require("react");
		const AnimatedRN = require("react-native").Animated;
		const origLoop = AnimatedRN.loop;
		const stops: Array<ReturnType<typeof jest.fn>> = [];
		AnimatedRN.loop = ((...args: unknown[]) => {
			const loop = origLoop(...(args as []));
			const stop = jest.fn(((...a: unknown[]) =>
				(loop as { stop: (...s: unknown[]) => void }).stop(...a)) as never);
			stops.push(stop);
			return {
				start: () => (loop as { start: () => void }).start(),
				stop: () => stop(),
			};
		}) as typeof AnimatedRN.loop;
		try {
			const screen = await render(
				<Indicator processing size={10}>
					<RNText>t</RNText>
				</Indicator>,
			);
			expect(stops.length).toBe(1);
			act(() => {
				screen.unmount();
			});
			expect(stops[0]).toHaveBeenCalled();
		} finally {
			AnimatedRN.loop = origLoop;
		}
	});

	it("static indicator starts no animation", async () => {
		const AnimatedRN = require("react-native").Animated;
		const origLoop = AnimatedRN.loop;
		const loop = jest.fn(origLoop);
		AnimatedRN.loop = loop as typeof AnimatedRN.loop;
		try {
			await render(
				<Indicator size={10}>
					<RNText>t</RNText>
				</Indicator>,
			);
			expect(loop).not.toHaveBeenCalled();
		} finally {
			AnimatedRN.loop = origLoop;
		}
	});
});
