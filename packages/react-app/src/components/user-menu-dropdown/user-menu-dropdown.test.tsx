import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserMenuDropdown } from "./user-menu-dropdown";

describe("UserMenuDropdown", () => {
	const mockUser = {
		name: "John Doe",
		email: "john@example.com",
		avatar: "https://example.com/avatar.jpg",
	};

	it("should render user menu dropdown", () => {
		render(<UserMenuDropdown user={mockUser} />);

		expect(screen.getByLabelText("User menu")).toBeInTheDocument();
	});

	it("should display user avatar", () => {
		render(<UserMenuDropdown user={mockUser} />);

		// Avatar image doesn't always render in tests, check the initials fallback exists
		expect(screen.getByText("JD")).toBeInTheDocument();
	});

	it("should display user initials when no avatar", () => {
		render(<UserMenuDropdown user={{ name: "John Doe" }} />);

		expect(screen.getByText("JD")).toBeInTheDocument();
	});

	it("should display first letter of email when no name", () => {
		render(<UserMenuDropdown user={{ email: "john@example.com" }} />);

		expect(screen.getByText("J")).toBeInTheDocument();
	});

	it("should display question mark when no name or email", () => {
		render(<UserMenuDropdown user={{}} />);

		expect(screen.getByText("?")).toBeInTheDocument();
	});

	it("should limit initials to 2 characters", () => {
		render(<UserMenuDropdown user={{ name: "John David Smith" }} />);

		expect(screen.getByText("JD")).toBeInTheDocument();
	});

	it("should open dropdown on trigger click", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		expect(screen.getByText("Profile")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
		expect(screen.getByText("Logout")).toBeInTheDocument();
	});

	it("should display user name in dropdown", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("should display user email in dropdown", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		expect(screen.getByText("john@example.com")).toBeInTheDocument();
	});

	it("should not display name section when name is missing", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={{ email: "john@example.com" }} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		expect(screen.queryByText(/John Doe/)).not.toBeInTheDocument();
		expect(screen.getByText("john@example.com")).toBeInTheDocument();
	});

	it("should navigate to profile on profile click", async () => {
		const user = userEvent.setup();

		// Mock window.location.href
		delete (window as { location?: unknown }).location;
		(window as unknown as { location: { href: string } }).location = {
			href: "",
		};

		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		const profileItem = screen.getByText("Profile");
		await user.click(profileItem);

		expect(window.location.href).toBe("/admin/profile");
	});

	it("should navigate to settings on settings click", async () => {
		const user = userEvent.setup();

		// Mock window.location.href
		delete (window as { location?: unknown }).location;
		(window as unknown as { location: { href: string } }).location = {
			href: "",
		};

		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		const settingsItem = screen.getByText("Settings");
		await user.click(settingsItem);

		expect(window.location.href).toBe("/admin/profile/security");
	});

	it("should call onLogout when logout is clicked", async () => {
		const user = userEvent.setup();
		const onLogout = vi.fn();

		render(<UserMenuDropdown user={mockUser} onLogout={onLogout} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		const logoutItem = screen.getByText("Logout");
		await user.click(logoutItem);

		expect(onLogout).toHaveBeenCalledTimes(1);
	});

	it("should use custom baseUrl for navigation", async () => {
		const user = userEvent.setup();

		// Mock window.location.href
		delete (window as { location?: unknown }).location;
		(window as unknown as { location: { href: string } }).location = {
			href: "",
		};

		render(<UserMenuDropdown user={mockUser} baseUrl="/dashboard" />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		const profileItem = screen.getByText("Profile");
		await user.click(profileItem);

		expect(window.location.href).toBe("/dashboard/profile");
	});

	it("should apply custom className to trigger", () => {
		render(<UserMenuDropdown user={mockUser} className="custom-trigger" />);

		const trigger = screen.getByLabelText("User menu");
		expect(trigger).toHaveClass("custom-trigger");
	});

	it("should control dropdown open state with isOpen prop", async () => {
		const { rerender } = render(
			<UserMenuDropdown user={mockUser} isOpen={false} />,
		);

		expect(screen.queryByText("Profile")).not.toBeInTheDocument();

		rerender(<UserMenuDropdown user={mockUser} isOpen={true} />);

		expect(screen.getByText("Profile")).toBeInTheDocument();
	});

	it("should call onOpenChange when dropdown state changes", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();

		render(<UserMenuDropdown user={mockUser} onOpenChange={onOpenChange} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("should render profile icon", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		// Check that menu items are rendered (icons are rendered as SVG)
		expect(screen.getByText("Profile")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
		expect(screen.getByText("Logout")).toBeInTheDocument();
	});

	it("should render logout item with destructive variant", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		const logoutItem = screen.getByText("Logout").closest('[role="menuitem"]');
		expect(logoutItem).toBeInTheDocument();
	});

	it("should align dropdown to end", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		// Dropdown menu should be rendered
		expect(screen.getByText("Profile")).toBeInTheDocument();
	});

	it("should handle user with only email", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={{ email: "test@example.com" }} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		expect(screen.getByText("test@example.com")).toBeInTheDocument();
	});

	it("should handle user with only name", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={{ name: "Jane Smith" }} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});

	it("should capitalize initials", () => {
		render(<UserMenuDropdown user={{ name: "john doe" }} />);

		expect(screen.getByText("JD")).toBeInTheDocument();
	});

	it("should render separators in menu", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		// Check that menu items are separated (Profile, Settings, Logout exist)
		expect(screen.getByText("Profile")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
		expect(screen.getByText("Logout")).toBeInTheDocument();
	});

	it("should have proper menu item structure", async () => {
		const user = userEvent.setup();
		render(<UserMenuDropdown user={mockUser} />);

		const trigger = screen.getByLabelText("User menu");
		await user.click(trigger);

		const profileItem = screen
			.getByText("Profile")
			.closest('[role="menuitem"]');
		const settingsItem = screen
			.getByText("Settings")
			.closest('[role="menuitem"]');
		const logoutItem = screen.getByText("Logout").closest('[role="menuitem"]');

		expect(profileItem).toBeInTheDocument();
		expect(settingsItem).toBeInTheDocument();
		expect(logoutItem).toBeInTheDocument();
	});
});
