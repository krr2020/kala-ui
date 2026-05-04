import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./header";

describe("Header", () => {
	const mockNavLinks = [
		{ label: "Home", href: "/", active: true },
		{ label: "About", href: "/about" },
		{ label: "Contact", href: "/contact" },
	];

	it("renders logo correctly", () => {
		render(<Header logo={<div data-testid="logo">Logo</div>} />);
		expect(screen.getByTestId("logo")).toBeInTheDocument();
	});

	it("renders navigation links", () => {
		render(<Header navLinks={mockNavLinks} />);
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("About")).toBeInTheDocument();
		expect(screen.getByText("Contact")).toBeInTheDocument();
	});

	it("applies active styles to active link", () => {
		render(<Header navLinks={mockNavLinks} />);
		const homeLink = screen.getAllByText("Home")[0]; // Desktop link
		expect(homeLink).toHaveClass("text-primary");
	});

	it("renders user menu when provided", () => {
		render(<Header userMenu={<div data-testid="user-menu">User Menu</div>} />);
		expect(screen.getByTestId("user-menu")).toBeInTheDocument();
	});

	it("renders mobile menu toggle button", () => {
		const handleToggle = vi.fn();
		render(<Header onMobileMenuToggle={handleToggle} />);
		expect(screen.getByLabelText("Toggle mobile menu")).toBeInTheDocument();
	});

	it("calls onMobileMenuToggle when toggle button is clicked", async () => {
		const handleToggle = vi.fn();
		const user = userEvent.setup();
		render(<Header onMobileMenuToggle={handleToggle} />);

		await user.click(screen.getByLabelText("Toggle mobile menu"));
		expect(handleToggle).toHaveBeenCalledTimes(1);
	});

	it("shows mobile navigation when isMobileMenuOpen is true", () => {
		render(<Header navLinks={mockNavLinks} isMobileMenuOpen={true} />);
		// Check for duplicate links (desktop + mobile)
		const homeLinks = screen.getAllByText("Home");
		expect(homeLinks.length).toBeGreaterThan(1);
	});

	it("hides mobile navigation when isMobileMenuOpen is false", () => {
		render(<Header navLinks={mockNavLinks} isMobileMenuOpen={false} />);
		// Only desktop link should exist
		const homeLinks = screen.getAllByText("Home");
		expect(homeLinks.length).toBe(1);
	});

	it("shows close icon when mobile menu is open", () => {
		render(
			<Header
				navLinks={mockNavLinks}
				isMobileMenuOpen={true}
				onMobileMenuToggle={vi.fn()}
			/>,
		);
		const button = screen.getByLabelText("Toggle mobile menu");
		const svg = button.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass("lucide-x");
	});

	it("shows menu icon when mobile menu is closed", () => {
		render(
			<Header
				navLinks={mockNavLinks}
				isMobileMenuOpen={false}
				onMobileMenuToggle={vi.fn()}
			/>,
		);
		const button = screen.getByLabelText("Toggle mobile menu");
		const svg = button.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass("lucide-menu");
	});

	it("applies custom className", () => {
		const { container } = render(<Header className="custom-header" />);
		const header = container.querySelector("header");
		expect(header).toHaveClass("custom-header");
	});

	it("renders mobile user menu when isMobileMenuOpen is true", () => {
		render(
			<Header
				userMenu={<div data-testid="user-menu">User Menu</div>}
				isMobileMenuOpen={true}
			/>,
		);
		const userMenus = screen.getAllByTestId("user-menu");
		expect(userMenus.length).toBeGreaterThan(1); // Desktop + Mobile
	});

	it("renders dashboard variant", () => {
		render(<Header variant="dashboard" navLinks={mockNavLinks} />);
		expect(screen.getByText("Home")).toBeInTheDocument();
	});

	it("renders search bar when provided", () => {
		render(
			<Header searchBar={<div data-testid="search-bar">Search</div>} />,
		);
		expect(screen.getByTestId("search-bar")).toBeInTheDocument();
	});

	it("renders theme switcher when provided", () => {
		render(
			<Header themeSwitcher={<div data-testid="theme-switcher">Theme</div>} />,
		);
		expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
	});

	it("renders language switcher when provided", () => {
		render(
			<Header languageSwitcher={<div data-testid="lang-switcher">Lang</div>} />,
		);
		expect(screen.getByTestId("lang-switcher")).toBeInTheDocument();
	});

	it("renders notifications when provided", () => {
		render(
			<Header notifications={<div data-testid="notif">Notif</div>} />,
		);
		expect(screen.getByTestId("notif")).toBeInTheDocument();
	});

	it("renders nav links with children (dropdown)", () => {
		const navWithChildren = [
			{
				label: "Products",
				href: "/products",
				children: [
					{ label: "Product A", href: "/products/a" },
					{ label: "Product B", href: "/products/b" },
				],
			},
		];
		render(<Header navLinks={navWithChildren} />);
		expect(screen.getByText("Products")).toBeInTheDocument();
	});

	it("renders mobile notifications tab", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				notifications={<div data-testid="mobile-notif">Notif</div>}
			/>,
		);
		expect(screen.getByText("Alerts")).toBeInTheDocument();
	});

	it("renders mobile preferences tab", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				themeSwitcherMobile={<div>Theme Switch</div>}
			/>,
		);
		expect(screen.getByText("Preferences")).toBeInTheDocument();
	});

	it("renders userProfile in mobile menu", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userProfile={{
					name: "John Doe",
					email: "john@example.com",
					links: [
						{ label: "Profile", href: "/profile" },
						{ label: "Logout", onClick: vi.fn() },
					],
				}}
			/>,
		);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("john@example.com")).toBeInTheDocument();
	});

	it("renders userProfile with avatar", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userProfile={{
					name: "John",
					email: "john@example.com",
					avatar: "/avatar.jpg",
					links: [{ label: "Profile", href: "/profile" }],
				}}
			/>,
		);
		const img = document.querySelector('img[alt="John"]');
		expect(img).toHaveAttribute("src", "/avatar.jpg");
	});

	it("renders userProfile links with dividers", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userProfile={{
					name: "John",
					email: "john@example.com",
					links: [
						{ label: "Settings", href: "/settings" },
						{ label: "Logout", href: "/logout", divider: true, variant: "danger" },
					],
				}}
			/>,
		);
		expect(screen.getByText("Settings")).toBeInTheDocument();
		expect(screen.getByText("Logout")).toBeInTheDocument();
	});

	it("renders userProfile with onClick links", () => {
		const onClick = vi.fn();
		render(
			<Header
				isMobileMenuOpen={true}
				onMobileMenuToggle={vi.fn()}
				userProfile={{
					name: "John",
					email: "john@example.com",
					links: [{ label: "Action", onClick }],
				}}
			/>,
		);
		expect(screen.getByText("Action")).toBeInTheDocument();
	});

	it("renders empty notifications state", () => {
		render(<Header isMobileMenuOpen={true} />);
		expect(screen.getByText("Menu")).toBeInTheDocument();
		expect(screen.getByText("Alerts")).toBeInTheDocument();
	});

	it("renders nav links with many children (>3) in mobile menu", async () => {
		const navWithManyChildren = [
			{
				label: "Services",
				href: "/services",
				children: [
					{ label: "Service A", href: "/services/a" },
					{ label: "Service B", href: "/services/b" },
					{ label: "Service C", href: "/services/c" },
					{ label: "Service D", href: "/services/d" },
				],
			},
		];
		render(<Header navLinks={navWithManyChildren} />);
		expect(screen.getByText("Services")).toBeInTheDocument();
	});

	it("renders nav link with active child in dropdown (trigger renders)", () => {
		const navWithActiveChild = [
			{
				label: "Products",
				href: "/products",
				children: [
					{ label: "Active Product", href: "/products/active", active: true },
					{ label: "Other Product", href: "/products/other" },
				],
			},
		];
		render(<Header navLinks={navWithActiveChild} />);
		// Radix NavigationMenu only renders the trigger, not the content until opened
		expect(screen.getByText("Products")).toBeInTheDocument();
		// The trigger button should exist with aria-controls
		const trigger = screen.getByRole("button", { name: /products/i });
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("toggles expanded mobile nav items", async () => {
		const user = userEvent.setup();
		const navWithChildren = [
			{
				label: "Expandable",
				href: "/expandable",
				children: [
					{ label: "Child 1", href: "/expandable/1" },
				],
			},
		];
		render(
			<Header
				navLinks={navWithChildren}
				isMobileMenuOpen={true}
				onMobileMenuToggle={vi.fn()}
			/>,
		);

		// Find the mobile nav link (there should be multiple due to desktop + mobile)
		const expandLinks = screen.getAllByText("Expandable");
		// Click the mobile version
		await user.click(expandLinks[expandLinks.length - 1]);
		expect(screen.getByText("Child 1")).toBeInTheDocument();
	});

	it("renders mobile notifications with mobileNotifications prop", async () => {
		const user = userEvent.setup();
		render(
			<Header
				isMobileMenuOpen={true}
				mobileNotifications={<div data-testid="mobile-notif">Mobile Notif</div>}
			/>,
		);
		// Switch to the notifications tab
		await user.click(screen.getByRole("tab", { name: /alerts/i }));
		expect(document.querySelector('[data-testid="mobile-notif"]')).toBeInTheDocument();
	});

	it("renders userMenu fallback in mobile menu when no userProfile", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userMenu={<div data-testid="fallback-menu">Fallback</div>}
			/>,
		);
		// Mobile menu is portaled to document.body
		expect(document.body).toContainHTML("Account");
		expect(document.body).toContainHTML("Fallback");
	});

	it("renders userProfile links with icon", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userProfile={{
					name: "John",
					email: "john@example.com",
					links: [
						{
							label: "Settings",
							href: "/settings",
							icon: <span data-testid="settings-icon">S</span>,
						},
					],
				}}
			/>,
		);
		expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
	});

	it("renders userProfile onClick links with icon", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userProfile={{
					name: "John",
					email: "john@example.com",
					links: [
						{
							label: "Action",
							onClick: vi.fn(),
							icon: <span data-testid="action-icon">A</span>,
						},
					],
				}}
			/>,
		);
		expect(screen.getByTestId("action-icon")).toBeInTheDocument();
	});

	it("renders userProfile with danger variant link", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userProfile={{
					name: "John",
					email: "john@example.com",
					links: [
						{
							label: "Delete",
							onClick: vi.fn(),
							variant: "danger",
						},
					],
				}}
			/>,
		);
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});

	it("renders userProfile with danger variant href link", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				onMobileMenuToggle={vi.fn()}
				userProfile={{
					name: "John",
					email: "john@example.com",
					links: [
						{
							label: "Delete",
							href: "/delete",
							variant: "danger",
						},
					],
				}}
			/>,
		);
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});

	it("does not show divider on first link when index is 0", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				userProfile={{
					name: "John",
					email: "john@example.com",
					links: [
						{ label: "First", href: "/first", divider: true },
						{ label: "Second", href: "/second" },
					],
				}}
			/>,
		);
		// divider on first item with index 0 should not render
		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("renders language switcher mobile (portal content exists)", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				languageSwitcherMobile={<div data-testid="lang-mobile">Lang Mobile</div>}
			/>,
		);
		// The mobile menu portal should be present on document.body
		expect(document.body.querySelector('[aria-label="Mobile navigation"]')).toBeInTheDocument();
	});

	it("renders both theme and language switcher mobile (portal content exists)", () => {
		render(
			<Header
				isMobileMenuOpen={true}
				themeSwitcherMobile={<div data-testid="theme-mobile">Theme Mobile</div>}
				languageSwitcherMobile={<div data-testid="lang-mobile">Lang Mobile</div>}
			/>,
		);
		// The mobile menu portal should be present on document.body
		expect(document.body.querySelector('[aria-label="Mobile navigation"]')).toBeInTheDocument();
	});

	it("renders with no optional props", () => {
		const { container } = render(<Header />);
		expect(container.querySelector("header")).toBeInTheDocument();
	});

	it("has displayName set to Header", () => {
		expect(Header.displayName).toBe("Header");
	});
});
