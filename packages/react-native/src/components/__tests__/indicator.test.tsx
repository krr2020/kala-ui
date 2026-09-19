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

	it("color arms map to distinct theme ramp backgrounds; fg pairs on the Text node", async () => {
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
			// the View carries no text styling — the label Text owns the fg pair
			expect(s.fontSize).toBeUndefined();
			expect(s.color).toBeUndefined();
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
		expect(Number(s.paddingHorizontal)).toBeCloseTo(10 / 3, 10);
		expect(Number(s.height)).toBe(10);
		expect(Number(s.minWidth)).toBe(10);
		expect(s.width).toBeUndefined();
		expect(Number(s.borderRadius)).toBe(5);
		// typography lives on the label Text, not the View
		const labelStyle = require("react-native").StyleSheet.flatten(
			screen.getByText("9+").props.style,
		);
		expect(Number(labelStyle.fontSize)).toBeCloseTo(7, 10);
		expect(labelStyle.fontWeight).toBe("700");
		// labels track the OS font-size setting (RN default scaling) —
		// the component never pins allowFontScaling
		expect(screen.getByText("9+").props.allowFontScaling).toBeUndefined();
		expect(labelStyle.allowFontScaling).toBeUndefined();

		await screen.rerender(
			<Indicator size={10}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const bare = flatStyle(dot(screen));
		expect(Number(bare.width)).toBe(10);
		expect(bare.fontSize).toBeUndefined();
	});

	it("boundary offsets and size=0 stay numeric and deterministic", async () => {
		const screen = await render(
			<Indicator position="top-right" size={10} offset={-8}>
				<RNText>t</RNText>
			</Indicator>,
		);
		// anchor math is offset - size/2: negative pulls fully past the
		// corner, oversized pushes well inside — no clamping, no NaN
		let s = flatStyle(dot(screen));
		expect(Number(s.top)).toBe(-13);
		expect(Number(s.right)).toBe(-13);

		await screen.rerender(
			<Indicator position="top-right" size={10} offset={40}>
				<RNText>t</RNText>
			</Indicator>,
		);
		s = flatStyle(dot(screen));
		expect(Number(s.top)).toBe(35);
		expect(Number(s.right)).toBe(35);

		await screen.rerender(
			<Indicator size={0} label="0">
				<RNText>t</RNText>
			</Indicator>,
		);
		s = flatStyle(dot(screen));
		expect(Number(s.height)).toBe(0);
		expect(Number(s.minWidth)).toBe(0);
		expect(Number(s.borderRadius)).toBe(0);
		expect(Number(s.paddingHorizontal)).toBe(0);
		const labelStyle = require("react-native").StyleSheet.flatten(
			screen.getByText("0").props.style,
		);
		expect(Number(labelStyle.fontSize)).toBe(0);
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

	it("legacy style lands on the dot at web parity, never the wrapper", async () => {
		const screen = await render(
			<Indicator style={{ backgroundColor: "rgb(1, 2, 3)" }}>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(flatStyle(dot(screen)).backgroundColor).toBe("rgb(1, 2, 3)");
		expect(flatStyle(screen.getByTestId("k-indicator")).backgroundColor).toBe(
			undefined,
		);
	});

	it("style with inline/offset/slot arms combined clobbers nothing", async () => {
		const screen = await render(
			<Indicator
				inline
			offset={4}
				size={10}
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
		expect(root.position).toBe("relative");
		const s = flatStyle(dot(screen));
		expect(s.backgroundColor).toBe("rgb(1, 2, 3)");
		// anchor math rides after the user style and stays intact
		expect(Number(s.top)).toBe(-1);
		expect(Number(s.right)).toBe(-1);
	});

	it("slotStyles.dot wins over legacy style; slotStyles.root stays on the root", async () => {
		const screen = await render(
			<Indicator
				style={{ backgroundColor: "rgb(1, 2, 3)" }}
				slotStyles={{
					dot: { backgroundColor: "rgb(9, 9, 9)" },
					root: { borderWidth: 4 },
				}}
			>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(flatStyle(dot(screen)).backgroundColor).toBe("rgb(9, 9, 9)");
		expect(flatStyle(screen.getByTestId("k-indicator")).borderWidth).toBe(4);
	});

	it("processing pulse still beats a user-supplied style", async () => {
		const screen = await render(
			<Indicator processing size={10} style={{ opacity: 0.9 }}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const s = flatStyle(dot(screen));
		// the animated opacity entry rides after the user style (web CSS
		// animation parity: animation beats inline style)
		expect(s.opacity).not.toBe(0.9);
	});

	it("inline shrink-wraps the wrapper; default stretches", async () => {
		const inline = await render(
			<Indicator inline>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(flatStyle(inline.getByTestId("k-indicator")).alignSelf).toBe(
			"flex-start",
		);
		const block = await render(
			<Indicator>
				<RNText>t</RNText>
			</Indicator>,
		);
		expect(
			flatStyle(block.getByTestId("k-indicator")).alignSelf,
		).toBeUndefined();
	});

	it("degenerate style/slotStyles objects stay inert", async () => {
		const screen = await render(
			<Indicator style={{}} slotStyles={{}}>
				<RNText>t</RNText>
			</Indicator>,
		);
		const s = flatStyle(dot(screen));
		expect(Number(s.top)).toBe(-5);
		expect(Number(s.right)).toBe(-5);
		expect(s.backgroundColor).toBe(
			require("../../themes").themes.light.primary,
		);
	});

	it("disabled with style+processing keeps arms stable", async () => {
		const AnimatedRN = require("react-native").Animated;
		const origLoop = AnimatedRN.loop;
		const loop = jest.fn(origLoop);
		AnimatedRN.loop = loop as typeof AnimatedRN.loop;
		try {
			const screen = await render(
				<Indicator disabled processing style={{ opacity: 0.9 }}>
					<RNText>t</RNText>
				</Indicator>,
			);
			expect(screen.queryByTestId("k-indicator-dot", incl)).toBeNull();
			expect(loop).not.toHaveBeenCalled();
			const root = flatStyle(screen.getByTestId("k-indicator"));
			expect(root.opacity).toBeUndefined();
			expect(root.backgroundColor).toBeUndefined();
		} finally {
			AnimatedRN.loop = origLoop;
		}
	});
});

// Animation-lifecycle suite stays LAST: its Animated.loop patch drives a
// real mock loop to completion inside act, and jest-expo's Animated mock
// leaves later mounts in this file rendering empty trees — every
// tree-querying test must run before it.
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
