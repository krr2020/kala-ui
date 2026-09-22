import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Navigation } from "./navigation";

const mockLinks = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
];

/**
 * Cross-package seam: Navigation's outside-close behavior is delegated to
 * @kala-ui/react-hooks' useClickOutside, resolved through the workspace
 * build — this pins that the hook's document-level mousedown contract
 * holds for a real react-app consumer.
 */
describe("react-app ↔ react-hooks click-outside seam", () => {
	const openMenu = () => {
		render(<Navigation links={mockLinks} pathname="/" />);
		const toggle = screen.getByLabelText("Toggle mobile navigation");
		fireEvent.click(toggle);
		return toggle;
	};

	it("closes the open mobile menu on mousedown outside", () => {
		const toggle = openMenu();
		expect(toggle).toHaveAttribute("aria-expanded", "true");

		fireEvent.mouseDown(document.body);
		expect(toggle).toHaveAttribute("aria-expanded", "false");
	});

	it("keeps the menu open on mousedown inside the navigation area", () => {
		const toggle = openMenu();

		fireEvent.mouseDown(toggle);
		expect(toggle).toHaveAttribute("aria-expanded", "true");
	});

	it("treats outside mousedown while already closed as a no-op", () => {
		render(<Navigation links={mockLinks} pathname="/" />);
		const toggle = screen.getByLabelText("Toggle mobile navigation");

		fireEvent.mouseDown(document.body);
		expect(toggle).toHaveAttribute("aria-expanded", "false");
	});
});
