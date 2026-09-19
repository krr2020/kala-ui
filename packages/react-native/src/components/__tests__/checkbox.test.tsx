import { fireEvent, render } from "@testing-library/react-native";
import { Checkbox } from "../checkbox";

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

function iconStroke(node: {
	children?: unknown[];
}): unknown {
	const icon = node.children?.[0] as
		| { props: Record<string, unknown> }
		| undefined;
	// lucide renders the color prop as the svg stroke
	return icon?.props?.stroke;
}

describe("Checkbox", () => {
	it("renders markers and label text", async () => {
		const screen: Screen = await render(
			<Checkbox label="Agree to the terms" />,
		);
		expect(screen.getByTestId("k-checkbox")).toBeTruthy();
		expect(screen.getByTestId("k-checkbox-box")).toBeTruthy();
		expect(screen.getByText("Agree to the terms")).toBeTruthy();
	});

	it("initial values render distinctly: undefined/false unchecked, true checked, indeterminate mixed", async () => {
		const undef = await render(<Checkbox accessibilityLabel="a" />);
		expect(
			undef.getByTestId("k-checkbox").props.accessibilityState.checked,
		).toBe(false);
		const off = await render(<Checkbox value={false} accessibilityLabel="b" />);
		expect(off.getByTestId("k-checkbox").props.accessibilityState.checked).toBe(
			false,
		);
		expect(flatStyle(off.getByTestId("k-checkbox-box")).backgroundColor).toBe(
			"transparent",
		);
		const on = await render(<Checkbox value accessibilityLabel="c" />);
		expect(on.getByTestId("k-checkbox").props.accessibilityState.checked).toBe(
			true,
		);
		const icons = on.getByTestId("k-checkbox-box").children ?? [];
		expect((icons as { type?: unknown }[]).length).toBe(1);
		const mixed = await render(
			<Checkbox value="indeterminate" accessibilityLabel="d" />,
		);
		expect(
			mixed.getByTestId("k-checkbox").props.accessibilityState.checked,
		).toBe("mixed");
		const mixedIcons = mixed.getByTestId("k-checkbox-box").children ?? [];
		expect((mixedIcons as { type?: unknown }[]).length).toBe(1);
	});

	it("hasError: destructive border unchecked; destructive icon over primary fill when active", async () => {
		const { themes } = require("../../themes");
		const destructive = themes.light.destructive;
		const idle = await render(<Checkbox value={false} hasError />);
		expect(flatStyle(idle.getByTestId("k-checkbox-box")).borderColor).toBe(
			destructive,
		);

		const on = await render(<Checkbox value hasError />);
		const hot = flatStyle(on.getByTestId("k-checkbox-box"));
		expect(hot.backgroundColor).toBe(themes.light.primary);
		expect(iconStroke(on.getByTestId("k-checkbox-box"))).toBe(destructive);

		const mixed = await render(<Checkbox value="indeterminate" hasError />);
		expect(iconStroke(mixed.getByTestId("k-checkbox-box"))).toBe(destructive);
	});

	it("cycle mapping false→true→indeterminate→false with a11y per state", async () => {
		type TriState = false | true | "indeterminate";
		const cycle = (prev: TriState, checked: boolean): TriState =>
			prev === false
				? true
				: prev === true
					? "indeterminate"
					: checked === true
						? false
						: checked;
		expect(cycle(false, true)).toBe(true);
		expect(cycle(true, false)).toBe("indeterminate");
		expect(cycle("indeterminate", true)).toBe(false);

		const states: (boolean | "mixed")[] = [];
		let value: TriState = "indeterminate";
		for (let i = 0; i < 3; i++) {
			const screen = await render(
				<Checkbox value={value} accessibilityLabel="c" />,
			);
			states.push(
				screen.getByTestId("k-checkbox").props.accessibilityState.checked,
			);
			value = cycle(value, value !== true);
		}
		expect(states).toEqual(["mixed", false, true]);
	});

	it("tri-state a11y announces disabled alongside checked", async () => {
		const screen: Screen = await render(
			<Checkbox value disabled accessibilityLabel="locked" />,
		);
		const state = screen.getByTestId("k-checkbox").props.accessibilityState;
		expect(state.checked).toBe(true);
		expect(state.disabled).toBe(true);
	});

	it("press resolves with boolean payloads: undefined→true, true→false, indeterminate→true", async () => {
		const onValueChange = jest.fn();
		const undef = await render(
			<Checkbox onValueChange={onValueChange} accessibilityLabel="a" />,
		);
		await fireEvent.press(undef.getByTestId("k-checkbox"));
		expect(onValueChange).toHaveBeenLastCalledWith(true);

		const on = await render(
			<Checkbox value onValueChange={onValueChange} accessibilityLabel="b" />,
		);
		await fireEvent.press(on.getByTestId("k-checkbox"));
		expect(onValueChange).toHaveBeenLastCalledWith(false);

		const mixed = await render(
			<Checkbox
				value="indeterminate"
				onValueChange={onValueChange}
				accessibilityLabel="c"
			/>,
		);
		await fireEvent.press(mixed.getByTestId("k-checkbox"));
		expect(onValueChange).toHaveBeenLastCalledWith(true);
		expect(
			onValueChange.mock.calls.every((call) => typeof call[0] === "boolean"),
		).toBe(true);
	});

	it("disabled press is inert", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Checkbox value disabled onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-checkbox"));
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("isLoading renders the skeleton keeping the marker, no box", async () => {
		const screen: Screen = await render(<Checkbox isLoading />);
		expect(screen.getByTestId("k-checkbox", inclHidden)).toBeTruthy();
		expect(screen.queryByTestId("k-checkbox-box", inclHidden)).toBeNull();
	});

	it("box styles: inactive 2px border-token + transparent; active/indeterminate primary fill + border", async () => {
		const inactive = await render(<Checkbox value={false} />);
		const idle = flatStyle(inactive.getByTestId("k-checkbox-box"));
		expect(idle.backgroundColor).toBe("transparent");
		expect(idle.borderWidth).toBe(2);
		// RN sizes width/height as border-box — the stroke draws inside 22
		expect(idle.width).toBe(22);
		expect(idle.height).toBe(22);

		const active = await render(<Checkbox value />);
		const hot = flatStyle(active.getByTestId("k-checkbox-box"));
		expect(hot.backgroundColor).toBeTruthy();
		expect(hot.borderColor).toBeTruthy();

		const mixed = await render(<Checkbox value="indeterminate" />);
		const mid = flatStyle(mixed.getByTestId("k-checkbox-box"));
		expect(mid.backgroundColor).toBe(hot.backgroundColor);
		expect(mid.borderColor).toBe(hot.borderColor);
	});

	it("wrapper collapses to the box; root owns the 44dp touch floor in every arm", async () => {
		const enabled = await render(<Checkbox value={false} />);
		const wrap = flatStyle(enabled.getByTestId("k-checkbox-wrap"));
		expect(wrap.minWidth).toBeUndefined();
		expect(wrap.minHeight).toBeUndefined();
		expect(flatStyle(enabled.getByTestId("k-checkbox")).minHeight).toBe(44);

		const disabled = await render(<Checkbox value disabled />);
		expect(flatStyle(disabled.getByTestId("k-checkbox")).minHeight).toBe(44);

		const bare = await render(<Checkbox accessibilityLabel="anon" />);
		expect(flatStyle(bare.getByTestId("k-checkbox")).minHeight).toBe(44);
		expect(bare.getByTestId("k-checkbox-wrap")).toBeTruthy();
	});

	it("slot overrides reach the box and root", async () => {
		const screen: Screen = await render(
			<Checkbox
				value={false}
				style={{ minWidth: 90 }}
				slotStyles={{ box: { borderRadius: 9 } }}
			/>,
		);
		expect(flatStyle(screen.getByTestId("k-checkbox")).minWidth).toBe(90);
		expect(flatStyle(screen.getByTestId("k-checkbox-box")).borderRadius).toBe(9);
	});
});
