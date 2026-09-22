import { fireEvent, render } from "@testing-library/react-native";
import { useUncontrolled } from "@kala-ui/react-hooks/portable";
import { RadioGroup } from "../radio-group";
import { Select } from "../select";

const OPTIONS = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
] as const;

// Cross-package seam: react-native form controls consume the portable
// entry of @kala-ui/react-hooks via the workspace link.
describe("react-native ↔ react-hooks portable seam", () => {
	it("resolves the portable subpath through the workspace link", () => {
		expect(typeof useUncontrolled).toBe("function");
	});

	it("RadioGroup duality: controlled value wins; commit fires onValueChange", async () => {
		const onValueChange = jest.fn();
		const items = (
			<>
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</>
		);
		const screen = await render(
			<RadioGroup value="a" onValueChange={onValueChange}>
				{items}
			</RadioGroup>,
		);
		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(onValueChange).toHaveBeenCalledWith("b");
		// controlled: the owner decides — nothing checks until value flips
		expect(
			screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBe(0);

		await screen.rerender(
			<RadioGroup value="b" onValueChange={onValueChange}>
				{items}
			</RadioGroup>,
		);
		expect(
			screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBeGreaterThan(0);
	});

	it("RadioGroup uncontrolled: defaultValue seeds, press commits internally", async () => {
		const screen = await render(
			<RadioGroup defaultValue="a">
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		expect(
			screen.getByTestId("k-radio-item-a-circle").children?.length ?? 0,
		).toBeGreaterThan(0);
		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(
			screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBeGreaterThan(0);
	});

	it("Select uncontrolled: commit closes the sheet and updates the shown value", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Select options={[...OPTIONS]} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		const rows = screen.getAllByTestId("k-select-option");
		await fireEvent.press(rows[1]);
		expect(onValueChange).toHaveBeenCalledWith("banana");
		expect(screen.queryByTestId("k-select-option")).toBeNull();
		expect(screen.getByTestId("k-select-value").props.children).toBe("Banana");
	});
});
