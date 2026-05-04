import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListSkeleton } from "./list-skeleton";

describe("ListSkeleton", () => {
	it("renders with default variant (simple)", () => {
		render(<ListSkeleton />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders with custom data-testid", () => {
		render(<ListSkeleton data-testid="custom-list-skeleton" />);
		expect(screen.getByTestId("custom-list-skeleton")).toBeInTheDocument();
	});

	it("renders with default itemCount (3)", () => {
		const { container } = render(<ListSkeleton />);
		const items = container.querySelectorAll("li");
		expect(items).toHaveLength(3);
	});

	it("renders with custom itemCount", () => {
		const { container } = render(<ListSkeleton itemCount={5} />);
		const items = container.querySelectorAll("li");
		expect(items).toHaveLength(5);
	});

	it("renders with showDividers by default", () => {
		const { container } = render(<ListSkeleton />);
		const list = container.firstChild;
		expect(list).toHaveClass("border");
	});

	it("renders without dividers when showDividers is false", () => {
		const { container } = render(<ListSkeleton showDividers={false} />);
		const list = container.firstChild;
		expect(list?.className).not.toContain("[&>li:not(:last-child)]:border-b");
	});

	it("renders with dense=false (default padding)", () => {
		const { container } = render(<ListSkeleton />);
		const item = container.querySelector("li");
		expect(item).toHaveClass("px-4", "py-3");
	});

	it("renders with dense=true (compact padding)", () => {
		const { container } = render(<ListSkeleton dense={true} />);
		const item = container.querySelector("li");
		expect(item).toHaveClass("px-3", "py-2");
	});

	it("renders simple variant", () => {
		render(<ListSkeleton variant="simple" />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders withAvatar variant", () => {
		render(<ListSkeleton variant="withAvatar" />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders withIcon variant", () => {
		render(<ListSkeleton variant="withIcon" />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders withBadge variant", () => {
		render(<ListSkeleton variant="withBadge" />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders multiLine variant", () => {
		render(<ListSkeleton variant="multiLine" />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders withAvatar variant with dense mode", () => {
		render(<ListSkeleton variant="withAvatar" dense={true} />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders withIcon variant with dense mode", () => {
		render(<ListSkeleton variant="withIcon" dense={true} />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders withBadge variant with dense mode", () => {
		render(<ListSkeleton variant="withBadge" dense={true} />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("renders multiLine variant with dense mode", () => {
		render(<ListSkeleton variant="multiLine" dense={true} />);
		expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(<ListSkeleton className="extra-class" />);
		expect(container.firstChild).toHaveClass("extra-class");
	});

	it("has compound component ListSkeleton.Skeleton", () => {
		expect(ListSkeleton.Skeleton).toBe(ListSkeleton);
	});
});
