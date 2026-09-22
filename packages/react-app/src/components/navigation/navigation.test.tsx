import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Navigation } from "./navigation";

const mockLinks = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
];

describe("Navigation", () => {
	describe("Desktop Navigation", () => {
		it("should render navigation links", () => {
			render(<Navigation links={mockLinks} pathname="/" />);

			// With dropdown mobile, links appear once in desktop view + once in mobile dropdown toggle
			expect(screen.getByText("Home")).toBeInTheDocument();
			expect(screen.getByText("About")).toBeInTheDocument();
			expect(screen.getByText("Contact")).toBeInTheDocument();
		});

		it("should highlight active link on homepage", () => {
			render(<Navigation links={mockLinks} pathname="/" />);

			const homeLinks = screen.getAllByText("Home");
			// Desktop link (first one in DOM)
			expect(homeLinks[0]).toHaveClass("text-primary");
		});

		it("should highlight active link on sub-page", () => {
			render(<Navigation links={mockLinks} pathname="/about" />);

			const aboutLinks = screen.getAllByText("About");
			expect(aboutLinks[0]).toHaveClass("text-primary");
		});

		it("should render horizontal orientation by default", () => {
			const { container } = render(
				<Navigation links={mockLinks} pathname="/" />,
			);

			const desktopNav = container.querySelector("nav.hidden.md\\:flex");
			expect(desktopNav).toHaveClass("flex-row");
		});
	});

	describe("Mobile Navigation", () => {
		it("should render mobile menu toggle button", () => {
			render(<Navigation links={mockLinks} pathname="/" />);

			const toggleButton = screen.getByLabelText("Toggle mobile navigation");
			expect(toggleButton).toBeInTheDocument();
		});

		it("should toggle mobile menu on button click", () => {
			render(<Navigation links={mockLinks} pathname="/" />);

			const toggleButton = screen.getByLabelText("Toggle mobile navigation");

			// Initially closed
			expect(toggleButton).toHaveAttribute("aria-expanded", "false");

			// Open menu
			fireEvent.click(toggleButton);
			expect(toggleButton).toHaveAttribute("aria-expanded", "true");

			// Close menu
			fireEvent.click(toggleButton);
			expect(toggleButton).toHaveAttribute("aria-expanded", "false");
		});

		it("should close mobile menu on mousedown outside", () => {
		render(<Navigation links={mockLinks} pathname="/" />);

		const toggleButton = screen.getByLabelText("Toggle mobile navigation");
		fireEvent.click(toggleButton);
		expect(toggleButton).toHaveAttribute("aria-expanded", "true");

		fireEvent.mouseDown(document.body);
		expect(toggleButton).toHaveAttribute("aria-expanded", "false");
	});

		it("should close mobile menu when link is clicked", () => {
			render(<Navigation links={mockLinks} pathname="/" />);

			const toggleButton = screen.getByLabelText("Toggle mobile navigation");

			// Open menu
			fireEvent.click(toggleButton);
			expect(toggleButton).toHaveAttribute("aria-expanded", "true");

			// Click a link in mobile menu (find the one in the dropdown)
			const aboutLinks = screen.getAllByText("About");
			const lastAboutLink = aboutLinks[aboutLinks.length - 1];
			if (lastAboutLink) {
				fireEvent.click(lastAboutLink);
			}

			// Menu should close
			expect(toggleButton).toHaveAttribute("aria-expanded", "false");
		});
	});

	describe("Vertical Layout", () => {
		it("should render vertical layout when orientation is vertical", () => {
			const { container } = render(
				<Navigation links={mockLinks} pathname="/" orientation="vertical" />,
			);

			const nav = container.querySelector("nav");
			expect(nav).toHaveClass("md:flex-col");
		});

		it("should render all links in vertical layout", () => {
			const { container } = render(
				<Navigation links={mockLinks} pathname="/" mobileLayout="vertical" />,
			);

			// Both desktop (hidden md:flex) and mobile (md:hidden) navs stay in
			// the DOM — mobileLayout only changes the MOBILE presentation, the
			// desktop horizontal bar must still exist.
			expect(screen.getAllByText("Home")).toHaveLength(2);
			expect(screen.getAllByText("About")).toHaveLength(2);
			expect(screen.getAllByText("Contact")).toHaveLength(2);

			const [desktopNav, mobileNav] = Array.from(
				container.querySelectorAll("nav"),
			);
			expect(desktopNav).toHaveClass("md:flex");
			expect(mobileNav).toHaveClass("md:hidden");
		});

		it("should not false-positive on partial href prefixes", () => {
			render(
				<Navigation
					links={[
						{ label: "Admin", href: "/admin" },
						{ label: "Users", href: "/users" },
					]}
					pathname="/admin-panel"
					mobileLayout="vertical"
				/>,
			);

			const adminLinks = screen.getAllByText("Admin");
			for (const link of adminLinks) {
				expect(link).not.toHaveAttribute("aria-current", "page");
			}

			const usersLinks = screen.getAllByText("Users");
			for (const link of usersLinks) {
				expect(link).not.toHaveAttribute("aria-current");
			}
		});
	});

	describe("Accessibility", () => {
		it("should have proper ARIA attributes for mobile toggle", () => {
			render(<Navigation links={mockLinks} pathname="/" />);

			const toggleButton = screen.getByLabelText("Toggle mobile navigation");
			expect(toggleButton).toHaveAttribute("aria-expanded");
			expect(toggleButton).toHaveAttribute(
				"aria-label",
				"Toggle mobile navigation",
			);
		});

		it("should have semantic nav elements", () => {
			const { container } = render(
				<Navigation links={mockLinks} pathname="/" />,
			);

			const navElements = container.querySelectorAll("nav");
			expect(navElements.length).toBeGreaterThan(0);
		});
	});

	describe("Custom className", () => {
		it("should apply custom className to navigation", () => {
			const { container } = render(
				<Navigation links={mockLinks} pathname="/" className="custom-class" />,
			);

			const nav = container.querySelector("nav");
			expect(nav).toHaveClass("custom-class");
		});
	});
});
