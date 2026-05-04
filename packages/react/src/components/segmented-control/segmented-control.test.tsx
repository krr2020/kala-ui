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

	it("applies fullWidth class", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" fullWidth />,
		);
		expect(container.firstChild).toHaveClass("w-full");
	});

	it("applies w-fit class by default", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" />,
		);
		expect(container.firstChild).toHaveClass("w-fit");
	});

	it("renders with sm size", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" size="sm" />,
		);
		expect(container.firstChild).toBeInTheDocument();
	});

	it("renders with xs size", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" size="xs" />,
		);
		expect(container.firstChild).toBeInTheDocument();
	});

	it("renders with md size", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" size="md" />,
		);
		expect(container.firstChild).toBeInTheDocument();
	});

	it("renders with lg size", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" size="lg" />,
		);
		expect(container.firstChild).toBeInTheDocument();
	});

	it("renders with xl size", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" size="xl" />,
		);
		expect(container.firstChild).toBeInTheDocument();
	});

	it("applies radius classes", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" radius="full" />,
		);
		expect(container.firstChild).toHaveClass("rounded-full");
	});

	it("applies disabled opacity and cursor", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" disabled />,
		);
		expect(container.firstChild).toHaveClass("cursor-not-allowed", "opacity-60");
	});

	it("applies custom className", () => {
		const { container } = render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" className="custom-sc" />,
		);
		expect(container.firstChild).toHaveClass("custom-sc");
	});

	it("uses controlled value", () => {
		const { rerender } = render(
			<SegmentedControl data={["A", "B"]} value="A" />,
		);
		expect(screen.getByText("A").closest("button")).toHaveClass("text-foreground");

		rerender(<SegmentedControl data={["A", "B"]} value="B" />);
		expect(screen.getByText("B").closest("button")).toHaveClass("text-foreground");
	});

	it("supports name prop", () => {
		render(<SegmentedControl data={["A", "B"]} defaultValue="A" name="my-sc" />);
		expect(screen.getByText("A")).toBeInTheDocument();
	});

	it("applies disabled style to individual disabled option", () => {
		render(
			<SegmentedControl
				data={[
					{ label: "Enabled", value: "e" },
					{ label: "Disabled", value: "d", disabled: true },
				]}
				defaultValue="e"
			/>,
		);
		const disabledBtn = screen.getByText("Disabled").closest("button");
		expect(disabledBtn).toBeDisabled();
	});

	it("initializes with first string data value when no defaultValue", () => {
		render(<SegmentedControl data={["First", "Second"]} />);
		expect(screen.getByText("First").closest("button")).toHaveClass("text-foreground");
	});

	it("initializes with first object data value when no defaultValue", () => {
		render(
			<SegmentedControl
				data={[
					{ label: "First", value: "f" },
					{ label: "Second", value: "s" },
				]}
			/>,
		);
		expect(screen.getByText("First").closest("button")).toHaveClass("text-foreground");
	});

	it("applies flex-1 to buttons when fullWidth is true", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" fullWidth />,
		);
		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).toHaveClass("flex-1");
		expect(buttons[1]).toHaveClass("flex-1");
	});

	it("applies min-w-[70px] to buttons when fullWidth is false", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" fullWidth={false} />,
		);
		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).toHaveClass("min-w-[70px]");
	});

	it("applies active text-foreground class to selected item", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" />,
		);
		expect(screen.getByText("A").closest("button")).toHaveClass("text-foreground");
	});

	it("applies inactive text-muted-foreground class to unselected item", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" />,
		);
		expect(screen.getByText("B").closest("button")).toHaveClass("text-muted-foreground");
	});

	it("does not update internal value when valueProp is provided and option clicked", () => {
		const handleChange = vi.fn();
		render(
			<SegmentedControl
				data={["A", "B"]}
				value="A"
				onChange={handleChange}
			/>,
		);

		fireEvent.click(screen.getByText("B"));
		expect(handleChange).toHaveBeenCalledWith("B");
		// Internal state should not change since valueProp is controlled
		expect(screen.getByText("A").closest("button")).toHaveClass("text-foreground");
	});

	it("applies each radius variant correctly", () => {
		const radii: Array<["xs" | "sm" | "md" | "lg" | "xl" | "full", string]> = [
			["xs", "rounded-sm"],
			["sm", "rounded"],
			["md", "rounded-md"],
			["lg", "rounded-lg"],
			["xl", "rounded-xl"],
			["full", "rounded-full"],
		];

		for (const [radius, cls] of radii) {
			const { container, unmount } = render(
				<SegmentedControl data={["A", "B"]} defaultValue="A" radius={radius} />,
			);
			expect(container.firstChild).toHaveClass(cls);
			unmount();
		}
	});

	it("applies individual radius to each button", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" radius="full" />,
		);
		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).toHaveClass("rounded-full");
		expect(buttons[1]).toHaveClass("rounded-full");
	});

	it("applies size class to individual buttons", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" size="lg" />,
		);
		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).toHaveClass("h-12", "text-base");
	});

	it("applies opacity-50 and cursor-not-allowed to disabled item", () => {
		render(
			<SegmentedControl
				data={[
					{ label: "Enabled", value: "e" },
					{ label: "Disabled", value: "d", disabled: true },
				]}
				defaultValue="e"
			/>,
		);
		const disabledBtn = screen.getByText("Disabled").closest("button");
		expect(disabledBtn).toHaveClass("opacity-50", "cursor-not-allowed");
	});

	it("updates controlled value via value prop", () => {
		const { rerender } = render(
			<SegmentedControl data={["A", "B", "C"]} value="A" />,
		);
		expect(screen.getByText("A").closest("button")).toHaveClass("text-foreground");

		rerender(<SegmentedControl data={["A", "B", "C"]} value="C" />);
		expect(screen.getByText("C").closest("button")).toHaveClass("text-foreground");
		expect(screen.getByText("A").closest("button")).toHaveClass("text-muted-foreground");
	});

	it("uses name prop in motion layoutId", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" name="my-name" />,
		);
		// Active item should have the motion div
		const activeBtn = screen.getByText("A").closest("button");
		const motionDiv = activeBtn?.querySelector(".bg-background");
		expect(motionDiv).toBeInTheDocument();
	});

	it("uses 'segmented-control' in layoutId when no name is provided", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" />,
		);
		const activeBtn = screen.getByText("A").closest("button");
		const motionDiv = activeBtn?.querySelector(".bg-background");
		expect(motionDiv).toBeInTheDocument();
	});

	it("does not render motion div for unselected item", () => {
		render(
			<SegmentedControl data={["A", "B"]} defaultValue="A" />,
		);
		const inactiveBtn = screen.getByText("B").closest("button");
		const motionDiv = inactiveBtn?.querySelector(".bg-background");
		expect(motionDiv).not.toBeInTheDocument();
	});
});
