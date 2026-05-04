import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MultiSelectSkeleton } from "./multi-select-skeleton";

describe("MultiSelectSkeleton", () => {
	it("renders without crashing", () => {
		render(<MultiSelectSkeleton />);
		const skeleton = screen.getByTestId("multi-select-skeleton");
		expect(skeleton).toBeInTheDocument();
	});

	it("renders with default test id", () => {
		render(<MultiSelectSkeleton />);
		expect(screen.getByTestId("multi-select-skeleton")).toBeInTheDocument();
	});

	it("accepts custom data-testid", () => {
		render(<MultiSelectSkeleton data-testid="custom-ms-skeleton" />);
		expect(screen.getByTestId("custom-ms-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<MultiSelectSkeleton className="custom-class" />);
		const skeleton = screen.getByTestId("multi-select-skeleton");
		expect(skeleton).toHaveClass("custom-class");
	});

	it("renders default 3 tags", () => {
		const { container } = render(<MultiSelectSkeleton />);
		const tags = container.querySelectorAll(".rounded-full");
		expect(tags).toHaveLength(3);
	});

	it("renders correct number of tags with tagCount prop", () => {
		const { container } = render(<MultiSelectSkeleton tagCount={5} />);
		const tags = container.querySelectorAll(".rounded-full");
		expect(tags).toHaveLength(5);
	});

	it("renders zero tags when tagCount is 0", () => {
		const { container } = render(<MultiSelectSkeleton tagCount={0} />);
		const tags = container.querySelectorAll(".rounded-full");
		expect(tags).toHaveLength(0);
	});

	it("renders with default min height for default size", () => {
		render(<MultiSelectSkeleton />);
		const skeleton = screen.getByTestId("multi-select-skeleton");
		expect(skeleton).toHaveClass("min-h-10");
	});

	it("renders with smaller min height for sm size", () => {
		render(<MultiSelectSkeleton size="sm" />);
		const skeleton = screen.getByTestId("multi-select-skeleton");
		expect(skeleton).toHaveClass("min-h-9");
	});

	it("renders input placeholder", () => {
		const { container } = render(<MultiSelectSkeleton />);
		const inputSkeleton = container.querySelector(".h-5.w-32.flex-1");
		expect(inputSkeleton).toBeInTheDocument();
	});

	it("renders with border and padding", () => {
		render(<MultiSelectSkeleton />);
		const skeleton = screen.getByTestId("multi-select-skeleton");
		expect(skeleton).toHaveClass("border", "rounded-md", "p-2");
	});
});
