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
});
