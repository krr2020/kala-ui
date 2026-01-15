import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Sidebar, type SidebarSection } from "./sidebar";

describe("Sidebar", () => {
	const mockNavSections: SidebarSection[] = [
		{
			title: "Main",
			links: [
				{ label: "Dashboard", href: "/dashboard", icon: <span>📊</span> },
				{ label: "Analytics", href: "/analytics", badge: 3 },
			],
		},
		{
			title: "Settings",
			links: [
				{ label: "Profile", href: "/profile" },
				{ label: "Preferences", href: "/preferences" },
			],
		},
	];

	it("should render sidebar", () => {
		render(<Sidebar navSections={mockNavSections} />);

		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("Analytics")).toBeInTheDocument();
	});

	it("should render logo when provided", () => {
		render(
			<Sidebar
				logo={<div data-testid="logo">My App</div>}
				navSections={mockNavSections}
			/>,
		);

		expect(screen.getByTestId("logo")).toBeInTheDocument();
	});

	it("should render section titles", () => {
		render(<Sidebar navSections={mockNavSections} />);

		expect(screen.getByText("Main")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
	});

	it("should render link icons", () => {
		render(<Sidebar navSections={mockNavSections} />);

		expect(screen.getByText("📊")).toBeInTheDocument();
	});

	it("should render link badges", () => {
		render(<Sidebar navSections={mockNavSections} />);

		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("should mark active link based on pathname", () => {
		render(<Sidebar navSections={mockNavSections} pathname="/dashboard" />);

		const dashboardLink = screen.getByRole("link", { name: /Dashboard/i });
		expect(dashboardLink).toHaveClass("bg-primary", "text-primary-foreground");
	});

	it("should mark link as active for nested paths", () => {
		render(
			<Sidebar navSections={mockNavSections} pathname="/dashboard/settings" />,
		);

		const dashboardLink = screen.getByRole("link", { name: /Dashboard/i });
		expect(dashboardLink).toHaveClass("bg-primary", "text-primary-foreground");
	});

	it("should only mark root path as active for exact match", () => {
		const sectionsWithRoot: SidebarSection[] = [
			{
				links: [
					{ label: "Home", href: "/" },
					{ label: "Dashboard", href: "/dashboard" },
				],
			},
		];

		render(<Sidebar navSections={sectionsWithRoot} pathname="/" />);

		const homeLink = screen.getByRole("link", { name: "Home" });
		const dashboardLink = screen.getByRole("link", { name: "Dashboard" });

		expect(homeLink).toHaveClass("bg-primary");
		expect(dashboardLink).not.toHaveClass("bg-primary");
	});

	it("should render collapsible section", async () => {
		const user = userEvent.setup();
		const collapsibleSection: SidebarSection[] = [
			{
				title: "Collapsible",
				collapsible: true,
				links: [{ label: "Link 1", href: "/link1" }],
			},
		];

		render(<Sidebar navSections={collapsibleSection} />);

		const sectionButton = screen.getByRole("button", { name: "Collapsible" });
		expect(sectionButton).toHaveAttribute("aria-expanded", "true");

		// Collapse section
		await user.click(sectionButton);
		expect(sectionButton).toHaveAttribute("aria-expanded", "false");
	});

	it("should start collapsible section as closed when defaultOpen is false", () => {
		const collapsibleSection: SidebarSection[] = [
			{
				title: "Closed",
				collapsible: true,
				defaultOpen: false,
				links: [{ label: "Hidden Link", href: "/hidden" }],
			},
		];

		render(<Sidebar navSections={collapsibleSection} />);

		const sectionButton = screen.getByRole("button", { name: "Closed" });
		expect(sectionButton).toHaveAttribute("aria-expanded", "false");
	});

	it("should toggle section on click", async () => {
		const user = userEvent.setup();
		const collapsibleSection: SidebarSection[] = [
			{
				title: "Toggle",
				collapsible: true,
				links: [{ label: "Link", href: "/link" }],
			},
		];

		render(<Sidebar navSections={collapsibleSection} />);

		const link = screen.getByText("Link");
		expect(link).toBeVisible();

		const sectionButton = screen.getByRole("button", { name: "Toggle" });
		await user.click(sectionButton);

		expect(link).not.toBeVisible();
	});

	it("should render footer when provided", () => {
		render(
			<Sidebar
				navSections={mockNavSections}
				footer={<div data-testid="footer">Footer content</div>}
			/>,
		);

		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	it("should call onClose when link is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();

		render(<Sidebar navSections={mockNavSections} onClose={onClose} />);

		const link = screen.getByRole("link", { name: /Dashboard/i });
		await user.click(link);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Sidebar navSections={mockNavSections} className="custom-sidebar" />,
		);

		const sidebar = container.querySelector('[data-comp="sidebar"]');
		expect(sidebar).toHaveClass("custom-sidebar");
	});

	it("should be open by default", () => {
		const { container } = render(<Sidebar navSections={mockNavSections} />);

		const sidebar = container.querySelector('[data-comp="sidebar"]');
		expect(sidebar).not.toHaveClass("-translate-x-full");
	});

	it("should be closed when isOpen is false", () => {
		const { container } = render(
			<Sidebar navSections={mockNavSections} isOpen={false} />,
		);

		const sidebar = container.querySelector('[data-comp="sidebar"]');
		expect(sidebar).toHaveClass("-translate-x-full");
	});

	it("should render mobile overlay when open", () => {
		const { container } = render(
			<Sidebar navSections={mockNavSections} isOpen={true} />,
		);

		const overlay = container.querySelector(".fixed.inset-0.bg-black\\/50");
		expect(overlay).toBeInTheDocument();
	});

	it("should not render mobile overlay when closed", () => {
		const { container } = render(
			<Sidebar navSections={mockNavSections} isOpen={false} />,
		);

		const overlay = container.querySelector(".fixed.inset-0.bg-black\\/50");
		expect(overlay).not.toBeInTheDocument();
	});

	it("should call onClose when overlay is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		const { container } = render(
			<Sidebar navSections={mockNavSections} isOpen={true} onClose={onClose} />,
		);

		const overlay = container.querySelector(".fixed.inset-0.bg-black\\/50");
		if (overlay) {
			await user.click(overlay);
			expect(onClose).toHaveBeenCalledTimes(1);
		}
	});

	it("should render sections without titles", () => {
		const sectionsWithoutTitles: SidebarSection[] = [
			{
				links: [{ label: "Link 1", href: "/link1" }],
			},
		];

		render(<Sidebar navSections={sectionsWithoutTitles} />);

		expect(screen.getByText("Link 1")).toBeInTheDocument();
	});

	it("should not make non-collapsible sections clickable", () => {
		const nonCollapsibleSection: SidebarSection[] = [
			{
				title: "Non-Collapsible",
				collapsible: false,
				links: [{ label: "Link", href: "/link" }],
			},
		];

		render(<Sidebar navSections={nonCollapsibleSection} />);

		const sectionButton = screen.getByRole("button", {
			name: "Non-Collapsible",
		});
		expect(sectionButton).toBeDisabled();
		expect(sectionButton).not.toHaveAttribute("aria-expanded");
	});

	it("should rotate chevron icon when section is expanded", () => {
		const collapsibleSection: SidebarSection[] = [
			{
				title: "Section",
				collapsible: true,
				links: [{ label: "Link", href: "/link" }],
			},
		];

		const { container } = render(<Sidebar navSections={collapsibleSection} />);

		const chevron = container.querySelector(".rotate-180");
		expect(chevron).toBeInTheDocument();
	});

	it("should handle multiple collapsible sections independently", async () => {
		const user = userEvent.setup();
		const sections: SidebarSection[] = [
			{
				title: "Section 1",
				collapsible: true,
				links: [{ label: "Link 1", href: "/link1" }],
			},
			{
				title: "Section 2",
				collapsible: true,
				links: [{ label: "Link 2", href: "/link2" }],
			},
		];

		render(<Sidebar navSections={sections} />);

		const section1Button = screen.getByRole("button", { name: "Section 1" });
		const section2Button = screen.getByRole("button", { name: "Section 2" });

		// Collapse section 1
		await user.click(section1Button);
		expect(section1Button).toHaveAttribute("aria-expanded", "false");
		expect(section2Button).toHaveAttribute("aria-expanded", "true");
	});
});
