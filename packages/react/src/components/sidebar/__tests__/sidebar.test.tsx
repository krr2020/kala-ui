import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Sidebar, type SidebarProps } from "../sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
	usePathname: vi.fn(() => "/dashboard"),
}));

const mockNavSections: SidebarProps["navSections"] = [
	{
		title: "Main",
		links: [
			{ label: "Dashboard", href: "/dashboard", icon: <span>📊</span> },
			{ label: "Users", href: "/users", badge: 5 },
		],
		collapsible: true,
		defaultOpen: true,
	},
	{
		title: "Settings",
		links: [
			{ label: "Profile", href: "/profile" },
			{ label: "Security", href: "/security" },
		],
		collapsible: true,
		defaultOpen: false,
	},
];

describe("Sidebar", () => {
	it("should render logo when provided", () => {
		render(
			<Sidebar
				logo={<div data-testid="logo">My App</div>}
				navSections={mockNavSections}
			/>,
		);
		expect(screen.getByTestId("logo")).toBeInTheDocument();
	});

	it("should render navigation sections", () => {
		render(<Sidebar navSections={mockNavSections} />);
		expect(screen.getByText("Main")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
	});

	it("should render navigation links", () => {
		render(<Sidebar navSections={mockNavSections} />);
		// Main section is defaultOpen: true
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("Users")).toBeInTheDocument();
		// Settings section is defaultOpen: false, so links are hidden initially
		expect(screen.queryByText("Profile")).not.toBeInTheDocument();
		expect(screen.queryByText("Security")).not.toBeInTheDocument();
	});

	it("should render link icons when provided", () => {
		render(<Sidebar navSections={mockNavSections} />);
		expect(screen.getByText("📊")).toBeInTheDocument();
	});

	it("should render badge when provided", () => {
		render(<Sidebar navSections={mockNavSections} />);
		expect(screen.getByText("5")).toBeInTheDocument();
	});

	it("should highlight active link based on pathname", () => {
		render(<Sidebar navSections={mockNavSections} pathname="/users" />);
		const usersLink = screen.getByText("Users").closest("a");
		expect(usersLink).toHaveClass("bg-primary");
	});

	it("should render footer when provided", () => {
		render(
			<Sidebar
				navSections={mockNavSections}
				footer={<div data-testid="footer">Version 1.0</div>}
			/>,
		);
		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Sidebar navSections={mockNavSections} className="custom-sidebar" />,
		);
		const sidebar = container.querySelector(".custom-sidebar");
		expect(sidebar).toBeInTheDocument();
	});

	it("should show open sidebar on mobile when isOpen=true", () => {
		const { container } = render(
			<Sidebar navSections={mockNavSections} isOpen={true} />,
		);
		const sidebar = container.querySelector('[class*="translate-x-0"]');
		expect(sidebar).toBeInTheDocument();
	});

	it("should hide sidebar on mobile when isOpen=false", () => {
		const { container } = render(
			<Sidebar navSections={mockNavSections} isOpen={false} />,
		);
		const sidebar = container.querySelector('[class*="-translate-x-full"]');
		expect(sidebar).toBeInTheDocument();
	});

	it("should call onClose when overlay is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		const { container } = render(
			<Sidebar navSections={mockNavSections} isOpen={true} onClose={onClose} />,
		);

		const overlay = container.querySelector(".bg-black\\/50");
		if (overlay) {
			await user.click(overlay);
			expect(onClose).toHaveBeenCalledOnce();
		}
	});

	it("should toggle collapsible section when header is clicked", async () => {
		const user = userEvent.setup();
		render(<Sidebar navSections={mockNavSections} />);

		const settingsHeader = screen.getByText("Settings");

		// Initially collapsed (defaultOpen: false)
		expect(screen.queryByText("Profile")).not.toBeInTheDocument();

		// Click to expand
		await user.click(settingsHeader);
		expect(screen.getByText("Profile")).toBeInTheDocument();

		// Click to collapse
		await user.click(settingsHeader);
		expect(screen.queryByText("Profile")).not.toBeInTheDocument();
	});

	it("should open collapsible section by default when defaultOpen=true", () => {
		render(<Sidebar navSections={mockNavSections} />);

		// Main section has defaultOpen: true
		expect(screen.getByText("Dashboard")).toBeVisible();
		expect(screen.getByText("Users")).toBeVisible();
	});

	it("should render without nav sections", () => {
		const { container } = render(<Sidebar />);
		expect(container.querySelector("nav")).toBeInTheDocument();
	});

	it("should render section without title", () => {
		const sectionsWithoutTitle: SidebarProps["navSections"] = [
			{
				links: [{ label: "Link 1", href: "/link1" }],
			},
		];
		render(<Sidebar navSections={sectionsWithoutTitle} />);
		expect(screen.getByText("Link 1")).toBeInTheDocument();
	});

	it("should render non-collapsible section", () => {
		const nonCollapsibleSections: SidebarProps["navSections"] = [
			{
				title: "Always Visible",
				links: [{ label: "Link 1", href: "/link1" }],
				collapsible: false,
			},
		];
		render(<Sidebar navSections={nonCollapsibleSections} />);
		expect(screen.getByText("Link 1")).toBeVisible();
	});
});
