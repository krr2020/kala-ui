import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AspectRatio } from "./aspect-ratio";

describe("AspectRatio", () => {
	it("should render aspect ratio container with proper structure", () => {
		render(
			<AspectRatio ratio={16 / 9}>
				<img src="https://example.com/image.jpg" alt="Test" />
			</AspectRatio>,
		);

		const aspectRatio = document.querySelector('[data-slot="aspect-ratio"]');
		expect(aspectRatio).toBeInTheDocument();
		expect(aspectRatio).toHaveClass(
			"relative",
			"w-full",
			"overflow-hidden",
			"rounded-md",
		);
	});

	it("should render with default ratio", () => {
		const { container } = render(
			<AspectRatio>
				<img src="https://example.com/image.jpg" alt="Test" />
			</AspectRatio>,
		);

		const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
		expect(aspectRatio).toBeInTheDocument();
	});

	it("should render with custom ratio", () => {
		const { container } = render(
			<AspectRatio ratio={4 / 3}>
				<img src="https://example.com/image.jpg" alt="Test" />
			</AspectRatio>,
		);

		const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
		expect(aspectRatio).toBeInTheDocument();
	});

	it("should apply custom className to aspect ratio", () => {
		const { container } = render(
			<AspectRatio className="custom-aspect-ratio">
				<img src="https://example.com/image.jpg" alt="Test" />
			</AspectRatio>,
		);

		const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
		expect(aspectRatio).toHaveClass("custom-aspect-ratio");
	});

	it("should render with rounded variant", () => {
		const { container } = render(
			<AspectRatio rounded="lg">
				<img src="https://example.com/image.jpg" alt="Test" />
			</AspectRatio>,
		);

		const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
		expect(aspectRatio).toHaveClass("rounded-lg");
	});

	it("should render with bordered option", () => {
		const { container } = render(
			<AspectRatio bordered>
				<img src="https://example.com/image.jpg" alt="Test" />
			</AspectRatio>,
		);

		const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]');
		expect(aspectRatio).toHaveClass("border", "border-border");
	});

	it("should render with data-slot attribute", () => {
		const { container } = render(
			<AspectRatio>
				<img src="https://example.com/image.jpg" alt="Test" />
			</AspectRatio>,
		);

		expect(
			container.querySelector('[data-slot="aspect-ratio"]'),
		).toBeInTheDocument();
	});

	it("should render children content", () => {
		render(
			<AspectRatio>
				<div data-testid="test-content">Test Content</div>
			</AspectRatio>,
		);

		expect(screen.getByTestId("test-content")).toBeInTheDocument();
		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});
});
