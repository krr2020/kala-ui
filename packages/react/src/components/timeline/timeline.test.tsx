import { render, screen } from "@testing-library/react";
import { CheckCircle } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Timeline, TimelineItem } from "./timeline";

describe("Timeline", () => {
	it("should render timeline with items", () => {
		render(
			<Timeline>
				<TimelineItem title="Step 1" description="First step" />
				<TimelineItem title="Step 2" description="Second step" />
			</Timeline>,
		);

		expect(screen.getByText("Step 1")).toBeInTheDocument();
		expect(screen.getByText("Step 2")).toBeInTheDocument();
	});

	it("should render with timestamp", () => {
		render(
			<Timeline>
				<TimelineItem title="Event" timestamp="2 hours ago" />
			</Timeline>,
		);

		expect(screen.getByText("2 hours ago")).toBeInTheDocument();
	});

	it("should render with custom icon", () => {
		const { container } = render(
			<Timeline>
				<TimelineItem
					title="Done"
					icon={<CheckCircle data-testid="check-icon" />}
				/>
			</Timeline>,
		);

		expect(
			container.querySelector('[data-testid="check-icon"]'),
		).toBeInTheDocument();
	});

	it("should set data-slot on timeline root", () => {
		const { container } = render(
			<Timeline>
				<TimelineItem title="Item" />
			</Timeline>,
		);

		expect(
			container.querySelector('[data-slot="timeline"]'),
		).toBeInTheDocument();
	});

	it("should set data-slot on timeline items", () => {
		const { container } = render(
			<Timeline>
				<TimelineItem title="Item 1" />
				<TimelineItem title="Item 2" />
			</Timeline>,
		);

		expect(
			container.querySelectorAll('[data-slot="timeline-item"]').length,
		).toBe(2);
	});

	it("should not show connector line for last item", () => {
		const { container } = render(
			<Timeline>
				<TimelineItem title="First" />
				<TimelineItem title="Last" />
			</Timeline>,
		);

		const items = container.querySelectorAll('[data-slot="timeline-item"]');
		const lastItem = items[items.length - 1];
		// Last item should not have the connector div (w-px)
		expect(lastItem.querySelector(".w-px")).toBeNull();
	});

	it("should show connector line for non-last items", () => {
		const { container } = render(
			<Timeline>
				<TimelineItem title="First" />
				<TimelineItem title="Last" />
			</Timeline>,
		);

		const items = container.querySelectorAll('[data-slot="timeline-item"]');
		const firstItem = items[0];
		expect(firstItem.querySelector(".w-px")).toBeInTheDocument();
	});

	it("should apply success status styling", () => {
		const { container } = render(
			<Timeline>
				<TimelineItem title="Success" status="success" />
			</Timeline>,
		);

		const iconEl = container.querySelector(".bg-success");
		expect(iconEl).toBeInTheDocument();
	});

	it("should apply error status styling", () => {
		const { container } = render(
			<Timeline>
				<TimelineItem title="Error" status="error" />
			</Timeline>,
		);

		const iconEl = container.querySelector(".bg-destructive");
		expect(iconEl).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Timeline className="custom-timeline">
				<TimelineItem title="Item" />
			</Timeline>,
		);

		expect(container.querySelector('[data-slot="timeline"]')).toHaveClass(
			"custom-timeline",
		);
	});
});
