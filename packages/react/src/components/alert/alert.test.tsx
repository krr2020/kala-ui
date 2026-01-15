import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
	it("should render alert with title and description", () => {
		render(
			<Alert>
				<AlertTitle>Alert Title</AlertTitle>
				<AlertDescription>Alert description text</AlertDescription>
			</Alert>,
		);

		expect(screen.getByText("Alert Title")).toBeInTheDocument();
		expect(screen.getByText("Alert description text")).toBeInTheDocument();
	});

	it("should render with default variant", () => {
		const { container } = render(
			<Alert>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with danger variant", () => {
		const { container } = render(
			<Alert variant="danger">
				<AlertTitle>Error</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Alert className="custom-alert">
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toHaveClass("custom-alert");
	});

	it('should have role="alert"', () => {
		const { container } = render(
			<Alert>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[role="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with icon", () => {
		render(
			<Alert>
				<svg data-testid="alert-icon" />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
	});

	it("should render title with correct slot", () => {
		const { container } = render(
			<Alert>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		expect(
			container.querySelector('[data-slot="alert-title"]'),
		).toBeInTheDocument();
	});

	it("should render description with correct slot", () => {
		const { container } = render(
			<Alert>
				<AlertDescription>Description</AlertDescription>
			</Alert>,
		);

		expect(
			container.querySelector('[data-slot="alert-description"]'),
		).toBeInTheDocument();
	});
});
