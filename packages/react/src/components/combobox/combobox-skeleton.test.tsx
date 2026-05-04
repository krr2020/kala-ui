import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComboboxSkeleton } from "./combobox-skeleton";

describe("ComboboxSkeleton", () => {
	it("renders without crashing", () => {
		render(<ComboboxSkeleton />);
		const skeleton = screen.getByTestId("combobox-skeleton");
		expect(skeleton).toBeInTheDocument();
	});

	it("renders with default test id", () => {
		render(<ComboboxSkeleton />);
		expect(screen.getByTestId("combobox-skeleton")).toBeInTheDocument();
	});

	it("accepts custom data-testid", () => {
		render(<ComboboxSkeleton data-testid="custom-combobox" />);
		expect(screen.getByTestId("custom-combobox")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<ComboboxSkeleton className="custom-class" />);
		const skeleton = screen.getByTestId("combobox-skeleton");
		expect(skeleton).toHaveClass("custom-class");
	});

	it("renders with default height for default size", () => {
		render(<ComboboxSkeleton />);
		const skeleton = screen.getByTestId("combobox-skeleton");
		expect(skeleton).toHaveClass("h-10");
	});

	it("renders with smaller height for sm size", () => {
		render(<ComboboxSkeleton size="sm" />);
		const skeleton = screen.getByTestId("combobox-skeleton");
		expect(skeleton).toHaveClass("h-9");
	});

	it("does not show selected tags by default", () => {
		const { container } = render(<ComboboxSkeleton />);
		const tags = container.querySelectorAll(".rounded-full");
		// Only the Skeleton elements inside the main container, no selected tags by default
		expect(tags).toHaveLength(0);
	});

	it("shows selected tags in multiSelect mode", () => {
		const { container } = render(<ComboboxSkeleton multiSelect />);
		const tags = container.querySelectorAll(".rounded-full");
		// Default selectedCount is 2
		expect(tags).toHaveLength(2);
	});

	it("renders correct number of selected tags with selectedCount", () => {
		const { container } = render(
			<ComboboxSkeleton multiSelect selectedCount={4} />,
		);
		const tags = container.querySelectorAll(".rounded-full");
		expect(tags).toHaveLength(4);
	});

	it("renders input placeholder and chevron", () => {
		const { container } = render(<ComboboxSkeleton />);
		// Input placeholder skeleton (h-5 flex-1)
		const inputSkeleton = container.querySelector(".h-5.flex-1");
		expect(inputSkeleton).toBeInTheDocument();
		// Chevron skeleton (h-4 w-4)
		const chevronSkeleton = container.querySelector(".h-4.w-4.flex-shrink-0");
		expect(chevronSkeleton).toBeInTheDocument();
	});

	it("applies min-w constraint to input in multiSelect mode", () => {
		const { container } = render(<ComboboxSkeleton multiSelect />);
		const inputSkeleton = container.querySelector(".min-w-\\[8rem\\]");
		expect(inputSkeleton).toBeInTheDocument();
	});
});
