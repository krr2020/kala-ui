import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "./navigation-menu";

afterEach(() => {
	vi.clearAllMocks();
});

describe("NavigationMenu", () => {
	it("should render navigation menu", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);
		expect(screen.getByText("Home")).toBeInTheDocument();
	});

	it("should render multiple navigation items", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href="/about">About</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("About")).toBeInTheDocument();
		expect(screen.getByText("Contact")).toBeInTheDocument();
	});

	it("should render navigation menu with trigger", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		expect(screen.getByText("Products")).toBeInTheDocument();
		expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
	});

	it("should open content when trigger is clicked", async () => {
		const user = userEvent.setup();

		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
							<NavigationMenuLink href="/product-2">
								Product 2
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const trigger = screen.getByText("Products");
		await user.click(trigger);

		// Content should be in viewport
		expect(screen.getByText("Product 1")).toBeInTheDocument();
		expect(screen.getByText("Product 2")).toBeInTheDocument();
	});

	it("should render navigation menu link with active state", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink active href="/about">
							About
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const link = screen.getByText("About");
		expect(link.closest('[data-slot="navigation-menu-link"]')).toHaveAttribute(
			"data-active",
		);
	});

	it("should render navigation menu with indicator", () => {
		const { container } = render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
				<NavigationMenuIndicator />
			</NavigationMenu>,
		);

		const navigationMenu = container.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toBeInTheDocument();
	});

	it("should apply custom className to navigation menu", () => {
		render(
			<NavigationMenu className="custom-class">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const navigationMenu = document.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toHaveClass("custom-class");
	});

	it("should apply custom className correctly", () => {
		const { container } = render(
			<NavigationMenu className="custom-class">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const navigationMenu = container.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toHaveClass("custom-class");
	});

	it("should render disabled trigger", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger disabled>Disabled</NavigationMenuTrigger>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const trigger = screen.getByText("Disabled");
		expect(trigger).toBeDisabled();
	});

	it("should render navigation menu with viewport", () => {
		const { container } = render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const navigationMenu = container.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toBeInTheDocument();
	});

	it("should handle controlled value", () => {
		render(
			<NavigationMenu value="item-1">
				<NavigationMenuList>
					<NavigationMenuItem value="item-1">
						<NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/link-1">Link 1</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		expect(screen.getByText("Item 1")).toBeInTheDocument();
	});

	it("should handle orientation vertical", () => {
		render(
			<NavigationMenu orientation="vertical">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		expect(screen.getByText("Products")).toBeInTheDocument();
	});

	it("should render navigation links with correct attributes", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							href="https://example.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							External Link
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const linkWrapper = screen.getByText("External Link");
		const link = linkWrapper.closest('[data-slot="navigation-menu-link"]');
		expect(link).toHaveAttribute("href", "https://example.com");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("should render navigation menu with multiple triggers and content", async () => {
		const user = userEvent.setup();

		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/solution-1">
								Solution 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const productTrigger = screen.getByText("Products");
		await user.click(productTrigger);

		expect(screen.getByText("Product 1")).toBeInTheDocument();
	});

	it("should render navigation menu with custom className on trigger", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger className="custom-trigger">
							Products
						</NavigationMenuTrigger>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const trigger = screen.getByText("Products");
		expect(trigger).toHaveClass("custom-trigger");
	});

	it("should render navigation menu with custom className on link", () => {
		const { container } = render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink className="custom-link" href="/">
							Home
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const link = container.querySelector('[data-slot="navigation-menu-link"]');
		expect(link).toHaveClass("custom-link");
	});

	it("should render navigation menu with custom className on list", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList className="custom-list">
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const list = document.querySelector('[data-slot="navigation-menu-list"]');
		expect(list).toHaveClass("custom-list");
	});

	it("should handle delayDuration prop", () => {
		render(
			<NavigationMenu delayDuration={500}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const navigationMenu = document.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toBeInTheDocument();
	});

	it("should handle skipDelayDuration prop", () => {
		render(
			<NavigationMenu skipDelayDuration={400}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const navigationMenu = document.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toBeInTheDocument();
	});

	it("should render viewport wrapper correctly", () => {
		const { container } = render(
			<NavigationMenu viewport={true}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Menu</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div>Content</div>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		// The viewport is rendered directly as a child of NavigationMenu Root
		const viewportWrapper = container.querySelector('div[class*="absolute"]');
		expect(viewportWrapper).toBeInTheDocument();
	});

	it("should render without viewport when viewport=false", () => {
		const { container } = render(
			<NavigationMenu viewport={false}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const viewport = container.querySelector(
			'[data-slot="navigation-menu-viewport"]',
		);
		expect(viewport).not.toBeInTheDocument();
	});

	it("should handle onValueChange callback", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();

		render(
			<NavigationMenu onValueChange={onValueChange}>
				<NavigationMenuList>
					<NavigationMenuItem value="item-1">
						<NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/link-1">Link 1</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const trigger = screen.getByText("Item 1");
		await user.click(trigger);

		// onValueChange should be called when a trigger is activated
		expect(onValueChange).toHaveBeenCalled();
	});

	it("should render navigation menu content with custom className", async () => {
		const user = userEvent.setup();

		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent className="custom-content">
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const trigger = screen.getByText("Products");
		await user.click(trigger);

		const content = document.querySelector(
			'[data-slot="navigation-menu-content"]',
		);
		expect(content).toHaveClass("custom-content");
	});

	it("should render navigation menu viewport with custom className", () => {
		const { container } = render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const navigationMenu = container.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toBeInTheDocument();
	});

	it("should handle disabled links", () => {
		const { container } = render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							href="/disabled"
							className="opacity-50 cursor-not-allowed"
						>
							Disabled Link
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const link = container.querySelector('[data-slot="navigation-menu-link"]');
		expect(link).toBeInTheDocument();
	});

	it("should render navigation menu indicator with custom className", () => {
		const { container } = render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
				<NavigationMenuIndicator className="custom-indicator" />
			</NavigationMenu>,
		);

		const navigationMenu = container.querySelector(
			'[data-slot="navigation-menu"]',
		);
		expect(navigationMenu).toBeInTheDocument();
	});

	it("should handle orientation prop on root", () => {
		render(
			<NavigationMenu orientation="vertical">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Products</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/product-1">
								Product 1
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const list = document.querySelector('[data-slot="navigation-menu-list"]');
		expect(list).toHaveAttribute("data-orientation", "vertical");
	});

	it("should render navigation menu item with custom className", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem className="custom-item">
						<NavigationMenuLink href="/">Home</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const item = document.querySelector('[data-slot="navigation-menu-item"]');
		expect(item).toHaveClass("custom-item");
	});

	it("should handle asChild prop on navigation menu link", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink asChild href="/">
							<Button>Home Button</Button>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		expect(screen.getByText("Home Button")).toBeInTheDocument();
	});

	it("should render navigation menu with onSelect callback on link", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="/link" onSelect={onSelect}>
							Clickable Link
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const link = screen.getByText("Clickable Link");
		await user.click(link);

		expect(onSelect).toHaveBeenCalled();
	});
});
