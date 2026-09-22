import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "./metric-card";

describe("MetricCard", () => {
	it("should render metric card with title and value", () => {
		render(<MetricCard title="Total Users" value={1250} />);

		expect(screen.getByText("Total Users")).toBeInTheDocument();
		expect(screen.getByText((1250).toLocaleString())).toBeInTheDocument();
	});

	it("should format numeric values with locale string", () => {
		const value = 1234567;
		render(<MetricCard title="Revenue" value={value} />);

		expect(screen.getByText(value.toLocaleString())).toBeInTheDocument();
	});

	it("should render string values without formatting", () => {
		render(<MetricCard title="Status" value="Active" />);

		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	it("should render icon when provided", () => {
		render(
			<MetricCard
				title="Sales"
				value={100}
				icon={<span data-testid="metric-icon">$</span>}
			/>,
		);

		expect(screen.getByTestId("metric-icon")).toBeInTheDocument();
	});

	it("should render positive change indicator", () => {
		render(<MetricCard title="Growth" value={100} change={15} />);

		expect(screen.getAllByText(/15% than last week/i)).toHaveLength(2); // One visible, one sr-only
		expect(screen.getByText("↑")).toBeInTheDocument();
	});

	it("should render negative change indicator", () => {
		render(<MetricCard title="Users" value={100} change={-10} />);

		expect(screen.getAllByText(/10% than last week/i)).toHaveLength(2); // One visible, one sr-only
		expect(screen.getByText("↓")).toBeInTheDocument();
	});

	it("should render zero change indicator", () => {
		render(<MetricCard title="Stable" value={100} change={0} />);

		expect(screen.getByText("No change")).toBeInTheDocument();
		expect(screen.getByText("−")).toBeInTheDocument();
		expect(screen.getByText("−").closest("div")).toHaveClass(
			"text-muted-foreground",
		);
	});

	it("should render custom change label", () => {
		render(
			<MetricCard
				title="Users"
				value={100}
				change={15}
				changeLabel="Custom increase message"
			/>,
		);

		expect(screen.getByText("Custom increase message")).toBeInTheDocument();
	});

	it("should render subtitle when provided", () => {
		render(
			<MetricCard
				title="Revenue"
				value={50000}
				subtitle="This month's total"
			/>,
		);

		expect(screen.getByText("This month's total")).toBeInTheDocument();
	});

	it("should render with default variant", () => {
		const { container } = render(<MetricCard title="Users" value={100} />);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass("bg-card", "border", "text-card-foreground");
	});

	it("should render with primary color", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} color="primary" />,
		);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass(
			"bg-gradient-to-br",
			"from-primary",
			"text-primary-foreground",
		);
	});

	it("should render with success color", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} color="success" />,
		);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass("from-success", "text-success-foreground");
	});

	it("should render with warning color", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} color="warning" />,
		);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass("from-warning", "text-warning-foreground");
	});

	it("should render with info color", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} color="info" />,
		);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass("from-info", "text-info-foreground");
	});

	it("should render with destructive color", () => {
		const { container } = render(
			<MetricCard title="Errors" value={5} color="destructive" />,
		);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass("from-destructive", "text-destructive-foreground");
	});

	it("should render with secondary color", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} color="secondary" />,
		);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass("from-secondary", "text-secondary-foreground");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} className="custom-class" />,
		);
		const card = container.querySelector('[data-kala-component="metric-card"]');

		expect(card).toHaveClass("custom-class");
	});

	it("should forward ref", () => {
		const ref = createRef<HTMLDivElement>();
		render(<MetricCard ref={ref} title="Users" value={100} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it("should forward additional props", () => {
		render(
			<MetricCard title="Users" value={100} data-testid="custom-metric" />,
		);

		expect(screen.getByTestId("custom-metric")).toBeInTheDocument();
	});

	it("should render both change and subtitle together", () => {
		render(
			<MetricCard
				title="Users"
				value={100}
				change={15}
				subtitle="Additional info"
			/>,
		);

		// When both are provided, change takes precedence
		expect(screen.getAllByText(/15% than last week/i)).toHaveLength(2); // One visible, one sr-only
	});

	it("should include screen reader text for value", () => {
		const value = 1234567;
		render(<MetricCard title="Revenue" value={value} />);

		const srText = screen.getByText(
			new RegExp(`Revenue: ${value.toLocaleString()}`, "i"),
		);
		expect(srText).toHaveClass("sr-only");
	});

	it("should include screen reader text for change", () => {
		render(<MetricCard title="Growth" value={100} change={15} />);

		const srText = screen.getByText(/Change: 15% than last week/i);
		expect(srText).toHaveClass("sr-only");
	});

	it("should apply correct color classes for positive change", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} change={15} color="muted" />,
		);

		const changeElement = container.querySelector(".text-success");
		expect(changeElement).toBeInTheDocument();
	});

	it("should apply correct color classes for negative change", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} change={-15} color="muted" />,
		);

		const changeElement = container.querySelector(".text-destructive");
		expect(changeElement).toBeInTheDocument();
	});

	it("should handle zero value", () => {
		render(<MetricCard title="Counter" value={0} />);

		expect(screen.getByText("0")).toBeInTheDocument();
	});

	it("should handle negative value", () => {
		render(<MetricCard title="Balance" value={-500} />);

		expect(screen.getByText("-500")).toBeInTheDocument();
	});

	it("should mark icon as decorative with aria-hidden", () => {
		render(
			<MetricCard
				title="Sales"
				value={100}
				icon={<span data-testid="metric-icon">$</span>}
			/>,
		);

		const iconContainer = screen.getByTestId("metric-icon").parentElement;
		expect(iconContainer).toHaveAttribute("aria-hidden", "true");
	});

	it("should mark change icon as decorative with aria-hidden", () => {
		render(<MetricCard title="Growth" value={100} change={10} />);

		expect(screen.getByText("↑")).toHaveAttribute("aria-hidden", "true");
	});

	it("should not render change or subtitle when neither provided", () => {
		const { container } = render(<MetricCard title="Users" value={100} />);

		expect(container.querySelector(".text-sm")).not.toBeInTheDocument();
	});

	it("should handle very large numbers", () => {
		render(<MetricCard title="Big Number" value={999999999} />);

		const elements = screen.getAllByText(
			/9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9[,.]?9/,
		);
		expect(elements.length).toBeGreaterThan(0);
	});

	it("should handle decimal numbers in change", () => {
		render(<MetricCard title="Growth" value={100} change={0.5} />);

		expect(screen.getByText("0.5% than last week")).toBeInTheDocument();
	});
});
