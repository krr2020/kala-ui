import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "../metric-card";

// Helper to render component
function renderWithIntl(component: React.ReactElement) {
	return render(component);
}

describe("MetricCard", () => {
	describe("Basic Rendering", () => {
		it("should render title and value", () => {
			renderWithIntl(<MetricCard title="Total Users" value={100} />);

			expect(screen.getByText("Total Users")).toBeInTheDocument();
			expect(screen.getByText("100")).toBeInTheDocument();
		});

		it("should render string value", () => {
			renderWithIntl(<MetricCard title="Active Sessions" value="1,234" />);

			expect(screen.getByText("Active Sessions")).toBeInTheDocument();
			expect(screen.getByText("1,234")).toBeInTheDocument();
		});

		it("should format large numbers with locale", () => {
			renderWithIntl(<MetricCard title="Total Revenue" value={1234567} />);

			// Use regex to handle different locale formats
			const formattedNumbers = screen.getAllByText(
				/1[,.]?2[,.]?3[,.]?4[,.]?5[,.]?6[,.]?7/,
			);
			expect(formattedNumbers.length).toBeGreaterThan(0);
		});

		it("should render icon when provided", () => {
			renderWithIntl(
				<MetricCard
					title="Test"
					value={50}
					icon={<span data-testid="icon">📊</span>}
				/>,
			);

			expect(screen.getByTestId("icon")).toBeInTheDocument();
		});

		it("should render subtitle when provided", () => {
			renderWithIntl(
				<MetricCard title="New Users" value={25} subtitle="Last 7 days" />,
			);

			expect(screen.getByText("Last 7 days")).toBeInTheDocument();
		});
	});

	describe("Change Indicators", () => {
		it("should show positive growth indicator", () => {
			renderWithIntl(
				<MetricCard title="Total Users" value={100} change={15.5} />,
			);

			expect(screen.getByText("15.5% than last week")).toBeInTheDocument();
			expect(screen.getByText("↑")).toBeInTheDocument();
			// Parent div has the color class, not the text itself
			const changeElement = screen
				.getByText("15.5% than last week")
				.closest("div");
			expect(changeElement).toHaveClass("text-success");
		});

		it("should show negative growth indicator", () => {
			renderWithIntl(
				<MetricCard title="Total Users" value={80} change={-12.3} />,
			);

			const changeTexts = screen.getAllByText(/12.3% than last week/);
			expect(changeTexts.length).toBeGreaterThan(0);
			expect(screen.getByText("↓")).toBeInTheDocument();
			const changeElement = changeTexts[1]?.closest("div");
			expect(changeElement).toHaveClass("text-destructive");
		});

		it("should show no change indicator for zero", () => {
			renderWithIntl(<MetricCard title="Total Users" value={100} change={0} />);

			expect(screen.getByText("No change")).toBeInTheDocument();
			expect(screen.getByText("−")).toBeInTheDocument();
			// Parent div has the color class
			const changeElement = screen.getByText("No change").closest("div");
			expect(changeElement).toHaveClass("text-muted-foreground");
		});

		it("should use custom change label when provided", () => {
			renderWithIntl(
				<MetricCard
					title="Test"
					value={50}
					change={10}
					changeLabel="compared to last month"
				/>,
			);

			expect(screen.getByText("compared to last month")).toBeInTheDocument();
			expect(screen.queryByText(/than last week/)).not.toBeInTheDocument();
		});

		it("should prefer change over subtitle when both provided", () => {
			renderWithIntl(
				<MetricCard
					title="Test"
					value={50}
					change={10}
					subtitle="Subtitle text"
				/>,
			);

			const changeTexts = screen.getAllByText(/10% than last week/);
			expect(changeTexts.length).toBeGreaterThan(0);
			expect(screen.queryByText("Subtitle text")).not.toBeInTheDocument();
		});
	});

	describe("Variants", () => {
		it("should apply default variant styles", () => {
			const { container } = renderWithIntl(
				<MetricCard title="Test" value={50} />,
			);
			const card = container.firstChild;

			expect(card).toHaveClass("bg-card");
			expect(card).toHaveClass("border");
		});

		it("should apply blue styles via className", () => {
			const { container } = renderWithIntl(
				<MetricCard
					title="Test"
					value={50}
					className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
				/>,
			);
			const card = container.firstChild;

			expect(card).toHaveClass("bg-gradient-to-br");
			expect(card).toHaveClass("from-blue-500");
			expect(card).toHaveClass("to-blue-600");
			expect(card).toHaveClass("text-white");
		});

		it("should apply green styles via className", () => {
			const { container } = renderWithIntl(
				<MetricCard
					title="Test"
					value={50}
					className="bg-gradient-to-br from-teal-500 to-teal-600 text-white"
				/>,
			);
			const card = container.firstChild;

			expect(card).toHaveClass("from-teal-500");
			expect(card).toHaveClass("to-teal-600");
			expect(card).toHaveClass("text-white");
		});

		it("should apply custom className", () => {
			const { container } = renderWithIntl(
				<MetricCard title="Test" value={50} className="custom-class" />,
			);

			const card = container.firstChild;
			expect(card).toHaveClass("custom-class");
		});
	});

	describe("Accessibility", () => {
		it("should have aria-label on value", () => {
			renderWithIntl(<MetricCard title="Total Users" value={1234} />);

			// Check for sr-only span with the full accessible text
			const srOnlySpan = screen.getByText((content, element) => {
				return Boolean(
					element?.classList.contains("sr-only") &&
						content.includes("Total Users") &&
						content.includes("1,234"),
				);
			});
			expect(srOnlySpan).toBeInTheDocument();
		});

		it("should have aria-label on change indicator", () => {
			renderWithIntl(<MetricCard title="Revenue" value="$100" change={5.5} />);

			const changeElement = screen.getByText("5.5% than last week");
			expect(changeElement).toBeInTheDocument();
			// Check sr-only label exists
			expect(
				screen.getByText(/Change: 5\.5% than last week/, {
					selector: ".sr-only",
				}),
			).toBeInTheDocument();
		});

		it("should mark icon as decorative with aria-hidden", () => {
			renderWithIntl(
				<MetricCard
					title="Test"
					value={50}
					icon={<span data-testid="icon">📊</span>}
				/>,
			);

			const iconContainer = screen.getByTestId("icon").parentElement;
			expect(iconContainer).toHaveAttribute("aria-hidden", "true");
		});

		it("should mark change icon as decorative with aria-hidden", () => {
			renderWithIntl(<MetricCard title="Test" value={50} change={10} />);

			const changeIcon = screen.getByText("↑");
			expect(changeIcon).toHaveAttribute("aria-hidden", "true");
		});
	});

	describe("React 19 Compliance", () => {
		it("should support ref forwarding", () => {
			const ref = createRef<HTMLDivElement>();
			renderWithIntl(<MetricCard ref={ref} title="Test" value={50} />);

			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});

		it("should forward additional props to the Card", () => {
			const { container } = renderWithIntl(
				<MetricCard title="Test" value={50} data-testid="custom-card" />,
			);

			expect(
				container.querySelector('[data-testid="custom-card"]'),
			).toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("should not render change or subtitle when neither provided", () => {
			const { container } = renderWithIntl(
				<MetricCard title="Test" value={50} />,
			);

			// The .text-sm div should not exist when no change or subtitle
			const changeDiv = container.querySelector(".text-sm");
			expect(changeDiv).not.toBeInTheDocument();
		});

		it("should handle zero as a value", () => {
			renderWithIntl(<MetricCard title="Pending Items" value={0} />);

			expect(screen.getByText("0")).toBeInTheDocument();
		});

		it("should handle very large numbers", () => {
			renderWithIntl(<MetricCard title="Big Number" value={999999999} />);

			// Use regex to handle different locale formats - getAllByText since value appears twice (visible + sr-only)
			const elements = screen.getAllByText(
				/9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9/,
			);
			expect(elements.length).toBeGreaterThan(0);
		});

		it("should handle negative numbers", () => {
			renderWithIntl(<MetricCard title="Deficit" value={-1234} />);

			expect(screen.getByText("-1,234")).toBeInTheDocument();
		});

		it("should handle decimal numbers in change", () => {
			renderWithIntl(<MetricCard title="Test" value={100} change={0.5} />);

			expect(screen.getByText("0.5% than last week")).toBeInTheDocument();
		});
	});
});
