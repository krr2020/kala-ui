import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategorySection } from "./category-section";
import type { CategoryMetadata, ComponentMetadata } from "./design-system-utils";

describe("CategorySection", () => {
	const mockComponents: ComponentMetadata[] = [
		{
			name: "Button",
			description: "Primary action component",
			docPath: "/docs/buttons-button--docs",
		},
		{
			name: "Input",
			description: "Text input field",
			docPath: "/docs/forms-input--docs",
		},
		{
			name: "Select",
			description: "Dropdown selection",
			docPath: "/docs/forms-select--docs",
		},
	];

	const mockCategory: CategoryMetadata = {
		name: "Form Controls",
		description: "Components for building forms and capturing user input",
		components: mockComponents,
	};

	const renderPreview = (componentName: string) => (
		<span data-testid={`preview-${componentName}`}>Preview of {componentName}</span>
	);

	it("should render the category section", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		expect(screen.getByText("Form Controls")).toBeInTheDocument();
	});

	it("should display the category name", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		expect(screen.getByText("Form Controls")).toBeInTheDocument();
	});

	it("should display the category description", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		expect(
			screen.getByText("Components for building forms and capturing user input"),
		).toBeInTheDocument();
	});

	it("should display the component count badge", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		expect(screen.getByText("3 components")).toBeInTheDocument();
	});

	it("should render a preview card for each component", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		expect(screen.getByText("Button")).toBeInTheDocument();
		expect(screen.getByText("Input")).toBeInTheDocument();
		expect(screen.getByText("Select")).toBeInTheDocument();
	});

	it("should pass the component name to renderPreview", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		expect(screen.getByTestId("preview-Button")).toBeInTheDocument();
		expect(screen.getByTestId("preview-Input")).toBeInTheDocument();
		expect(screen.getByTestId("preview-Select")).toBeInTheDocument();
	});

	it("should render preview content for each component", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		expect(screen.getByText("Preview of Button")).toBeInTheDocument();
		expect(screen.getByText("Preview of Input")).toBeInTheDocument();
		expect(screen.getByText("Preview of Select")).toBeInTheDocument();
	});

	it("should have an id on the heading for anchor linking", () => {
		render(<CategorySection category={mockCategory} renderPreview={renderPreview} />);
		const heading = screen.getByText("Form Controls").closest("h2");
		expect(heading).toHaveAttribute("id", "form-controls");
	});

	it("should convert multi-word names to hyphenated ids", () => {
		const multiWordCategory: CategoryMetadata = {
			name: "Data Display Components",
			description: "Components for displaying data",
			components: [],
		};
		render(
			<CategorySection category={multiWordCategory} renderPreview={renderPreview} />,
		);
		const heading = screen.getByText("Data Display Components").closest("h2");
		expect(heading).toHaveAttribute("id", "data-display-components");
	});

	it("should render a separator after the section", () => {
		const { container } = render(
			<CategorySection category={mockCategory} renderPreview={renderPreview} />,
		);
		const separator = container.querySelector("[data-slot='separator']");
		expect(separator).toBeInTheDocument();
	});

	it("should handle empty components array", () => {
		const emptyCategory: CategoryMetadata = {
			name: "Empty Category",
			description: "No components here",
			components: [],
		};
		render(
			<CategorySection category={emptyCategory} renderPreview={renderPreview} />,
		);
		expect(screen.getByText("Empty Category")).toBeInTheDocument();
		expect(screen.getByText("0 components")).toBeInTheDocument();
	});

	it("should render grid layout for component cards", () => {
		const { container } = render(
			<CategorySection category={mockCategory} renderPreview={renderPreview} />,
		);
		const grid = container.querySelector(".grid");
		expect(grid).toBeInTheDocument();
		expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4");
	});
});
