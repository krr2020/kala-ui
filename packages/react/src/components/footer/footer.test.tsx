import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./footer";

const mockLinkSections = [
	{
		title: "Product",
		links: [
			{ label: "Features", href: "/features" },
			{ label: "Pricing", href: "/pricing" },
			{ label: "FAQ", href: "/faq" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "/about" },
			{ label: "Blog", href: "/blog" },
			{ label: "Careers", href: "/careers" },
		],
	},
];

const mockSocialLinks = [
	{
		name: "X",
		href: "https://x.com",
		icon: <span data-testid="twitter-icon">X</span>,
	},
	{
		name: "GitHub",
		href: "https://github.com",
		icon: <span data-testid="github-icon">GitHub</span>,
	},
];

describe("Footer", () => {
	describe("Link Sections", () => {
		it("should render link sections", () => {
			render(<Footer linkSections={mockLinkSections} />);

			expect(screen.getByText("Product")).toBeInTheDocument();
			expect(screen.getByText("Company")).toBeInTheDocument();
		});

		it("should render all links in sections", () => {
			render(<Footer linkSections={mockLinkSections} />);

			expect(screen.getByText("Features")).toBeInTheDocument();
			expect(screen.getByText("Pricing")).toBeInTheDocument();
			expect(screen.getByText("FAQ")).toBeInTheDocument();
			expect(screen.getByText("About")).toBeInTheDocument();
			expect(screen.getByText("Blog")).toBeInTheDocument();
			expect(screen.getByText("Careers")).toBeInTheDocument();
		});

		it("should render links with correct href attributes", () => {
			render(<Footer linkSections={mockLinkSections} />);

			const featuresLink = screen.getByText("Features");
			expect(featuresLink).toHaveAttribute("href", "/features");

			const aboutLink = screen.getByText("About");
			expect(aboutLink).toHaveAttribute("href", "/about");
		});
	});

	describe("Social Links", () => {
		it("should render social media links", () => {
			render(<Footer socialLinks={mockSocialLinks} />);

			expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
			expect(screen.getByTestId("github-icon")).toBeInTheDocument();
		});

		it("should render social links with correct attributes", () => {
			render(<Footer socialLinks={mockSocialLinks} />);

			const xLink = screen.getByLabelText("X");
			expect(xLink).toHaveAttribute("href", "https://x.com");
			expect(xLink).toHaveAttribute("target", "_blank");
			expect(xLink).toHaveAttribute("rel", "noopener noreferrer");
		});

		it("should not render social section when no links provided", () => {
			const { container } = render(<Footer linkSections={mockLinkSections} />);

			// Should not have social links specifically (check by social icon or social-specific content)
			const socialLinks = container.querySelectorAll(
				'a[aria-label="X"], a[aria-label="LinkedIn"]',
			);
			expect(socialLinks.length).toBe(0);
		});

		it("should render social link labels", () => {
			render(<Footer socialLinks={mockSocialLinks} />);
			expect(screen.getByLabelText("X")).toBeInTheDocument();
		});
	});

	describe("Copyright", () => {
		it("should render default copyright with current year", () => {
			render(<Footer />);

			const currentYear = new Date().getFullYear();
			expect(
				screen.getByText(`© ${currentYear} All rights reserved.`),
			).toBeInTheDocument();
		});

		it("should render custom copyright text", () => {
			render(
				<Footer copyright="© 2025 Custom Company. All rights reserved." />,
			);

			expect(
				screen.getByText("© 2025 Custom Company. All rights reserved."),
			).toBeInTheDocument();
		});
	});

	describe("Custom Content", () => {
		it("should render children content", () => {
			render(
				<Footer linkSections={mockLinkSections}>
					<div data-testid="newsletter">Newsletter Signup</div>
				</Footer>,
			);

			expect(screen.getByTestId("newsletter")).toBeInTheDocument();
			expect(screen.getByText("Newsletter Signup")).toBeInTheDocument();
		});
	});

	describe("Styling", () => {
		it("should apply custom className", () => {
			const { container } = render(<Footer className="custom-footer" />);

			const footer = container.querySelector("footer");
			expect(footer).toHaveClass("custom-footer");
		});

		it("should have default styling classes", () => {
			const { container } = render(<Footer />);

			const footer = container.querySelector("footer");
			expect(footer).toHaveClass("bg-muted");
			expect(footer).toHaveClass("text-muted-foreground");
		});

		it("should not apply text-center to footer when centered prop is true", () => {
			const { container } = render(<Footer centered />);

			const footer = container.querySelector("footer");
			expect(footer).not.toHaveClass("text-center");
		});
	});

	describe("Accessibility", () => {
		it("should use semantic footer element", () => {
			const { container } = render(<Footer />);

			const footer = container.querySelector("footer");
			expect(footer).toBeInTheDocument();
		});

		it("should have aria-label for social links", () => {
			render(<Footer socialLinks={mockSocialLinks} />);

			expect(screen.getByLabelText("X")).toBeInTheDocument();
			expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
		});
	});

	describe("Complete Footer", () => {
		it("should render all elements together", () => {
			render(
				<Footer
					linkSections={mockLinkSections}
					socialLinks={mockSocialLinks}
					copyright="© 2025 Test Company"
				>
					<div data-testid="custom-content">Custom Content</div>
				</Footer>,
			);

			// Link sections
			expect(screen.getByText("Product")).toBeInTheDocument();
			expect(screen.getByText("Company")).toBeInTheDocument();

			// Social links
			expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
			expect(screen.getByTestId("github-icon")).toBeInTheDocument();

			// Copyright
			expect(screen.getByText("© 2025 Test Company")).toBeInTheDocument();

			// Custom content
			expect(screen.getByTestId("custom-content")).toBeInTheDocument();
		});
	});
});
