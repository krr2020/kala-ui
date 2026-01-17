import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control";

describe("SegmentedControl", () => {
	it("renders correctly with string data", () => {
		render(<SegmentedControl data={["React", "Vue"]} defaultValue="React" />);
		expect(screen.getByText("React")).toBeInTheDocument();
		expect(screen.getByText("Vue")).toBeInTheDocument();
	});

	it("renders correctly with object data", () => {
		render(
			<SegmentedControl
				data={[
					{ label: "Label 1", value: "val1" },
					{ label: "Label 2", value: "val2" },
				]}
				defaultValue="val1"
			/>,
		);
		expect(screen.getByText("Label 1")).toBeInTheDocument();
		expect(screen.getByText("Label 2")).toBeInTheDocument();
	});

	it("handles selection change", () => {
		const handleChange = vi.fn();
		render(
			<SegmentedControl
				data={["Option 1", "Option 2"]}
				onChange={handleChange}
				defaultValue="Option 1"
			/>,
		);

		fireEvent.click(screen.getByText("Option 2"));
		expect(handleChange).toHaveBeenCalledWith("Option 2");
	});

	it("does not trigger change when disabled", () => {
		const handleChange = vi.fn();
		render(
			<SegmentedControl
				data={["Option 1", "Option 2"]}
				onChange={handleChange}
				disabled
			/>,
		);

		fireEvent.click(screen.getByText("Option 2"));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("does not trigger change when option is disabled", () => {
		const handleChange = vi.fn();
		render(
			<SegmentedControl
				data={[
					{ label: "Option 1", value: "1" },
					{ label: "Option 2", value: "2", disabled: true },
				]}
				onChange={handleChange}
				defaultValue="1"
			/>,
		);

		fireEvent.click(screen.getByText("Option 2"));
		expect(handleChange).not.toHaveBeenCalled();
	});
});
