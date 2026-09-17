/**
 * Cross-package seam: every Forms & Inputs demo in the native-playground
 * consumes component props. This census pins the edge-case arms the demos
 * must carry — long text, boundary values, orphan values, overflow — so
 * the living docs keep exercising the same contracts the tests pin.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react-native";
import { NumberInput } from "../number-input";
import { Toggle } from "../toggle";

const DEMOS = join(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components",
);

const read = (name: string): string =>
	readFileSync(join(DEMOS, name), "utf8");

describe("Forms demos edge-case census", () => {
	it("text-input and textarea pin long-text arms", () => {
		const textInput = read("text-input-demo.tsx");
		expect(textInput).toContain("Long Text");
		expect(textInput).toContain("aaaa@");
		const textarea = read("textarea-demo.tsx");
		expect(textarea).toContain("Long Text");
		expect(textarea).toContain("long values wrap instead of clipping");
	});

	it("number-input pins boundary arms at min and max", () => {
		const source = read("number-input-demo.tsx");
		expect(source).toContain("Boundaries");
		expect(source).toContain("defaultValue={0}");
		expect(source).toContain("defaultValue={6}");
	});

	it("select matches the other pickers with orphan + long-label arms", () => {
		const source = read("select-demo.tsx");
		expect(source).toContain("Orphan Value");
		expect(source).toContain("Long Labels");
		expect(source).toContain('value="a-really-long-unlisted-option-value"');
	});

	it("multi-select and combobox pin long-label arms", () => {
		expect(read("multi-select-demo.tsx")).toContain("Long Labels");
		expect(read("combobox-demo.tsx")).toContain("Long Labels");
	});

	it("switch pins a long field copy arm", () => {
		const source = read("switch-demo.tsx");
		expect(source).toContain("Long Field Copy");
		expect(source).toContain("reconciliations run twice a day");
	});

	it("toggle pins a long-text arm", () => {
		const source = read("toggle-demo.tsx");
		expect(source).toContain("Long Text");
		expect(source).toContain("Uninterrupted power supply status");
	});

	it("slider and rating pin boundary arms", () => {
		const slider = read("slider-demo.tsx");
		expect(slider).toContain("Boundaries");
		expect(slider).toContain("defaultValue={[0]}");
		expect(slider).toContain("defaultValue={[100]}");
		expect(slider).toContain("defaultValue={[40, 40]}");
		const rating = read("rating-demo.tsx");
		expect(rating).toContain("Boundaries");
		expect(rating).toContain("value={0}");
		expect(rating).toContain("value={5}");
	});

	it("input-otp pins full-code and overflow arms", () => {
		const source = read("input-otp-demo.tsx");
		expect(source).toContain("Full Code");
		expect(source).toContain("Overflow");
		expect(source).toContain('defaultValue="999999999"');
	});

	it("field and label pin long-copy wrap arms", () => {
		const field = read("field-demo.tsx");
		expect(field).toContain("Long Copy");
		expect(field).toContain("internationalization");
		const label = read("label-demo.tsx");
		expect(label).toContain("Long Copy");
		expect(label).toContain("reconciliation");
	});

	it("toggle renders a long label as shrinkable wrapping text", async () => {
		const screen = await render(
			<Toggle accessibilityLabel="long toggle" defaultPressed>
				Uninterrupted power supply status
			</Toggle>,
		);
		const label = screen.getByText("Uninterrupted power supply status");
		const style = require("react-native").StyleSheet.flatten(label.props.style);
		expect(style.flexShrink).toBe(1);
	});

	it("number-input stepping stops at both clamps", async () => {
		// from min: decrement is inert, value stays clamped at 0
		const atMin = await render(
			<NumberInput defaultValue={0} min={0} max={6} />,
		);
		await fireEvent.press(
			atMin.getByTestId("k-number-input-decrement"),
		);
		await fireEvent.press(
			atMin.getByTestId("k-number-input-decrement"),
		);
		const minInput = atMin.getByTestId("k-number-input-input");
		expect(String(minInput.props.value)).toBe("0");

		// from 5: two increments stop at max 6
		const mid = await render(
			<NumberInput defaultValue={5} min={0} max={6} />,
		);
		await fireEvent.press(mid.getByTestId("k-number-input-increment"));
		await fireEvent.press(mid.getByTestId("k-number-input-increment"));
		const maxInput = mid.getByTestId("k-number-input-input");
		expect(String(maxInput.props.value)).toBe("6");
	});

	it("calendar, date-picker and time-picker pin value/boundary arms", () => {
		const calendar = read("calendar-demo.tsx");
		expect(calendar).toContain("Preselected");
		expect(calendar).toContain("new Date(2026, 0, 15)");
		const datePicker = read("date-picker-demo.tsx");
		expect(datePicker).toContain("Prefilled");
		expect(datePicker).toContain("new Date(2026, 0, 15)");
		const timePicker = read("time-picker-demo.tsx");
		expect(timePicker).toContain("Boundaries");
		expect(timePicker).toContain("hours: 0");
		expect(timePicker).toContain("hours: 23");
	});
});
