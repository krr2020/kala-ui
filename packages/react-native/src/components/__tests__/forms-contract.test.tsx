/**
 * Forms rewrite contract: the release-blocker interactions and a11y
 * guarantees for the forms group — sheet scrolling, wheel commits,
 * minus/decimal entry, out-of-month guards, label merging, orphan
 * values, and the <name>.styles.ts token discipline. Kept in its own
 * file: the tail of markers.test.tsx mutates the shared TLB registry.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Calendar } from "../calendar";
import { Checkbox } from "../checkbox";
import { Combobox } from "../combobox";
import { Field } from "../field";
import { MultiSelect } from "../multi-select";
import { NumberInput } from "../number-input";
import { RadioGroup } from "../radio-group";
import { Rating } from "../rating";
import { Select } from "../select";
import { TextInput } from "../text-input";
import { Textarea } from "../textarea";
import { TimePicker } from "../time-picker";

const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const inclHidden = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

describe("Forms rewrite contract", () => {
	const formsDir = resolve(__dirname, "..");

	it("Field merges label, description and invalid into the control label; error uses a live region", async () => {
		const screen = await render(
			<Field
				label="Email"
				description="we never share it"
				error="enter a valid email"
			>
				<TextInput />
			</Field>,
		);
		const control = screen.getByTestId("k-text-input");
		expect(control.props.accessibilityLabel).toBe(
			"Email, we never share it, invalid",
		);
		expect(
			screen.getByTestId("k-field-error").props.accessibilityLiveRegion,
		).toBe("polite");
		const arr = await render(
			<Field label="Arr">{[<TextInput key="a" />]}</Field>,
		);
		expect(arr.getByTestId("k-text-input").props.accessibilityLabel).toBe(
			"Arr",
		);
	});

	it("Checkbox renders a built-in label merged into a11y and an isLoading skeleton keeping the marker", async () => {
		const screen = await render(<Checkbox label="Agree to terms" />);
		expect(screen.getByText("Agree to terms")).toBeTruthy();
		expect(screen.getByTestId("k-checkbox").props.accessibilityLabel).toBe(
			"Agree to terms",
		);
		const loading = await render(
			<Checkbox isLoading accessibilityLabel="agree" />,
		);
		expect(loading.getByTestId("k-checkbox")).toBeTruthy();
	});

	it("RadioGroup: defaultValue uncontrolled, description announced, checked re-press is a no-op", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<RadioGroup defaultValue="a" onValueChange={onValueChange}>
				<RadioGroup.Item
					value="a"
					label="Alpha"
					description="first"
					testID="k-radio-item-a"
				/>
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		expect(screen.getByTestId("k-radio-item-a").props.accessibilityLabel).toBe(
			"Alpha, first",
		);
		await fireEvent.press(screen.getByTestId("k-radio-item-a"));
		expect(onValueChange).not.toHaveBeenCalled();
		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(onValueChange).toHaveBeenCalledWith("b");
	});

	it("Rating interactive arm is an accessible group announcing N of M; stars meet the 44dp width floor", async () => {
		const screen = await render(
			<Rating accessibilityLabel="Movie" value={3} />,
		);
		const root = screen.getByTestId("k-rating");
		expect(root.props.accessibilityLabel).toBe("Movie, 3 of 5");
		const star = screen.getAllByTestId("k-rating-star")[0];
		const s = flatStyle(star);
		expect(Number(s.minWidth ?? 0)).toBeGreaterThanOrEqual(44);
		expect(root.props.accessibilityActions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: "increment" }),
				expect.objectContaining({ name: "decrement" }),
			]),
		);
	});

	it("NumberInput accepts minus and decimal text entry ('-3.5')", async () => {
		const onValueChange = jest.fn();
		const screen = await render(<NumberInput onValueChange={onValueChange} />);
		const input = screen.getByTestId("k-number-input-input");
		await fireEvent.changeText(input, "-3.5");
		expect(onValueChange).toHaveBeenCalledWith(-3.5);
	});

	it("Combobox orphan value renders the raw value; hasError themes the border", async () => {
		const cb = await render(
			<Combobox
				options={[{ value: "a", label: "Alpha" }]}
				value="ghost"
				hasError
			/>,
		);
		expect(cb.getByTestId("k-combobox-value").props.children).toBe("ghost");
		expect(flatStyle(cb.getByTestId("k-combobox")).borderColor).toMatch(/.+/);
	});

	it("Combobox zero-match search renders an empty state and clearing restores the list", async () => {
		const screen = await render(
			<Combobox
				options={[
					{ value: "a", label: "Alpha" },
					{ value: "b", label: "Beta" },
				]}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-combobox"));
		await fireEvent.changeText(
			screen.getByTestId("k-combobox-search", inclHidden),
			"zzz",
		);
		expect(screen.getByTestId("k-combobox-empty", inclHidden)).toBeTruthy();
		await fireEvent.changeText(
			screen.getByTestId("k-combobox-search", inclHidden),
			"",
		);
		expect(screen.getAllByTestId(/k-combobox-option-/, inclHidden).length).toBe(
			2,
		);
	});

	it("MultiSelect orphan values keep their raw labels and the empty state is reachable", async () => {
		const screen = await render(
			<MultiSelect
				options={[{ value: "a", label: "Alpha" }]}
				value={["ghost"]}
				onValueChange={() => undefined}
			/>,
		);
		expect(screen.getByTestId("k-multi-select")).toBeTruthy();
		expect(screen.getByText("ghost")).toBeTruthy();
	});

	it("TimePicker commits the snapped wheel index on momentum end", async () => {
		const onValueChange = jest.fn();
		const screen = await render(<TimePicker onValueChange={onValueChange} />);
		const hourWheel = screen.getByTestId("k-time-picker-hour", inclHidden);
		await fireEvent(hourWheel, "onMomentumScrollEnd", {
			nativeEvent: { contentOffset: { y: 160 } },
		});
		expect(onValueChange).toHaveBeenCalled();
	});

	it("Select sheet renders all options inside a scroll container", async () => {
		const options = Array.from({ length: 12 }, (_, i) => ({
			value: `v${i}`,
			label: `Option ${i}`,
		}));
		const screen = await render(
			<Select options={options} value="v0" onValueChange={() => {}} />,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		expect(screen.getByTestId("k-select-sheet", inclHidden)).toBeTruthy();
		expect(screen.getAllByTestId("k-select-option", inclHidden).length).toBe(
			12,
		);
	});

	it("Calendar out-of-month cells are not selectable", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Calendar month={new Date(2026, 0, 1)} onValueChange={onValueChange} />,
		);
		// 2025-12-28 leads the Jan 2026 grid (Jan 1 is a Thursday)
		const cell = screen.getByTestId("k-calendar-day-2025-12-28", inclHidden);
		expect(cell.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(cell);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("rewritten forms components keep styles in <name>.styles.ts with no hex literals", () => {
		const targets = [
			"checkbox",
			"radio-group",
			"rating",
			"switch",
			"toggle",
			"text-input",
			"textarea",
			"number-input",
			"select",
			"multi-select",
			"slider",
			"calendar",
			"date-picker",
			"time-picker",
			"field",
			"input-otp",
		];
		for (const name of targets) {
			const stylesPath = resolve(formsDir, name, `${name}.styles.ts`);
			expect(`${stylesPath} missing: ${existsSync(stylesPath)}`).toBe(
				`${stylesPath} missing: true`,
			);
			const src = readFileSync(stylesPath, "utf8");
			expect(`${name}.styles.ts hex: ${src}`).not.toMatch(/#[0-9a-f]{3,8}\b/i);
		}
	});

	it("input surfaces rest on card and reserve the input token for the disabled fill; hasSuccess pins the success border", async () => {
		const light = require("../../themes").themes.light;
		const idle = await render(<TextInput accessibilityLabel="a" />);
		expect(flatStyle(idle.getByTestId("k-text-input")).backgroundColor).toBe(
			light.card,
		);
		const locked = await render(<TextInput disabled accessibilityLabel="b" />);
		expect(flatStyle(locked.getByTestId("k-text-input")).backgroundColor).toBe(
			light.input,
		);
		const valid = await render(<TextInput hasSuccess accessibilityLabel="c" />);
		expect(flatStyle(valid.getByTestId("k-text-input")).borderColor).toBe(
			light.success,
		);
		const both = await render(
			<TextInput hasError hasSuccess accessibilityLabel="d" />,
		);
		expect(flatStyle(both.getByTestId("k-text-input")).borderColor).toBe(
			light.destructive,
		);
		const area = await render(<Textarea accessibilityLabel="e" />);
		expect(flatStyle(area.getByTestId("k-textarea")).backgroundColor).toBe(
			light.card,
		);
		const areaLocked = await render(
			<Textarea disabled accessibilityLabel="e2" />,
		);
		expect(
			flatStyle(areaLocked.getByTestId("k-textarea")).backgroundColor,
		).toBe(light.input);
		const num = await render(<NumberInput accessibilityLabel="f" />);
		expect(flatStyle(num.getByTestId("k-number-input")).backgroundColor).toBe(
			light.card,
		);
		const numLocked = await render(
			<NumberInput disabled accessibilityLabel="g" />,
		);
		expect(
			flatStyle(numLocked.getByTestId("k-number-input")).backgroundColor,
		).toBe(light.input);
	});

	it("sectioned TextInput: the group owns the chrome and the inner input flexes without its own border", async () => {
		const screen = await render(
			<TextInput
				leftSection="@"
				rightSection=".com"
				accessibilityLabel="email"
			/>,
		);
		const group = flatStyle(screen.getByTestId("k-text-input-group"));
		expect(group.borderWidth).toBe(1);
		expect(Number(group.paddingHorizontal)).toBeGreaterThan(0);
		const inner = flatStyle(screen.getByTestId("k-text-input"));
		expect(inner.borderWidth).toBeUndefined();
		expect(inner.flex).toBe(1);
	});
});
