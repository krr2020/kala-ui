import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	NativeSelect,
	NativeSelectOptGroup,
	NativeSelectOption,
} from "./native-select";

describe("NativeSelect", () => {
	it("renders correctly", () => {
		render(
			<NativeSelect>
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
				<NativeSelectOption value="2">Option 2</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toBeInTheDocument();
	});

	it("shows default value", () => {
		render(
			<NativeSelect defaultValue="2">
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
				<NativeSelectOption value="2">Option 2</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox") as HTMLSelectElement;
		expect(select.value).toBe("2");
	});

	it("handles value changes", async () => {
		const { rerender } = render(
			<NativeSelect value="1" onChange={() => {}}>
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
				<NativeSelectOption value="2">Option 2</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox") as HTMLSelectElement;
		expect(select.value).toBe("1");

		rerender(
			<NativeSelect value="2" onChange={() => {}}>
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
				<NativeSelectOption value="2">Option 2</NativeSelectOption>
			</NativeSelect>,
		);

		expect(select.value).toBe("2");
	});

	it("renders disabled state", () => {
		render(
			<NativeSelect disabled>
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toBeDisabled();
	});

	it("applies small size classes", () => {
		render(
			<NativeSelect size="sm">
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toHaveClass("h-8");
	});

	it("applies default size classes", () => {
		render(
			<NativeSelect size="default">
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toHaveClass("h-9");
	});

	it("applies error state classes", () => {
		render(
			<NativeSelect error>
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toHaveClass("border-destructive");
	});

	it("renders option groups", () => {
		render(
			<NativeSelect>
				<NativeSelectOptGroup label="Group 1">
					<NativeSelectOption value="1">Option 1</NativeSelectOption>
				</NativeSelectOptGroup>
				<NativeSelectOptGroup label="Group 2">
					<NativeSelectOption value="2">Option 2</NativeSelectOption>
				</NativeSelectOptGroup>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toBeInTheDocument();

		const groups = screen.getAllByRole("group");
		expect(groups).toHaveLength(2);
	});

	it("renders all options", () => {
		render(
			<NativeSelect>
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
				<NativeSelectOption value="2">Option 2</NativeSelectOption>
				<NativeSelectOption value="3">Option 3</NativeSelectOption>
			</NativeSelect>,
		);

		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(3);
	});

	it("applies custom className", () => {
		render(
			<NativeSelect className="custom-class">
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
			</NativeSelect>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toHaveClass("custom-class");
	});

	it("forwards ref correctly", () => {
		const ref = { current: null };
		render(
			<NativeSelect ref={ref}>
				<NativeSelectOption value="1">Option 1</NativeSelectOption>
			</NativeSelect>,
		);

		expect(ref.current).toBeInstanceOf(HTMLSelectElement);
	});

	it("renders disabled option", () => {
		render(
			<NativeSelect>
				<NativeSelectOption value="1" disabled>
					Option 1
				</NativeSelectOption>
				<NativeSelectOption value="2">Option 2</NativeSelectOption>
			</NativeSelect>,
		);

		const option = screen.getByRole("option", { name: "Option 1" });
		expect(option).toBeDisabled();
	});

	it("renders disabled option group", () => {
		render(
			<NativeSelect>
				<NativeSelectOptGroup label="Group 1" disabled>
					<NativeSelectOption value="1">Option 1</NativeSelectOption>
				</NativeSelectOptGroup>
			</NativeSelect>,
		);

		const group = screen.getByRole("group");
		expect(group).toBeDisabled();
	});
});
