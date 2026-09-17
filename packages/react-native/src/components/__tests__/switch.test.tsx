import { fireEvent, render } from "@testing-library/react-native";
import { Switch } from "../switch";
import { themes } from "../../themes";

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

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

describe("Switch", () => {
	it("renders markers; label text only when the label prop is set", async () => {
		const bare: Screen = await render(<Switch accessibilityLabel="s" />);
		expect(bare.getByTestId("k-switch")).toBeTruthy();
		expect(bare.getByTestId("k-switch-track")).toBeTruthy();
		expect(bare.queryByText("Sync")).toBeNull();

		const labeled: Screen = await render(<Switch label="Sync" />);
		expect(labeled.getByText("Sync")).toBeTruthy();
	});

	it("explicit accessibilityLabel wins over the label fallback", async () => {
		const screen: Screen = await render(
			<Switch label="Sync" accessibilityLabel="custom sync" />,
		);
		expect(screen.getByTestId("k-switch").props.accessibilityLabel).toBe(
			"custom sync",
		);
		const fallback: Screen = await render(<Switch label="Sync only" />);
		expect(fallback.getByTestId("k-switch").props.accessibilityLabel).toBe(
			"Sync only",
		);
	});

	it("role stays switch and accessibilityState follows value", async () => {
		const off: Screen = await render(<Switch accessibilityLabel="s" />);
		const root = off.getByTestId("k-switch");
		expect(root.props.accessibilityRole).toBe("switch");
		expect(root.props.accessibilityState.checked).toBe(false);
		const on: Screen = await render(<Switch value accessibilityLabel="s" />);
		expect(on.getByTestId("k-switch").props.accessibilityState.checked).toBe(
			true,
		);
	});

	it("pressing the label toggles the row-wide press target", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Switch label="Sync" onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByText("Sync"));
		expect(onValueChange).toHaveBeenCalledWith(true);
		await fireEvent.press(screen.getByTestId("k-switch-track"));
		expect(onValueChange).toHaveBeenCalledTimes(2);
	});

	it("disabled press is a no-op", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Switch label="Sync" disabled onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByText("Sync"));
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("thumb is a constant white knob with a shadow; off track gains a border stroke, on track stays solid", async () => {
		// harness renders the light palette; the token mapping is the contract
		const off = await render(<Switch accessibilityLabel="s" />);
		const offThumb = flatStyle(off.getByTestId("k-switch-thumb"));
		const offTrack = flatStyle(off.getByTestId("k-switch-track"));
		expect(offThumb.backgroundColor).toBe("#ffffff");
		expect(offThumb.borderRadius).toBe(10);
		expect(offThumb.elevation).toBe(2);
		expect(offThumb.shadowOpacity).toBe(0.15);
		expect(offTrack.backgroundColor).toBe(themes.light.input);
		const stroke = flatStyle(off.getByTestId("k-switch-stroke"));
		expect(stroke.borderWidth).toBe(1);
		expect(stroke.borderColor).toBe(themes.light.border);
		expect(offTrack.width).toBe(40);
		expect(offTrack.height).toBe(24);
		const on = await render(<Switch value accessibilityLabel="s" />);
		const onThumb = flatStyle(on.getByTestId("k-switch-thumb"));
		const onTrack = flatStyle(on.getByTestId("k-switch-track"));
		expect(onThumb.backgroundColor).toBe("#ffffff");
		expect(onThumb.elevation).toBe(2);
		expect(onTrack.backgroundColor).toBe(themes.light.primary);
		expect(on.queryByTestId("k-switch-stroke")).toBeNull();
		expect(onTrack.width).toBe(40);
		expect(onTrack.height).toBe(24);
		// knob visibility invariant: the white knob rides the track fill —
		// the pill colors must never be white in any theme
		for (const [name, theme] of Object.entries(themes)) {
			expect(theme.input).not.toBe("#ffffff");
			expect(theme.primary).not.toBe("#ffffff");
		}
	});

	it("disabled keeps the same white knob under the row's opacity; thumb travel unchanged", async () => {
		const screen: Screen = await render(
			<Switch label="Sync" disabled value />,
		);
		const root = flatStyle(screen.getByTestId("k-switch"));
		expect(root.opacity).toBe(0.5);
		const thumb = flatStyle(screen.getByTestId("k-switch-thumb"));
		expect(thumb.backgroundColor).toBe("#ffffff");
		// locked knob drops its shadow — no smudge pulling it below center
		expect(thumb.elevation).toBe(0);
		expect(thumb.shadowOpacity).toBe(0);
		expect(thumb.width).toBe(20);
		expect(thumb.height).toBe(20);
		expect(thumb.transform).toEqual([{ translateX: 16 }]);
	});

	it("long label wraps while the track keeps its size inside the 44dp row", async () => {
		const screen: Screen = await render(
			<Switch
				label="Enable automatic seat reconciliation across every workspace"
			/>,
		);
		const row = flatStyle(screen.getByTestId("k-switch"));
		const track = flatStyle(screen.getByTestId("k-switch-track"));
		expect(row.flexDirection).toBe("row");
		expect(row.minHeight).toBe(44);
		expect(track.width).toBe(40);
		expect(track.height).toBe(24);
		const label = flatStyle(screen.getByText(/reconciliation/));
		expect(label.flex).toBe(1);
	});

	it("thumb rides an absolute anchor identical in both states — no border-shifted centering", async () => {
		const off = await render(<Switch accessibilityLabel="s" />);
		const offTrack = flatStyle(off.getByTestId("k-switch-track"));
		expect(offTrack.flexDirection).toBeUndefined();
		const offThumb = flatStyle(off.getByTestId("k-switch-thumb"));
		expect(offThumb.position).toBe("absolute");
		expect(offThumb.top).toBe(2);
		expect(offThumb.left).toBe(2);
		expect(offThumb.transform).toEqual([{ translateX: 0 }]);
		const on = await render(<Switch value accessibilityLabel="s" />);
		const onThumb = flatStyle(on.getByTestId("k-switch-thumb"));
		expect(onThumb.top).toBe(2);
		expect(onThumb.left).toBe(2);
		expect(onThumb.transform).toEqual([{ translateX: 16 }]);
	});
});
