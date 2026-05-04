import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldSkeleton } from "./field-skeleton";

describe("FieldSkeleton", () => {
	it("renders with default data-testid", () => {
		render(<FieldSkeleton />);
		expect(screen.getByTestId("field-skeleton")).toBeInTheDocument();
	});

	it("renders with custom data-testid", () => {
		render(<FieldSkeleton data-testid="my-field-skel" />);
		expect(screen.getByTestId("my-field-skel")).toBeInTheDocument();
	});

	it("renders label skeleton by default", () => {
		const { container } = render(<FieldSkeleton />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// 1 label + 1 control = 2 skeletons
		expect(skeletons.length).toBe(2);
	});

	it("hides label skeleton when showLabel is false", () => {
		const { container } = render(<FieldSkeleton showLabel={false} />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// Only control skeleton
		expect(skeletons.length).toBe(1);
	});

	it("renders required indicator when required is true", () => {
		const { container } = render(<FieldSkeleton required />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// 1 label + 1 required dot + 1 control = 3
		expect(skeletons.length).toBe(3);
	});

	it("does not render required indicator when required is false", () => {
		const { container } = render(<FieldSkeleton required={false} />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// 1 label + 1 control = 2
		expect(skeletons.length).toBe(2);
	});

	it("renders helper text skeleton when showHelperText is true", () => {
		const { container } = render(<FieldSkeleton showHelperText />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// 1 label + 1 control + 1 helper = 3
		expect(skeletons.length).toBe(3);
	});

	it("does not render helper text skeleton by default", () => {
		const { container } = render(<FieldSkeleton />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		expect(skeletons.length).toBe(2);
	});

	it("renders with error variant", () => {
		const { container } = render(<FieldSkeleton variant="error" />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// Error variant applies border-destructive to control and bg-destructive/20 to helper
		expect(skeletons.length).toBe(2);
	});

	it("renders with default variant", () => {
		const { container } = render(<FieldSkeleton variant="default" />);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		expect(skeletons.length).toBe(2);
	});

	it("applies custom className", () => {
		render(<FieldSkeleton className="custom-fs" />);
		expect(screen.getByTestId("field-skeleton")).toHaveClass("custom-fs");
	});

	it("renders with error variant and helper text", () => {
		const { container } = render(
			<FieldSkeleton variant="error" showHelperText />,
		);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// label + control + helper
		expect(skeletons.length).toBe(3);
	});

	it("renders with all props enabled", () => {
		const { container } = render(
			<FieldSkeleton showLabel required showHelperText variant="error" />,
		);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		// label + required dot + control + helper
		expect(skeletons.length).toBe(4);
	});

	it("renders with custom controlHeight", () => {
		const { container } = render(<FieldSkeleton controlHeight="4rem" />);
		const controlSkeleton = container.querySelectorAll('[data-slot="skeleton"]')[1];
		expect(controlSkeleton).toHaveStyle({ height: "4rem" });
	});
});
