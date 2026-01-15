import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import {
	List,
	ListItem,
	ListItemAction,
	ListItemAvatar,
	ListItemBadge,
	ListItemContent,
	ListItemIcon,
	ListItemText,
	ListItemTitle,
} from "./list";

describe("List", () => {
	describe("List Container", () => {
		it("should render as a list with role", () => {
			const { container } = render(
				<List>
					<ListItem>
						<ListItemContent>
							<ListItemTitle>Item 1</ListItemTitle>
						</ListItemContent>
					</ListItem>
				</List>,
			);

			const list = container.querySelector("ul");
			expect(list).toBeInTheDocument();
			// ul has implicit list role
			expect(list?.tagName).toBe("UL");
		});

		it("should apply divided class by default", () => {
			const { container } = render(
				<List>
					<ListItem>Item</ListItem>
				</List>,
			);

			const list = container.querySelector("ul");
			expect(list?.className).toContain("[&>li:not(:last-child)]:border-b");
		});

		it("should not apply divided class when divided={false}", () => {
			const { container } = render(
				<List divided={false}>
					<ListItem>Item</ListItem>
				</List>,
			);

			const list = container.querySelector("ul");
			expect(list?.className).not.toContain("[&>li:not(:last-child)]:border-b");
		});

		it("should apply custom className", () => {
			const { container } = render(
				<List className="custom-class">
					<ListItem>Item</ListItem>
				</List>,
			);

			const list = container.querySelector("ul");
			expect(list).toHaveClass("custom-class");
		});
	});

	describe("ListItem", () => {
		it("should render as li by default", () => {
			const { container } = render(
				<List>
					<ListItem>Test Item</ListItem>
				</List>,
			);

			const item = container.querySelector("li");
			expect(item).toBeInTheDocument();
			expect(item).toHaveAttribute("role", "listitem");
		});

		it("should render as anchor when href is provided", () => {
			render(
				<List>
					<ListItem href="/test">Link Item</ListItem>
				</List>,
			);

			const link = screen.getByText("Link Item");
			expect(link.tagName).toBe("A");
			expect(link).toHaveAttribute("href", "/test");
		});

		it("should render as button when interactive without href", () => {
			render(
				<List>
					<ListItem interactive>Button Item</ListItem>
				</List>,
			);

			const button = screen.getByText("Button Item");
			expect(button.tagName).toBe("BUTTON");
			expect(button).toHaveAttribute("role", "button");
		});

		it("should have tabIndex when interactive and not disabled", () => {
			render(
				<List>
					<ListItem interactive>Interactive Item</ListItem>
				</List>,
			);

			const item = screen.getByText("Interactive Item");
			expect(item).toHaveAttribute("tabIndex", "0");
		});

		it("should not have tabIndex when disabled", () => {
			render(
				<List>
					<ListItem interactive disabled>
						Disabled Item
					</ListItem>
				</List>,
			);

			const item = screen.getByText("Disabled Item");
			expect(item).not.toHaveAttribute("tabIndex");
		});

		it("should have aria-disabled when disabled", () => {
			render(
				<List>
					<ListItem disabled>Disabled Item</ListItem>
				</List>,
			);

			const item = screen.getByText("Disabled Item");
			expect(item).toHaveAttribute("aria-disabled", "true");
		});

		it("should have aria-current when active", () => {
			render(
				<List>
					<ListItem active>Active Item</ListItem>
				</List>,
			);

			const item = screen.getByText("Active Item");
			expect(item).toHaveAttribute("aria-current", "page");
		});

		it("should apply dense spacing", () => {
			const { container } = render(
				<List>
					<ListItem dense>Dense Item</ListItem>
				</List>,
			);

			const item = container.querySelector("li");
			expect(item).toHaveClass("px-3", "py-2");
		});

		it("should render with custom as prop", () => {
			render(
				<List>
					<ListItem as="a" href="#">
						Custom Element
					</ListItem>
				</List>,
			);

			const item = screen.getByText("Custom Element");
			expect(item.tagName).toBe("A");
		});
	});

	describe("ListItemIcon", () => {
		it("should render icon with aria-hidden", () => {
			const { container } = render(
				<List>
					<ListItem>
						<ListItemIcon>
							<div className="i-lucide-home" />
						</ListItemIcon>
					</ListItem>
				</List>,
			);

			const icon = container.querySelector('[aria-hidden="true"]');
			expect(icon).toBeInTheDocument();
		});

		it("should apply size variants", () => {
			const { container, rerender } = render(
				<List>
					<ListItem>
						<ListItemIcon size="sm">Icon</ListItemIcon>
					</ListItem>
				</List>,
			);

			let icon = container.querySelector('[aria-hidden="true"]');
			expect(icon).toHaveClass("w-4", "h-4");

			rerender(
				<List>
					<ListItem>
						<ListItemIcon size="lg">Icon</ListItemIcon>
					</ListItem>
				</List>,
			);

			icon = container.querySelector('[aria-hidden="true"]');
			expect(icon).toHaveClass("w-6", "h-6");
		});
	});

	describe("ListItemAvatar", () => {
		it("should render image when src is provided", () => {
			render(
				<List>
					<ListItem>
						<ListItemAvatar
							src="https://example.com/avatar.jpg"
							alt="User avatar"
						/>
					</ListItem>
				</List>,
			);

			const img = screen.getByAltText("User avatar");
			expect(img).toBeInTheDocument();
			expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
		});

		it("should render fallback when no src provided", () => {
			render(
				<List>
					<ListItem>
						<ListItemAvatar fallback="JD" />
					</ListItem>
				</List>,
			);

			expect(screen.getByText("JD")).toBeInTheDocument();
		});

		it("should apply size variants", () => {
			const { container, rerender } = render(
				<List>
					<ListItem>
						<ListItemAvatar size="sm" fallback="A" />
					</ListItem>
				</List>,
			);

			let avatar = container.querySelector(".rounded-full");
			expect(avatar).toHaveClass("w-8", "h-8");

			rerender(
				<List>
					<ListItem>
						<ListItemAvatar size="lg" fallback="A" />
					</ListItem>
				</List>,
			);

			avatar = container.querySelector(".rounded-full");
			expect(avatar).toHaveClass("w-12", "h-12");
		});
	});

	describe("ListItemContent", () => {
		it("should render children", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>Content text</ListItemContent>
					</ListItem>
				</List>,
			);

			expect(screen.getByText("Content text")).toBeInTheDocument();
		});

		it("should apply truncate class when truncate is true", () => {
			const { container } = render(
				<List>
					<ListItem>
						<ListItemContent truncate>Content</ListItemContent>
					</ListItem>
				</List>,
			);

			const content = container.querySelector(".overflow-hidden");
			expect(content).toBeInTheDocument();
		});
	});

	describe("ListItemTitle", () => {
		it("should render as div by default", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>
							<ListItemTitle>Title</ListItemTitle>
						</ListItemContent>
					</ListItem>
				</List>,
			);

			const title = screen.getByText("Title");
			expect(title.tagName).toBe("DIV");
		});

		it("should render with semantic heading when as prop is provided", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>
							<ListItemTitle as="h3">Heading Title</ListItemTitle>
						</ListItemContent>
					</ListItem>
				</List>,
			);

			const title = screen.getByText("Heading Title");
			expect(title.tagName).toBe("H3");
		});

		it("should apply truncate class", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>
							<ListItemTitle truncate>Long Title</ListItemTitle>
						</ListItemContent>
					</ListItem>
				</List>,
			);

			const title = screen.getByText("Long Title");
			expect(title).toHaveClass("truncate");
		});
	});

	describe("ListItemText", () => {
		it("should render as paragraph", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>
							<ListItemText>Description text</ListItemText>
						</ListItemContent>
					</ListItem>
				</List>,
			);

			const text = screen.getByText("Description text");
			expect(text.tagName).toBe("P");
		});

		it("should apply truncate class", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>
							<ListItemText truncate>Long text</ListItemText>
						</ListItemContent>
					</ListItem>
				</List>,
			);

			const text = screen.getByText("Long text");
			expect(text).toHaveClass("truncate");
		});
	});

	describe("ListItemAction", () => {
		it("should render action container", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>Item</ListItemContent>
						<ListItemAction>
							<Button type="button">Action</Button>
						</ListItemAction>
					</ListItem>
				</List>,
			);

			const button = screen.getByRole("button", { name: "Action" });
			expect(button).toBeInTheDocument();
			expect(button.parentElement).toHaveClass("shrink-0");
		});
	});

	describe("ListItemBadge", () => {
		it("should render badge with content", () => {
			render(
				<List>
					<ListItem>
						<ListItemContent>Item</ListItemContent>
						<ListItemBadge>5</ListItemBadge>
					</ListItem>
				</List>,
			);

			expect(screen.getByText("5")).toBeInTheDocument();
		});

		it("should apply variant classes", () => {
			const { rerender } = render(
				<List>
					<ListItem>
						<ListItemBadge variant="primary">Badge</ListItemBadge>
					</ListItem>
				</List>,
			);

			let badge = screen.getByText("Badge");
			expect(badge).toHaveClass("bg-primary");

			rerender(
				<List>
					<ListItem>
						<ListItemBadge variant="danger">Badge</ListItemBadge>
					</ListItem>
				</List>,
			);

			badge = screen.getByText("Badge");
			expect(badge).toHaveClass("bg-destructive");
		});
	});

	describe("Accessibility", () => {
		it("should have proper ARIA attributes for interactive items", () => {
			render(
				<List>
					<ListItem interactive active>
						Active Item
					</ListItem>
					<ListItem interactive disabled>
						Disabled Item
					</ListItem>
				</List>,
			);

			const activeItem = screen.getByText("Active Item");
			expect(activeItem).toHaveAttribute("aria-current", "page");
			expect(activeItem).toHaveAttribute("tabIndex", "0");

			const disabledItem = screen.getByText("Disabled Item");
			expect(disabledItem).toHaveAttribute("aria-disabled", "true");
			expect(disabledItem).not.toHaveAttribute("tabIndex");
		});

		it('should have role="listitem" for non-interactive items', () => {
			const { container } = render(
				<List>
					<ListItem>Item</ListItem>
				</List>,
			);

			const item = container.querySelector("li");
			expect(item).toHaveAttribute("role", "listitem");
		});

		it('should have role="button" for interactive items', () => {
			render(
				<List>
					<ListItem interactive>Button Item</ListItem>
				</List>,
			);

			const item = screen.getByText("Button Item");
			expect(item).toHaveAttribute("role", "button");
		});

		it("should have proper alt text for avatars", () => {
			render(
				<List>
					<ListItem>
						<ListItemAvatar
							src="https://example.com/avatar.jpg"
							alt="User profile picture"
						/>
					</ListItem>
				</List>,
			);

			const img = screen.getByAltText("User profile picture");
			expect(img).toBeInTheDocument();
		});

		it("should hide decorative icons from screen readers", () => {
			const { container } = render(
				<List>
					<ListItem>
						<ListItemIcon>
							<div className="i-lucide-home" />
						</ListItemIcon>
						<ListItemContent>Home</ListItemContent>
					</ListItem>
				</List>,
			);

			const icon = container.querySelector('[aria-hidden="true"]');
			expect(icon).toBeInTheDocument();
		});
	});

	describe("Complex Compositions", () => {
		it("should render contacts list with all components", () => {
			render(
				<List>
					<ListItem>
						<ListItemAvatar fallback="JD" />
						<ListItemContent>
							<ListItemTitle>John Doe</ListItemTitle>
							<ListItemText>john@example.com</ListItemText>
						</ListItemContent>
						<ListItemAction>
							<Button type="button">Message</Button>
						</ListItemAction>
					</ListItem>
				</List>,
			);

			expect(screen.getByText("JD")).toBeInTheDocument();
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByText("john@example.com")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Message" }),
			).toBeInTheDocument();
		});

		it("should render list with icons and badges", () => {
			render(
				<List>
					<ListItem>
						<ListItemIcon>
							<div className="i-lucide-inbox" />
						</ListItemIcon>
						<ListItemContent>
							<ListItemTitle>Inbox</ListItemTitle>
						</ListItemContent>
						<ListItemBadge variant="primary">12</ListItemBadge>
					</ListItem>
				</List>,
			);

			expect(screen.getByText("Inbox")).toBeInTheDocument();
			expect(screen.getByText("12")).toBeInTheDocument();
		});
	});
});
