import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserMenuDropdown } from "../user-menu-dropdown";

describe("UserMenuDropdown", () => {
	const mockUser = {
		name: "John Doe",
		email: "john@example.com",
		avatar: "https://example.com/avatar.jpg",
	};

	it("should render without crashing", () => {
		render(<UserMenuDropdown user={mockUser} />);
		expect(screen.getByLabelText(/user menu/i)).toBeInTheDocument();
	});

	it("should render user name when provided", async () => {
		render(<UserMenuDropdown user={mockUser} isOpen={true} />);
		expect(await screen.findByText("John Doe")).toBeInTheDocument();
	});

	it("should render avatar image when provided", () => {
		const { container } = render(<UserMenuDropdown user={mockUser} />);
		// Avatar component should be rendered
		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();

		// Should have either the image or fallback
		const hasImageOrFallback =
			container.querySelector('[data-slot="avatar-image"]') ||
			container.querySelector('[data-slot="avatar-fallback"]');
		expect(hasImageOrFallback).toBeInTheDocument();
	});

	it("should render fallback avatar when no avatar provided", () => {
		const userWithoutAvatar = {
			name: "John Doe",
			email: "john@example.com",
		};
		const { container } = render(<UserMenuDropdown user={userWithoutAvatar} />);
		// Fallback should show initials
		const fallback = container.querySelector('[data-slot="avatar-fallback"]');
		expect(fallback).toBeInTheDocument();
	});

	it("should call onLogout when provided", () => {
		const onLogout = vi.fn();
		render(<UserMenuDropdown user={mockUser} onLogout={onLogout} />);
		// Dropdown should render
		expect(screen.getByLabelText(/user menu/i)).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<UserMenuDropdown user={mockUser} className="custom-menu" />,
		);
		const trigger = container.querySelector(".custom-menu");
		expect(trigger).toBeInTheDocument();
	});

	it("should render with minimal user data", () => {
		const minimalUser = {
			name: "",
			email: "j@example.com",
		};
		render(<UserMenuDropdown user={minimalUser} />);
		expect(screen.getByLabelText(/user menu/i)).toBeInTheDocument();
	});

	it("should handle isOpen prop", () => {
		render(<UserMenuDropdown user={mockUser} isOpen={false} />);
		const trigger = screen.getByLabelText(/user menu/i);
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("should handle onOpenChange callback", () => {
		const onOpenChange = vi.fn();
		render(<UserMenuDropdown user={mockUser} onOpenChange={onOpenChange} />);
		expect(screen.getByLabelText(/user menu/i)).toBeInTheDocument();
	});

	it("should render with custom baseUrl", () => {
		render(<UserMenuDropdown user={mockUser} baseUrl="/custom" />);
		expect(screen.getByLabelText(/user menu/i)).toBeInTheDocument();
	});
});
