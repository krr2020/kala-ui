import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ComponentPreviewCard } from "./component-preview-card";
import type { ComponentMetadata } from "./design-system-utils";

// Mock window.location.origin for the href
Object.defineProperty(window, "location", {
	value: {
		origin: "http://localhost:6006",
	},
	writable: true,
});

describe("ComponentPreviewCard", () => {
	const mockMetadata: ComponentMetadata = {
		name: "Button",
		description: "Primary action component with multiple variants and sizes",
		docPath: "/docs/buttons-button--docs",
	};

	it("should render the card", () => {
		render(<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />);
		expect(screen.getByText("Button")).toBeInTheDocument();
	});

	it("should display the component name as the title", () => {
		render(<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />);
		expect(screen.getByText("Button")).toBeInTheDocument();
	});

	it("should display the component description", () => {
		render(<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />);
		expect(
			screen.getByText("Primary action component with multiple variants and sizes"),
		).toBeInTheDocument();
	});

	it("should render the preview content", () => {
		render(<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />);
		expect(screen.getByText("Preview")).toBeInTheDocument();
	});

	it("should render the View Documentation link", () => {
		render(<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />);
		expect(screen.getByText("View Documentation")).toBeInTheDocument();
	});

	it("should link to the correct documentation path", () => {
		render(<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />);
		const link = screen.getByText("View Documentation").closest("a");
		expect(link).toHaveAttribute("href", "http://localhost:6006/?path=/docs/buttons-button--docs");
	});

	it("should apply group and hover classes to the card", () => {
		const { container } = render(
			<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />,
		);
		const card = container.querySelector(".group");
		expect(card).toBeInTheDocument();
		expect(card).toHaveClass("transition-all", "hover:shadow-lg");
	});

	it("should render with different metadata", () => {
		const otherMeta: ComponentMetadata = {
			name: "Input",
			description: "Text input field",
			docPath: "/docs/forms-input--docs",
		};
		render(<ComponentPreviewCard metadata={otherMeta} preview={<div>Input Preview</div>} />);
		expect(screen.getByText("Input")).toBeInTheDocument();
		expect(screen.getByText("Text input field")).toBeInTheDocument();
		expect(screen.getByText("Input Preview")).toBeInTheDocument();
	});

	it("should render complex preview content", () => {
		render(
			<ComponentPreviewCard
				metadata={mockMetadata}
				preview={
					<div>
						<button type="button">Click me</button>
						<span>And me</span>
					</div>
				}
			/>,
		);
		expect(screen.getByText("Click me")).toBeInTheDocument();
		expect(screen.getByText("And me")).toBeInTheDocument();
	});

	it("should render preview in a bordered container", () => {
		const { container } = render(
			<ComponentPreviewCard metadata={mockMetadata} preview={<span>Preview</span>} />,
		);
		const previewContainer = container.querySelector(".rounded-md.border");
		expect(previewContainer).toBeInTheDocument();
	});
});
