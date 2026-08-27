import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Paper } from "../components/paper";

/**
 * Every component renders a stable `data-kala-component="<kebab-name>"`
 * identification attribute on its root element. This is a public, guaranteed
 * API used for DevTools debugging and e2e
 * selectors — see the package README ("Identifying components in the DOM").
 */
describe("data-kala-component markers", () => {
	it("marks simple component roots", () => {
		render(<Button>Save</Button>);
		expect(screen.getByRole("button")).toHaveAttribute(
			"data-kala-component",
			"button",
		);
	});

	it("marks composed roots with the most specific component", () => {
		render(<Card>Content</Card>);
		const el = screen.getByText("Content").closest("[data-kala-component]");
		expect(el).toHaveAttribute("data-kala-component", "card");
	});

	it("keeps markers on variant/early-return render paths", () => {
		const { container } = render(<Input placeholder="Search" />);
		expect(
			container.querySelector("[data-kala-component='input']"),
		).not.toBeNull();
	});

	it("marks layout primitives", () => {
		const { container } = render(<Paper>Sheet</Paper>);
		expect(
			container.querySelector("[data-kala-component='paper']"),
		).not.toBeNull();
	});
});
