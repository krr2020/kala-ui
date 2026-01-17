import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline, TimelineItem } from "./timeline";

describe("Timeline", () => {
	it("renders children correctly", () => {
		render(
			<Timeline>
				<TimelineItem title="Item 1">Content 1</TimelineItem>
				<TimelineItem title="Item 2">Content 2</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Content 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
	});

	it("applies active styles based on active prop", () => {
		// We can't easily check for the internal classes/styles directly without looking at implementation details (class names)
		// But we can verify that the structure is rendered.
		// In a real test we might check for specific active classes or colors if we used data attributes.
		// Let's assume active items have 'bg-primary' which we used in implementation.

		const { container } = render(
			<Timeline active={0}>
				<TimelineItem title="Active">Active</TimelineItem>
				<TimelineItem title="Inactive">Inactive</TimelineItem>
			</Timeline>,
		);

		// First item bullet should have bg-primary
		const bullets = container.querySelectorAll(".rounded-full");
		expect(bullets[0]).toHaveClass("bg-primary");
		expect(bullets[1]).not.toHaveClass("bg-primary");
	});
});
