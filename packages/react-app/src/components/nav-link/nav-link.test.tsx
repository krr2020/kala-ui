import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavLink } from "./nav-link";

describe("NavLink anchor mode", () => {
	it("renders an <a> with the href intact when href is provided", () => {
		render(<NavLink href="/board" label="Board" />);
		const link = screen.getByRole("link", { name: "Board" });
		expect(link.tagName).toBe("A");
		expect(link).toHaveAttribute("href", "/board");
		expect(link).toHaveAttribute("data-kala-component", "nav-link");
	});

	it("keeps button semantics when no href is provided", () => {
		render(<NavLink label="Toggle" />);
		expect(screen.getByRole("button", { name: "Toggle" }).tagName).toBe(
			"BUTTON",
		);
	});

	it("sets aria-current=page when active with href, nothing when inactive", () => {
		const { rerender } = render(<NavLink href="/board" label="Board" active />);
		expect(screen.getByRole("link", { name: "Board" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		rerender(<NavLink href="/board" label="Board" active={false} />);
		expect(screen.getByRole("link", { name: "Board" })).not.toHaveAttribute(
			"aria-current",
		);
	});

	it("never spreads button-only props onto the anchor", () => {
		render(<NavLink href="/board" label="Board" type="button" disabled />);
		const link = screen.getByRole("link", { name: "Board" });
		expect(link.getAttribute("type")).toBeNull();
		expect(link.hasAttribute("disabled")).toBe(false);
		// Disabled look on anchors is expressed via aria-disabled, never the
		// invalid boolean attribute.
		expect(link.hasAttribute("aria-disabled")).toBe(true);
	});

	it("preventDefaults plain left-clicks so the app routes client-side, and fires onClick", () => {
		const onClick = vi.fn();
		render(<NavLink href="/board" label="Board" onClick={onClick} />);
		const link = screen.getByRole("link", { name: "Board" });
		const e = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			button: 0,
		});
		const preventDefault = vi.spyOn(e, "preventDefault");
		link.dispatchEvent(e);
		expect(preventDefault).toHaveBeenCalled();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("leaves modifier clicks to the browser (no preventDefault)", () => {
		const onClick = vi.fn();
		render(<NavLink href="/board" label="Board" onClick={onClick} />);
		const link = screen.getByRole("link", { name: "Board" });
		for (const modifier of [
			{ metaKey: true },
			{ ctrlKey: true },
			{ shiftKey: true },
			{ altKey: true },
		]) {
			const e = new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				button: 0,
				...modifier,
			});
			const spy = vi.spyOn(e, "preventDefault");
			link.dispatchEvent(e);
			expect(spy).not.toHaveBeenCalled();
		}
		expect(onClick).toHaveBeenCalledTimes(4);
	});

	it("leaves middle-clicks to the browser", () => {
		render(<NavLink href="/board" label="Board" />);
		const link = screen.getByRole("link", { name: "Board" });
		const e = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			button: 1,
		});
		const spy = vi.spyOn(e, "preventDefault");
		link.dispatchEvent(e);
		expect(spy).not.toHaveBeenCalled();
	});
});

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

	it("respects controlled opened prop for rendering children", () => {
		const { rerender } = render(
			<NavLink label="Parent" open={false} onOpenChange={vi.fn()}>
				<div>Child</div>
			</NavLink>,
		);
		expect(screen.queryByText("Child")).not.toBeInTheDocument();

		rerender(
			<NavLink label="Parent" open={true} onOpenChange={vi.fn()}>
				<div>Child</div>
			</NavLink>,
		);
		expect(screen.getByText("Child")).toBeInTheDocument();
	});

	it("rotates the chevron when controlled opened is true", () => {
		render(
			<NavLink label="Parent" open={true} onOpenChange={vi.fn()}>
				<div>Child</div>
			</NavLink>,
		);
		const chevronWrapper = screen.getByText("Parent").parentElement
			?.nextElementSibling as HTMLElement;
		expect(chevronWrapper).toHaveClass("rotate-90");
	});

	it("calls onOpenChange with next value on click in controlled mode", () => {
		const onOpenChange = vi.fn();
		render(
			<NavLink label="Parent" open={false} onOpenChange={onOpenChange}>
				<div>Child</div>
			</NavLink>,
		);
		fireEvent.click(screen.getByText("Parent"));
		expect(onOpenChange).toHaveBeenCalledWith(true);
		// Controlled: stays closed until the parent flips the prop.
		expect(screen.queryByText("Child")).not.toBeInTheDocument();
	});
});
