/**
 * Indicator contracts: the badge API (anchorOrigin corners, overlap
 * rectangular/circular, badgeContent count capping, dot/invisible arms),
 * theme color ramp fills, the border ring, label typography, and the
 * processing pulse loop lifecycle.
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

const badge = (screen: Awaited<ReturnType<typeof render>>) =>
	screen.getByTestId("k-indicator-dot", incl);

const BOTTOM_RIGHT = { vertical: "bottom", horizontal: "right" } as const;

describe("Indicator", () => {
	it("renders wrapper and badge markers; invisible hides only the badge", async () => {
		const screen = await render(
			<Indicator dot>
				<RNText>target</RNText>
			</Indicator>,
		);
		expect(screen.getByTestId("k-indicator")).toBeTruthy();
		expect(flatStyle(screen.getByTestId("k-indicator")).position).toBe(
			"relative",
		);
		expect(badge(screen)).toBeTruthy();

		await screen.rerender(
			<Indicator dot invisible>
				<RNText>target</RNText>
			</Indicator>,
		);
		expect(screen.getByTestId("k-indicator")).toBeTruthy();
		expect(screen.queryByTestId("k-indicator-dot", incl)).toBeNull();
	});

	it("anchors the four corners with distinct edge signatures", async () => {
		const origins = [
			{ vertical: "top", horizontal: "left" },
			{ vertical: "top", horizontal: "right" },
			{ vertical: "bottom", horizontal: "left" },
			BOTTOM_RIGHT,
		] as const;
		const screen = await render(
			<Indicator dot size={10} anchorOrigin={origins[0]}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const seen = new Set<string>();
		for (const anchorOrigin of origins) {
			await screen.rerender(
				<Indicator dot size={10} anchorOrigin={anchorOrigin}>
					<RNText>t</RNText>
				</Indicator>,
			);
			const s = flatStyle(badge(screen));
			seen.add(
				JSON.stringify([s.top, s.left, s.bottom, s.right].map(String)),
			);
		}
		expect(seen.size).toBe(origins.length);
	});

	it("rectangular centers the badge on the corner; circular insets inside", async () => {
		const screen = await render(
			<Indicator dot size={10} anchorOrigin={BOTTOM_RIGHT}>
				<RNText>t</RNText>
			</Indicator>,
		);
		let s = flatStyle(badge(screen));
		expect(Number(s.bottom)).toBe(-5);
		expect(Number(s.right)).toBe(-5);

		await screen.rerender(
			<Indicator dot size={10} anchorOrigin={BOTTOM_RIGHT} overlap="circular">
				<RNText>t</RNText>
			</Indicator>,
		);
		s = flatStyle(badge(screen));
		// centered anchor + (size/2 + 2) pull-in leaves a 2px gap
		expect(Number(s.bottom)).toBe(2);
		expect(Number(s.right)).toBe(2);
	});

	it("offset [x, y] nudges after the overlap math; extremes stay numeric", async () => {
		const screen = await render(
			<Indicator dot size={10} offset={[3, -4]}>
				<RNText>t</RNText>
			</Indicator>,
		);
		let s = flatStyle(badge(screen));
		// default top-right: x moves right (right shrinks), y moves down
		expect(Number(s.top)).toBe(-9);
		expect(Number(s.right)).toBe(-8);

		await screen.rerender(
			<Indicator dot size={10} offset={[-40, 500]}>
				<RNText>t</RNText>
			</Indicator>,
		);
		s = flatStyle(badge(screen));
		expect(Number(s.top)).toBe(495);
		expect(Number.isNaN(Number(s.right))).toBe(false);
	});

	it("caps counts at max, hides zeros, passes strings through", async () => {
		const screen = await render(
			<Indicator badgeContent={120}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.getByText("99+")).toBeTruthy();

		await screen.rerender(
			<Indicator badgeContent={99}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.getByText("99")).toBeTruthy();

		await screen.rerender(
			<Indicator badgeContent={300} max={999}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.getByText("300")).toBeTruthy();

		await screen.rerender(
			<Indicator badgeContent={0}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.queryByTestId("k-indicator-dot", incl)).toBeNull();

		await screen.rerender(
			<Indicator badgeContent={0} showZero>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.getByText("0")).toBeTruthy();

		await screen.rerender(
			<Indicator badgeContent="!">
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.getByText("!")).toBeTruthy();
	});

	it("no badge without badgeContent or dot; badge arrives on rerender", async () => {
		const screen = await render(
			<Indicator>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.queryByTestId("k-indicator-dot", incl)).toBeNull();
		expect(screen.getByTestId("k-indicator")).toBeTruthy();

		await screen.rerender(
			<Indicator badgeContent={7}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(screen.getByText("7")).toBeTruthy();
	});

	it("dot ignores content; badge text is 0.7x size with size/3 padding", async () => {
		const screen = await render(
			<Indicator dot badgeContent={5} size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		let s = flatStyle(badge(screen));
		expect(screen.queryByText("5")).toBeNull();
		expect(Number(s.width)).toBe(10);
		expect(s.paddingHorizontal).toBeUndefined();

		await screen.rerender(
			<Indicator badgeContent="9+" size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		s = flatStyle(badge(screen));
		expect(Number(s.height)).toBe(10);
		expect(Number(s.minWidth)).toBe(10);
		expect(s.width).toBeUndefined();
		expect(Number(s.paddingHorizontal)).toBeCloseTo(10 / 3, 10);
		const labelStyle = require("react-native").StyleSheet.flatten(
			screen.getByText("9+").props.style,
		);
		expect(Number(labelStyle.fontSize)).toBeCloseTo(7, 10);
		expect(labelStyle.fontWeight).toBe("700");
	});

	it("defaults sizes: dot 10, badge 16", async () => {
		const screen = await render(
			<Indicator dot>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(Number(flatStyle(badge(screen)).height)).toBe(10);

		await screen.rerender(
			<Indicator badgeContent={1}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(Number(flatStyle(badge(screen)).height)).toBe(16);
	});

	it("color arms map to theme ramp fills with fg pairs on the Text node", async () => {
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
			<Indicator color="primary" badgeContent={9}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const seen = new Set<string>();
		for (const arm of arms) {
			await screen.rerender(
				<Indicator color={arm} badgeContent={9}>
					<RNText>t</RNText>
				</Indicator>,
			);
			const s = flatStyle(badge(screen));
			expect(s.backgroundColor).toBe(themes.light[arm]);
			const labelStyle = require("react-native").StyleSheet.flatten(
				screen.getByText("9").props.style,
			);
			expect(labelStyle.color).toBe(themes.light[`${arm}Foreground`]);
			seen.add(String(s.backgroundColor));
		}
		expect(seen.size).toBe(arms.length);
	});

	it("withBorder adds a 2px ring in the surface color; default has none", async () => {
		const { themes } = require("../../themes");
		const screen = await render(
			<Indicator dot size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(Number(flatStyle(badge(screen)).borderWidth)).toBe(0);

		await screen.rerender(
			<Indicator dot size={10} withBorder>
				<RNText>t</RNText>
			</Indicator>,
		);
		const ring = flatStyle(badge(screen));
		expect(Number(ring.borderWidth)).toBe(2);
		expect(ring.borderColor).toBe(themes.light.background);
	});

	it("degenerate size=0 stays deterministic", async () => {
		const screen = await render(
			<Indicator badgeContent="0" size={0}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const s = flatStyle(badge(screen));
		expect(Number(s.height)).toBe(0);
		expect(Number(s.minWidth)).toBe(0);
		expect(Number(s.borderRadius)).toBe(0);
	});

	it("static indicator starts no animation; invisible+processing neither", async () => {
		const AnimatedRN = require("react-native").Animated;
		const origLoop = AnimatedRN.loop;
		const loop = jest.fn(origLoop);
		AnimatedRN.loop = loop as typeof AnimatedRN.loop;
		try {
			const screen = await render(
				<Indicator dot processing>
					<RNText>t</RNText>
				</Indicator>,
			);
			expect(loop).toHaveBeenCalledTimes(1);
			await screen.rerender(
				<Indicator dot processing invisible>
					<RNText>t</RNText>
				</Indicator>,
			);
			expect(loop).toHaveBeenCalledTimes(1);
		} finally {
			AnimatedRN.loop = origLoop;
		}
	});

	it("legacy style lands on the badge, never the wrapper or Text", async () => {
		const screen = await render(
			<Indicator dot style={{ backgroundColor: "rgb(1, 2, 3)" }}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(flatStyle(badge(screen)).backgroundColor).toBe("rgb(1, 2, 3)");
		expect(flatStyle(screen.getByTestId("k-indicator")).backgroundColor).toBe(
			undefined,
		);
	});

	it("slotStyles.badge wins over style; slotStyles.root stays on the root", async () => {
		const screen = await render(
			<Indicator
				dot
				style={{ backgroundColor: "rgb(1, 2, 3)" }}
				slotStyles={{
					badge: { backgroundColor: "rgb(9, 9, 9)" },
					root: { borderWidth: 4 },
				}}
			>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(flatStyle(badge(screen)).backgroundColor).toBe("rgb(9, 9, 9)");
		expect(flatStyle(screen.getByTestId("k-indicator")).borderWidth).toBe(4);
	});

	it("style with inline/offset/slot arms combined clobbers nothing", async () => {
		const screen = await render(
			<Indicator
				inline
				dot
				size={10}
				offset={[4, 4]}
				style={{ backgroundColor: "rgb(1, 2, 3)" }}
				slotStyles={{ root: { borderWidth: 4 } }}
			>
				<RNText>t</RNText>
			</Indicator>,
		);
		const root = flatStyle(screen.getByTestId("k-indicator"));
		expect(root.alignSelf).toBe("flex-start");
		expect(root.borderWidth).toBe(4);
		expect(root.backgroundColor).toBeUndefined();
		const s = flatStyle(badge(screen));
		expect(s.backgroundColor).toBe("rgb(1, 2, 3)");
		// anchor math rides after the user style and stays intact
		expect(Number(s.top)).toBe(-1);
		expect(Number(s.right)).toBe(-9);
	});

	it("processing pulse still beats a user-supplied style", async () => {
		const screen = await render(
			<Indicator dot processing size={10} style={{ opacity: 0.9 }}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(flatStyle(badge(screen)).opacity).not.toBe(0.9);
	});
});

// Animation-lifecycle suite stays LAST: its Animated.loop patch drives a
// real mock loop to completion inside act, and jest-expo's Animated mock
// leaves later loop-patching mounts in this file without a live effect —
// every tree-querying test must run before it, and the flip-off/unmount
// assertions live here together.
it("processing pulse loop lifecycle: stops on flip-off and unmount", async () => {
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
			<Indicator dot processing size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(stops.length).toBe(1);
		// flipping processing off: effect cleanup stops the loop and
		// resets the pulse value, so a later processing mount starts fresh
		await screen.rerender(
			<Indicator dot size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(stops[0]).toHaveBeenCalled();
		await screen.rerender(
			<Indicator dot processing size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(stops.length).toBe(2);
		act(() => {
			screen.unmount();
		});
		expect(stops[1]).toHaveBeenCalled();
	} finally {
		AnimatedRN.loop = origLoop;
	}
});
