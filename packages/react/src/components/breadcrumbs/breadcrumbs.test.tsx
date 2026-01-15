import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./breadcrumbs";

describe("Breadcrumbs", () => {
	const basicItems = [
		{ label: "Home", href: "/" },
		{ label: "Products", href: "/products" },
		{ label: "Item" },
	];

	it("should render breadcrumbs with items", () => {
		render(<Breadcrumbs items={basicItems} />);

		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Products")).toBeInTheDocument();
		expect(screen.getByText("Item")).toBeInTheDocument();
	});

	it("should render navigation with breadcrumb aria-label", () => {
		render(<Breadcrumbs items={basicItems} />);

		const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
		expect(nav).toBeInTheDocument();
	});

	it("should render links for items with href", () => {
		render(<Breadcrumbs items={basicItems} />);

		const homeLink = screen.getByRole("link", { name: "Home" });
		const productsLink = screen.getByRole("link", { name: "Products" });

		expect(homeLink).toHaveAttribute("href", "/");
		expect(productsLink).toHaveAttribute("href", "/products");
	});

	it("should render last item without link", () => {
		render(<Breadcrumbs items={basicItems} />);

		const lastItem = screen.getByText("Item");
		expect(lastItem.tagName).toBe("SPAN");
	});

	it('should mark last item with aria-current="page"', () => {
		render(<Breadcrumbs items={basicItems} />);

		const listItems = screen.getAllByRole("listitem");
		const lastItem = listItems[listItems.length - 1];

		expect(lastItem).toHaveAttribute("aria-current", "page");
	});

	it("should render with default variant", () => {
		render(<Breadcrumbs items={basicItems} />);

		// Default variant uses ChevronRight icon as separator
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("should render with style1 variant (uppercase)", () => {
		const { container } = render(
			<Breadcrumbs items={basicItems} variant="style1" />,
		);

		const list = container.querySelector("ol");
		expect(list).toHaveClass("text-uppercase");
	});

	it("should render with style2 variant (> separator)", () => {
		render(<Breadcrumbs items={basicItems} variant="style2" />);

		expect(screen.getAllByText(">")).toHaveLength(2); // Multiple separators
	});

	it("should render with style3 variant (• separator)", () => {
		render(<Breadcrumbs items={basicItems} variant="style3" />);

		expect(screen.getAllByText("•")).toHaveLength(2); // Multiple separators
	});

	it("should render with custom separator", () => {
		render(
			<Breadcrumbs
				items={basicItems}
				separator={<span data-testid="custom-separator">/</span>}
			/>,
		);

		expect(screen.getAllByTestId("custom-separator")).toHaveLength(2); // 2 separators for 3 items
	});

	it("should apply custom className to nav", () => {
		render(<Breadcrumbs items={basicItems} className="custom-breadcrumb" />);

		const nav = screen.getByRole("navigation");
		expect(nav).toHaveClass("custom-breadcrumb");
	});

	it("should not render when items array is empty", () => {
		const { container } = render(<Breadcrumbs items={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render single item without separator", () => {
		render(<Breadcrumbs items={[{ label: "Home" }]} />);

		expect(screen.getByText("Home")).toBeInTheDocument();
		// No separator should be rendered for single item
		const listItems = screen.getAllByRole("listitem");
		expect(listItems).toHaveLength(1);
	});

	it("should render items without href as spans", () => {
		render(<Breadcrumbs items={[{ label: "First" }, { label: "Second" }]} />);

		const first = screen.getByText("First");
		const second = screen.getByText("Second");

		expect(first.tagName).toBe("SPAN");
		expect(second.tagName).toBe("SPAN");
	});

	it("should handle mixed items (with and without href)", () => {
		const mixedItems = [
			{ label: "Home", href: "/" },
			{ label: "Category" }, // no href
			{ label: "Subcategory", href: "/subcategory" },
			{ label: "Item" },
		];

		render(<Breadcrumbs items={mixedItems} />);

		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
		expect(screen.getByText("Category")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Subcategory" }),
		).toBeInTheDocument();
		expect(screen.getByText("Item")).toBeInTheDocument();
	});

	it("should apply correct styling to last item", () => {
		const { container } = render(<Breadcrumbs items={basicItems} />);

		const listItems = container.querySelectorAll("li");
		const lastItem = listItems[listItems.length - 1];

		expect(lastItem).toHaveClass("text-foreground", "font-normal");
	});

	it("should apply muted color to non-last items", () => {
		const { container } = render(<Breadcrumbs items={basicItems} />);

		const listItems = container.querySelectorAll("li");

		for (let i = 0; i < listItems.length - 1; i++) {
			expect(listItems[i]).toHaveClass("text-muted-foreground");
		}
	});
});
