import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type BreadcrumbItem, Breadcrumbs } from "../breadcrumbs";

describe("Breadcrumbs", () => {
	it("should render single breadcrumb item", () => {
		const items: BreadcrumbItem[] = [{ label: "Home" }];
		render(<Breadcrumbs items={items} />);
		expect(screen.getByText("Home")).toBeInTheDocument();
	});

	it("should render multiple breadcrumb items", () => {
		const items: BreadcrumbItem[] = [
			{ label: "Home", href: "/" },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Users" },
		];
		render(<Breadcrumbs items={items} />);

		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("Users")).toBeInTheDocument();
	});

	it("should render links for items with href", () => {
		const items: BreadcrumbItem[] = [
			{ label: "Home", href: "/" },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Current" },
		];
		render(<Breadcrumbs items={items} />);

		const homeLink = screen.getByText("Home").closest("a");
		const dashboardLink = screen.getByText("Dashboard").closest("a");

		expect(homeLink).toHaveAttribute("href", "/");
		expect(dashboardLink).toHaveAttribute("href", "/dashboard");
	});

	it("should render last item without link", () => {
		const items: BreadcrumbItem[] = [
			{ label: "Home", href: "/" },
			{ label: "Current Page" },
		];
		render(<Breadcrumbs items={items} />);

		const currentPageText = screen.getByText("Current Page");
		const currentPageLink = currentPageText.closest("a");

		expect(currentPageLink).toBeNull();
	});

	it("should render separators between items", () => {
		const items: BreadcrumbItem[] = [
			{ label: "Home", href: "/" },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Users" },
		];
		const { container } = render(<Breadcrumbs items={items} />);

		// Should have 2 separators for 3 items (ChevronRight icons)
		const separators = container.querySelectorAll("svg");
		expect(separators.length).toBeGreaterThanOrEqual(2);
	});

	it("should apply custom className", () => {
		const items: BreadcrumbItem[] = [{ label: "Home" }];
		const { container } = render(
			<Breadcrumbs items={items} className="custom-breadcrumbs" />,
		);

		const breadcrumbs = container.querySelector(".custom-breadcrumbs");
		expect(breadcrumbs).toBeInTheDocument();
	});

	it("should render empty when items array is empty", () => {
		const { container } = render(<Breadcrumbs items={[]} />);
		const nav = container.querySelector("nav");
		expect(nav).toBeNull(); // Component returns null when empty
	});

	it("should highlight last item as current page", () => {
		const items: BreadcrumbItem[] = [
			{ label: "Home", href: "/" },
			{ label: "Current Page" },
		];
		render(<Breadcrumbs items={items} />);

		const currentPageText = screen.getByText("Current Page");
		expect(currentPageText.closest("li")).toHaveClass("text-foreground");
	});

	it("should style non-current items differently", () => {
		const items: BreadcrumbItem[] = [
			{ label: "Home", href: "/" },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Current" },
		];
		render(<Breadcrumbs items={items} />);

		const homeLink = screen.getByText("Home");
		expect(homeLink.closest("li")).toHaveClass("text-muted-foreground");
	});

	it("should render with single item without separator", () => {
		const items: BreadcrumbItem[] = [{ label: "Home" }];
		const { container } = render(<Breadcrumbs items={items} />);

		const separators = container.querySelectorAll(".i-lucide-chevron-right");
		expect(separators).toHaveLength(0);
	});

	it("should handle items with special characters", () => {
		const items: BreadcrumbItem[] = [
			{ label: "Home & Garden", href: "/home-garden" },
			{ label: "Tools <> Equipment" },
		];
		render(<Breadcrumbs items={items} />);

		expect(screen.getByText("Home & Garden")).toBeInTheDocument();
		expect(screen.getByText("Tools <> Equipment")).toBeInTheDocument();
	});

	it("should render items with long labels", () => {
		const items: BreadcrumbItem[] = [
			{
				label:
					"This is a very long breadcrumb label that might need truncation",
				href: "/long",
			},
			{ label: "Short" },
		];
		render(<Breadcrumbs items={items} />);

		expect(
			screen.getByText(
				"This is a very long breadcrumb label that might need truncation",
			),
		).toBeInTheDocument();
		expect(screen.getByText("Short")).toBeInTheDocument();
	});

	it("should render navigation with aria-label", () => {
		const items: BreadcrumbItem[] = [{ label: "Home" }];
		render(<Breadcrumbs items={items} />);

		const nav = screen.getByRole("navigation");
		expect(nav).toHaveAttribute("aria-label", "breadcrumb");
	});
});
