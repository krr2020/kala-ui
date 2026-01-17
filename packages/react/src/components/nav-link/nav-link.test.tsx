import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavLink } from "./nav-link";

describe("NavLink", () => {
	it("renders label and icon", () => {
		render(<NavLink label="Test Link" icon={<span data-testid="icon" />} />);
		expect(screen.getByText("Test Link")).toBeInTheDocument();
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("renders description when provided", () => {
		render(<NavLink label="Link" description="Description text" />);
		expect(screen.getByText("Description text")).toBeInTheDocument();
	});

	it("handles click events", () => {
		const handleClick = vi.fn();
		render(<NavLink label="Click me" onClick={handleClick} />);
		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalled();
	});

	it("toggles children visibility on click", () => {
		render(
			<NavLink label="Parent">
				<NavLink label="Child" />
			</NavLink>,
		);

		// Initially closed
		expect(screen.queryByText("Child")).not.toBeInTheDocument();

		// Click to open
		fireEvent.click(screen.getByText("Parent"));
		expect(screen.getByText("Child")).toBeInTheDocument();

		// Click to close
		fireEvent.click(screen.getByText("Parent"));
		expect(screen.queryByText("Child")).not.toBeInTheDocument();
	});

	it("renders active state correctly", () => {
		render(<NavLink label="Active Link" active />);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-accent");
	});
});
