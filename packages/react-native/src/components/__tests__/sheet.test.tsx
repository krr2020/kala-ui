import { fireEvent, render } from "@testing-library/react-native";
import { Dimensions, Text } from "react-native";
import * as Reanimated from "react-native-reanimated";
import { motion } from "../../tokens";
import { Sheet } from "../sheet";
import { composeOffset, OFFSCREEN_Y, SHEET_EASE } from "../sheet/sheet.styles";

// the jest.setup mock records every withTiming/withSpring call config
const timingCalls = (
	Reanimated.withTiming as unknown as {
		mockConfigs: {
			to: unknown;
			config?: { duration?: number; easing?: unknown };
		}[];
	}
).mockConfigs;
const springCalls = (
	Reanimated.withSpring as unknown as { mockConfigs: unknown[] }
).mockConfigs;

type Screen = Awaited<ReturnType<typeof render>>;

const inclHidden = { includeHiddenElements: true } as const;

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry) {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

describe("composeOffset", () => {
	it("adds the drag offset to the entry/exit offset (never max/override)", () => {
		expect(composeOffset(0, 0)).toBe(0);
		expect(composeOffset(320, 0)).toBe(320);
		expect(composeOffset(320, 40)).toBe(360);
		expect(composeOffset(0, -12)).toBe(-12);
	});
});

describe("Sheet", () => {
	it("initial frame is flash-free before layout: entry offset offscreen, overlay transparent", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		const content = flatStyle(
			screen.getByTestId("k-sheet-content", inclHidden),
		);
		expect(content.transform).toEqual([{ translateY: OFFSCREEN_Y }]);
		const overlay = flatStyle(
			screen.getByTestId("k-sheet-overlay", inclHidden),
		);
		expect(overlay.opacity).toBe(0);
	});

	it("open=false after open exits, then unmounts the modal", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		await screen.rerender(
			<Sheet open={false} onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.queryByTestId("k-sheet-modal", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-content", inclHidden)).toBeNull();
	});

	it("title renders a header with k-sheet-title and a working close icon", async () => {
		const onClose = jest.fn();
		const screen: Screen = await render(
			<Sheet open onClose={onClose} title="Options">
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden).props.children).toBe(
			"Options",
		);
		await fireEvent.press(screen.getByTestId("k-sheet-close", inclHidden));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("showClose=false keeps the title but drops the close icon", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} title="Options" showClose={false}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden)).toBeTruthy();
		expect(screen.queryByTestId("k-sheet-close", inclHidden)).toBeNull();
	});

	it("no title renders no header at all", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.queryByTestId("k-sheet-title", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-close", inclHidden)).toBeNull();
	});

	it("dismissable=false hides the close icon — a locked sheet exposes no close affordance", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} title="Options" dismissable={false}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden)).toBeTruthy();
		expect(screen.queryByTestId("k-sheet-close", inclHidden)).toBeNull();
	});

	it("closed (open=false) renders nothing — no Modal, no markers", async () => {
		const screen: Screen = await render(
			<Sheet open={false} onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.queryByTestId("k-sheet-modal", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-root", inclHidden)).toBeNull();
		expect(screen.queryByTestId("k-sheet-overlay", inclHidden)).toBeNull();
	});

	it("open renders through a transparent Modal with a flex:1 root fill", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		const modal = screen.getByTestId("k-sheet-modal", inclHidden);
		// RN forwards onRequestClose to the modal host; visible is proven
		// by the markers themselves (the modal window only mounts its
		// children while open)
		expect(typeof modal.props.onRequestClose).toBe("function");
		const root = flatStyle(screen.getByTestId("k-sheet-root", inclHidden));
		expect(root.flex).toBe(1);
		expect(root.position).toBeUndefined();
		expect("inset" in root).toBe(false);
	});

	it("Android hardware back: onRequestClose fires onClose when dismissable", async () => {
		const onClose = jest.fn();
		const screen: Screen = await render(
			<Sheet open onClose={onClose}>
				<Text>content</Text>
			</Sheet>,
		);
		const modal = screen.getByTestId("k-sheet-modal", inclHidden);
		(modal.props.onRequestClose as () => void)();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("Android hardware back with dismissable=false keeps the sheet open", async () => {
		const onClose = jest.fn();
		const screen: Screen = await render(
			<Sheet open onClose={onClose} dismissable={false}>
				<Text>content</Text>
			</Sheet>,
		);
		const modal = screen.getByTestId("k-sheet-modal", inclHidden);
		const back = modal.props.onRequestClose as () => void;
		expect(() => back()).not.toThrow();
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId("k-sheet-content", inclHidden)).toBeTruthy();
	});

	it("overlay press fires onClose only when dismissable", async () => {
		const dismissable = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		await fireEvent.press(
			dismissable.getByTestId("k-sheet-overlay", inclHidden),
		);

		const onClose = jest.fn();
		const locked = await render(
			<Sheet open onClose={onClose} dismissable={false}>
				<Text>content</Text>
			</Sheet>,
		);
		await fireEvent.press(locked.getByTestId("k-sheet-overlay", inclHidden));
		expect(onClose).not.toHaveBeenCalled();
	});

	it("entry/exit slide with an eased timing animation — springs stay off that path", async () => {
		timingCalls.length = 0;
		springCalls.length = 0;
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		await fireEvent(
			screen.getByTestId("k-sheet-content", inclHidden),
			"layout",
			{
				nativeEvent: { layout: { height: 320, width: 1080, x: 0, y: 0 } },
			},
		);
		const enter = timingCalls.find((call) => call.to === 0);
		expect(enter).toBeTruthy();
		expect(enter?.config?.duration).toBe(motion.duration.base);
		expect(enter?.config?.easing).toBe(SHEET_EASE);
		const fadeIn = timingCalls.find((call) => call.to === 1);
		expect(fadeIn?.config?.duration).toBe(motion.duration.base);

		await screen.rerender(
			<Sheet open={false} onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		const fadeOut = timingCalls.find(
			(call) => call.to === 0 && call.config?.duration === motion.duration.fast,
		);
		expect(fadeOut).toBeTruthy();
		expect(springCalls).toHaveLength(0);
	});

	it("snap=auto hugs content height under an 85% window maxHeight; explicit maxHeight wins", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} snap="auto">
				<Text>content</Text>
			</Sheet>,
		);
		const auto = flatStyle(screen.getByTestId("k-sheet-content", inclHidden));
		expect(auto.height).toBeUndefined();
		const { height } = Dimensions.get("window");
		expect(auto.maxHeight).toBe(Math.round(height * 0.85));

		const clamped: Screen = await render(
			<Sheet open onClose={() => {}} snap="auto" maxHeight={500}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(
			flatStyle(clamped.getByTestId("k-sheet-content", inclHidden)).maxHeight,
		).toBe(500);
	});

	it("snap=auto resolves naturally with a header and empty-ish content", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}} snap="auto" title="Options">
				<Text>tiny</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-title", inclHidden)).toBeTruthy();
		const style = flatStyle(screen.getByTestId("k-sheet-content", inclHidden));
		expect(style.height).toBeUndefined();
		expect(style.maxHeight).toBeGreaterThan(0);
	});

	it("snap peek/half/full map to 120 / 50% / 90% heights", async () => {
		for (const [snap, height] of [
			["peek", 120],
			["half", "50%"],
			["full", "90%"],
		] as const) {
			const screen: Screen = await render(
				<Sheet open onClose={() => {}} snap={snap}>
					<Text>content</Text>
				</Sheet>,
			);
			expect(
				flatStyle(screen.getByTestId("k-sheet-content", inclHidden)).height,
			).toBe(height);
		}
	});

	it("drag-to-dismiss stays wired: gesture root hosts the sheet content inside the Modal", async () => {
		const screen: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-gesture-root", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-sheet-content", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-sheet-grabber", inclHidden)).toBeTruthy();
	});

	it("scrollable wraps children in the k-sheet-scroll ScrollView; default renders raw", async () => {
		const scrollable: Screen = await render(
			<Sheet open onClose={() => {}} scrollable>
				<Text>content</Text>
			</Sheet>,
		);
		expect(scrollable.getByTestId("k-sheet-scroll", inclHidden)).toBeTruthy();
		expect(scrollable.getByText("content", inclHidden)).toBeTruthy();

		const plain: Screen = await render(
			<Sheet open onClose={() => {}}>
				<Text>content</Text>
			</Sheet>,
		);
		expect(plain.queryByTestId("k-sheet-scroll", inclHidden)).toBeNull();
	});

	it("slotStyles overlay/content/grabber overrides still apply inside the Modal", async () => {
		const screen: Screen = await render(
			<Sheet
				open
				onClose={() => {}}
				slotStyles={{
					overlay: { borderWidth: 3 },
					content: { borderWidth: 5 },
					grabber: { width: 21 },
				}}
			>
				<Text>content</Text>
			</Sheet>,
		);
		expect(
			flatStyle(screen.getByTestId("k-sheet-overlay", inclHidden)).borderWidth,
		).toBe(3);
		expect(
			flatStyle(screen.getByTestId("k-sheet-content", inclHidden)).borderWidth,
		).toBe(5);
		expect(
			flatStyle(screen.getByTestId("k-sheet-grabber", inclHidden)).width,
		).toBe(21);
	});
});
