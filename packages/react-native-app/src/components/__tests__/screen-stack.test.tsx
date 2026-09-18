import { fireEvent, render } from "@testing-library/react-native";
import {
	AccessibilityInfo,
	BackHandler,
	Platform,
	Pressable,
	Text,
} from "react-native";
import * as Reanimated from "react-native-reanimated";
import { motion } from "@kala-ui/react-native/tokens";
import { useState } from "react";
import { ScreenStack } from "../screen-stack";

// the shared jest.setup mock records every withTiming/withSpring call config
type RecordedConfig = {
	to: unknown;
	config?: { duration?: number };
};
const timingCalls = (
	Reanimated.withTiming as unknown as { mockConfigs: RecordedConfig[] }
).mockConfigs;
const springCalls = (
	Reanimated.withSpring as unknown as { mockConfigs: RecordedConfig[] }
).mockConfigs;

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

// counter probe: covered screens must keep component state while mounted
// beneath, so popping back reveals the same instance
function CounterProbe({ label }: { label: string }) {
	const [count, setCount] = useState(0);
	return (
		<Pressable
			testID={`probe-${label}`}
			accessibilityRole="button"
			onPress={() => setCount((n) => n + 1)}
		>
			<Text>{`${label}-${count}`}</Text>
		</Pressable>
	);
}

function entryOf(
	key: string,
	text: string,
	presentation?: "push" | "left" | "modal" | "top" | "center" | "none",
) {
	return {
		key,
		presentation,
		children: (
			<>
				<Text>{`${text}-body`}</Text>
				<CounterProbe label={key} />
			</>
		),
	};
}

function layerOf(
	screen: Screen,
	key: string,
): { props: Record<string, unknown> } {
	return screen.getByTestId(`k-screen-${key}`, inclHidden) as unknown as {
		props: Record<string, unknown>;
	};
}

// flattened style of the animated content wrapper: under the synchronous
// reanimated mock it still holds the pre-animation offscreen start, so the
// transform axis AND sign are readable per direction
function contentStyleOf(screen: Screen, key: string): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry && typeof entry === "object") {
			Object.assign(out, entry);
		}
	};
	const node = screen.getByTestId(
		`k-screen-content-${key}`,
		inclHidden,
	) as unknown as {
		props: { style?: unknown };
	};
	walk(node.props.style ?? []);
	return out;
}

function transformOf(screen: Screen, key: string): Record<string, number> {
	const style = contentStyleOf(screen, key);
	const transform = style.transform as Record<string, number>[];
	return transform[0];
}

describe("ScreenStack", () => {
	const originalOS = Platform.OS;

	beforeEach(() => {
		timingCalls.length = 0;
		springCalls.length = 0;
		jest.spyOn(BackHandler, "addEventListener").mockImplementation((() => ({
			remove: jest.fn(),
		})) as unknown as typeof BackHandler.addEventListener);
		jest
			.spyOn(AccessibilityInfo, "isReduceMotionEnabled")
			.mockResolvedValue(false);
		jest
			.spyOn(AccessibilityInfo, "addEventListener")
			.mockImplementation((() => ({
				remove: jest.fn(),
			})) as unknown as typeof AccessibilityInfo.addEventListener);
	});

	afterEach(() => {
		Platform.OS = originalOS;
	});

	it("renders the single root entry with stack + screen markers", async () => {
		const screen = await render(
			<ScreenStack
				entries={[entryOf("root", "root")]}
				onRequestPop={jest.fn()}
			/>,
		);
		expect(screen.getByTestId("k-screen-stack-root")).toBeTruthy();
		expect(screen.getByText("root-body")).toBeTruthy();
		expect(screen.getAllByTestId("k-screen-root", inclHidden)).toHaveLength(1);
	});

	it("push animates the new screen in over a still-mounted, non-interactive one", async () => {
		const screen = await render(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		springCalls.length = 0;
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("b", "b")]}
				onRequestPop={jest.fn()}
			/>,
		);
		expect(screen.getByText("b-body")).toBeTruthy();
		expect(springCalls).toHaveLength(0);
		expect(timingCalls).toContainEqual({
			to: 1,
			config: {
				duration: motion.duration.slow,
				easing: Reanimated.Easing.bezier(...motion.ease.standard),
			},
		});
		// entered from the RIGHT edge: positive translateX offscreen start
		expect(transformOf(screen, "b").translateX).toBeGreaterThan(0);
		// covered screen stays mounted but cannot take touches
		expect(screen.getByText("a-body", inclHidden)).toBeTruthy();
		expect(layerOf(screen, "a").props.pointerEvents).toBe("none");
		expect(layerOf(screen, "b").props.pointerEvents).toBe("auto");
	});

	it("pop animates the top out, unmounts it, and reveals intact state beneath", async () => {
		const screen = await render(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("b", "b")]}
				onRequestPop={jest.fn()}
			/>,
		);
		await fireEvent.press(screen.getByTestId("probe-a", inclHidden));
		expect(screen.getByText("a-0", inclHidden)).toBeTruthy();

		timingCalls.length = 0;
		await screen.rerender(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		// exit ran a timing within the slow budget, then the layer unmounted
		expect(timingCalls.length).toBeGreaterThan(0);
		for (const call of timingCalls) {
			expect(call.config?.duration).toBeLessThanOrEqual(motion.duration.slow);
		}
		expect(screen.queryByText("b-body", inclHidden)).toBeNull();
		// the revealed screen is the SAME instance: its counter survived cover+reveal
		expect(screen.getByText("a-0")).toBeTruthy();
		expect(layerOf(screen, "a").props.pointerEvents).toBe("auto");
	});

	it("modal presents from the bottom over a scrim that pops when enabled", async () => {
		const onRequestPop = jest.fn();
		const screen = await render(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={onRequestPop} />,
		);
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("m", "m", "modal")]}
				onRequestPop={onRequestPop}
				dismissOnScrimPress
			/>,
		);
		expect(screen.getByTestId("k-screen-stack-scrim", inclHidden)).toBeTruthy();
		expect(timingCalls.some((c) => c.to === 1)).toBe(true);
		expect(springCalls).toHaveLength(0);
		// rose from the BOTTOM edge: positive translateY offscreen start
		expect(transformOf(screen, "m").translateY).toBeGreaterThan(0);

		await fireEvent.press(screen.getByTestId("k-screen-stack-scrim"));
		expect(onRequestPop).toHaveBeenCalledTimes(1);
	});

	it("left slides in from the left edge with no scrim", async () => {
		const screen = await render(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		timingCalls.length = 0;
		springCalls.length = 0;
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("l", "l", "left")]}
				onRequestPop={jest.fn()}
			/>,
		);
		expect(screen.queryByTestId("k-screen-stack-scrim", inclHidden)).toBeNull();
		// entered from the LEFT edge: negative translateX offscreen start
		expect(transformOf(screen, "l").translateX).toBeLessThan(0);
		expect(timingCalls.some((c) => c.to === 1)).toBe(true);
		expect(springCalls).toHaveLength(0);
	});

	it("top drops in from the top edge with no scrim", async () => {
		const screen = await render(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		timingCalls.length = 0;
		springCalls.length = 0;
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("t", "t", "top")]}
				onRequestPop={jest.fn()}
			/>,
		);
		expect(screen.queryByTestId("k-screen-stack-scrim", inclHidden)).toBeNull();
		// dropped from the TOP edge: negative translateY offscreen start
		expect(transformOf(screen, "t").translateY).toBeLessThan(0);
		expect(timingCalls.some((c) => c.to === 1)).toBe(true);
		expect(springCalls).toHaveLength(0);
	});

	it("center scales and fades in over a scrim, dialog-style", async () => {
		const screen = await render(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		timingCalls.length = 0;
		springCalls.length = 0;
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("c", "c", "center")]}
				onRequestPop={jest.fn()}
			/>,
		);
		expect(screen.getByTestId("k-screen-stack-scrim", inclHidden)).toBeTruthy();
		const style = contentStyleOf(screen, "c");
		expect(style.opacity).toBe(0);
		expect(style.transform).toEqual([{ scale: 0.97 }]);
		expect(timingCalls.some((c) => c.to === 1)).toBe(true);
		expect(springCalls).toHaveLength(0);

		// pop scales + fades back out and unmounts the layer
		await screen.rerender(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		expect(timingCalls.some((c) => c.to === 0)).toBe(true);
		expect(screen.queryByText("c-body", inclHidden)).toBeNull();
		expect(screen.getByText("a-body")).toBeTruthy();
	});

	it("modal scrim does not pop when dismissOnScrimPress is off", async () => {
		const onRequestPop = jest.fn();
		const screen = await render(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("m", "m", "modal")]}
				onRequestPop={onRequestPop}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-screen-stack-scrim"));
		expect(onRequestPop).not.toHaveBeenCalled();
	});

	it("presentation none swaps instantly with no animation and keeps state on return", async () => {
		const screen = await render(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		await fireEvent.press(screen.getByTestId("probe-a"));
		expect(screen.getByText("a-1")).toBeTruthy();

		timingCalls.length = 0;
		springCalls.length = 0;
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("t", "t", "none")]}
				onRequestPop={jest.fn()}
			/>,
		);
		expect(screen.getByText("t-body")).toBeTruthy();
		expect(timingCalls).toHaveLength(0);
		expect(springCalls).toHaveLength(0);

		await screen.rerender(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		expect(screen.queryByText("t-body", inclHidden)).toBeNull();
		expect(screen.getByText("a-1")).toBeTruthy();
		expect(timingCalls).toHaveLength(0);
	});

	it("duplicate keys throw an invariant error", async () => {
		await expect(
			render(
				<ScreenStack
					entries={[entryOf("a", "a"), entryOf("a", "a")]}
					onRequestPop={jest.fn()}
				/>,
			),
		).rejects.toThrow(/duplicate.*"a"/i);
	});

	it("a root or prefix change resets instantly: no exit layer, no animation", async () => {
		const screen = await render(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("b", "b")]}
				onRequestPop={jest.fn()}
			/>,
		);
		timingCalls.length = 0;
		springCalls.length = 0;
		await screen.rerender(
			<ScreenStack entries={[entryOf("c", "c")]} onRequestPop={jest.fn()} />,
		);
		expect(screen.getByText("c-body")).toBeTruthy();
		expect(screen.queryByText("b-body", inclHidden)).toBeNull();
		expect(screen.queryByText("a-body", inclHidden)).toBeNull();
		expect(timingCalls).toHaveLength(0);
		expect(springCalls).toHaveLength(0);
	});

	it("hardware back pops while stacked and falls through to the OS at the root", async () => {
		Platform.OS = "android";
		const addEventListener =
			BackHandler.addEventListener as unknown as jest.Mock;
		const onRequestPop = jest.fn();
		const screen = await render(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={onRequestPop} />,
		);
		expect(addEventListener).not.toHaveBeenCalled();

		await screen.rerender(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("b", "b")]}
				onRequestPop={onRequestPop}
			/>,
		);
		expect(addEventListener).toHaveBeenCalledTimes(1);
		const handler = addEventListener.mock.calls[0][1] as () => boolean;
		expect(handler()).toBe(true);
		expect(onRequestPop).toHaveBeenCalledTimes(1);

		// popping back to the root releases the subscription
		const sub = addEventListener.mock.results[0]?.value as {
			remove: jest.Mock;
		};
		addEventListener.mockClear();
		await screen.rerender(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={onRequestPop} />,
		);
		expect(sub.remove).toHaveBeenCalled();
		expect(addEventListener).not.toHaveBeenCalled();
	});

	it("reduced motion swaps screens with no animation at all", async () => {
		(
			AccessibilityInfo.isReduceMotionEnabled as unknown as jest.Mock
		).mockResolvedValue(true);
		const screen = await render(
			<ScreenStack
				entries={[entryOf("a", "a"), entryOf("b", "b")]}
				onRequestPop={jest.fn()}
			/>,
		);
		expect(screen.getByText("b-body")).toBeTruthy();
		expect(springCalls).toHaveLength(0);

		await screen.rerender(
			<ScreenStack entries={[entryOf("a", "a")]} onRequestPop={jest.fn()} />,
		);
		expect(screen.queryByText("b-body", inclHidden)).toBeNull();
		expect(screen.getByText("a-body")).toBeTruthy();
		expect(timingCalls).toHaveLength(0);
	});

	it("three-level navigation: each level pushes, each back pops with exit", async () => {
		const onRequestPop = jest.fn();
		const screen = await render(
			<ScreenStack
				entries={[entryOf("landing", "landing")]}
				onRequestPop={onRequestPop}
			/>,
		);
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("landing", "landing"), entryOf("list", "list")]}
				onRequestPop={onRequestPop}
			/>,
		);
		expect(screen.getByText("list-body")).toBeTruthy();
		await screen.rerender(
			<ScreenStack
				entries={[
					entryOf("landing", "landing"),
					entryOf("list", "list"),
					entryOf("group", "group"),
				]}
				onRequestPop={onRequestPop}
			/>,
		);
		expect(screen.getByText("group-body")).toBeTruthy();

		// group -> list
		timingCalls.length = 0;
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("landing", "landing"), entryOf("list", "list")]}
				onRequestPop={onRequestPop}
			/>,
		);
		expect(timingCalls.length).toBeGreaterThan(0);
		expect(screen.queryByText("group-body", inclHidden)).toBeNull();
		expect(screen.getByText("list-body")).toBeTruthy();

		// list -> landing
		timingCalls.length = 0;
		await screen.rerender(
			<ScreenStack
				entries={[entryOf("landing", "landing")]}
				onRequestPop={onRequestPop}
			/>,
		);
		expect(timingCalls.length).toBeGreaterThan(0);
		expect(screen.queryByText("list-body", inclHidden)).toBeNull();
		expect(screen.getByText("landing-body")).toBeTruthy();
	});
});
