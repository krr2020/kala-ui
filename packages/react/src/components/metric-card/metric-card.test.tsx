import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "./metric-card";

describe("MetricCard", () => {
	it("should render metric card with title and value", () => {
		render(<MetricCard title="Total Users" value={1250} />);

		expect(screen.getByText("Total Users")).toBeInTheDocument();
		expect(screen.getByText("1,250")).toBeInTheDocument();
	});

	it("should format numeric values with locale string", () => {
		render(<MetricCard title="Revenue" value={1234567} />);

		expect(screen.getByText("1,234,567")).toBeInTheDocument();
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
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass("bg-card", "border", "text-card-foreground");
	});

	it("should render with primary variant", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} variant="primary" />,
		);
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass(
			"bg-gradient-to-br",
			"from-primary",
			"text-primary-foreground",
		);
	});

	it("should render with success variant", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} variant="success" />,
		);
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass("from-success", "text-success-foreground");
	});

	it("should render with warning variant", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} variant="warning" />,
		);
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass("from-warning", "text-warning-foreground");
	});

	it("should render with info variant", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} variant="info" />,
		);
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass("from-info", "text-info-foreground");
	});

	it("should render with destructive variant", () => {
		const { container } = render(
			<MetricCard title="Errors" value={5} variant="destructive" />,
		);
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass("from-destructive", "text-destructive-foreground");
	});

	it("should render with secondary variant", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} variant="secondary" />,
		);
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass("from-secondary", "text-secondary-foreground");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} className="custom-class" />,
		);
		const card = container.querySelector('[data-comp="metric-card"]');

		expect(card).toHaveClass("custom-class");
	});

	it("should forward ref", () => {
		const ref = { current: null } as unknown as React.RefObject<HTMLDivElement>;
		render(
			<MetricCard
				ref={ref}
				title="Users"
				value={100}
			/>,
		);

		expect(ref.current).toBeTruthy();
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
		render(<MetricCard title="Revenue" value={1234567} />);

		const srText = screen.getByText(/Revenue: 1,234,567/i);
		expect(srText).toHaveClass("sr-only");
	});

	it("should include screen reader text for change", () => {
		render(<MetricCard title="Growth" value={100} change={15} />);

		const srText = screen.getByText(/Change: 15% than last week/i);
		expect(srText).toHaveClass("sr-only");
	});

	it("should apply correct color classes for positive change", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} change={15} variant="default" />,
		);

		const changeElement = container.querySelector(".text-success");
		expect(changeElement).toBeInTheDocument();
	});

	it("should apply correct color classes for negative change", () => {
		const { container } = render(
			<MetricCard title="Users" value={100} change={-15} variant="default" />,
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
});
