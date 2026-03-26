import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./kbd";

describe("Kbd", () => {
	it("should render children", () => {
		render(<Kbd>Enter</Kbd>);
		expect(screen.getByText("Enter")).toBeInTheDocument();
	});

	it("should render with data-slot", () => {
		const { container } = render(<Kbd>K</Kbd>);
		expect(container.querySelector('[data-slot="kbd"]')).toBeInTheDocument();
	});

	it("should render key symbol for known keys", () => {
		render(<Kbd keys="cmd" />);
		expect(screen.getByText("⌘")).toBeInTheDocument();
	});

	it("should render raw key for unknown keys", () => {
		render(<Kbd keys="K" />);
		expect(screen.getByText("K")).toBeInTheDocument();
	});

	it("should render multiple keys as chord", () => {
		render(<Kbd keys={["cmd", "K"]} />);
		expect(screen.getByText("⌘")).toBeInTheDocument();
		expect(screen.getByText("K")).toBeInTheDocument();
	});

	it("should render shift symbol", () => {
		render(<Kbd keys="shift" />);
		expect(screen.getByText("⇧")).toBeInTheDocument();
	});

	it("should render enter symbol", () => {
		render(<Kbd keys="enter" />);
		expect(screen.getByText("↵")).toBeInTheDocument();
	});

	it("should render escape as Esc", () => {
		render(<Kbd keys="escape" />);
		expect(screen.getByText("Esc")).toBeInTheDocument();
	});

	it("should apply sm size class", () => {
		const { container } = render(<Kbd size="sm">K</Kbd>);
		expect(container.querySelector('[data-slot="kbd"]')).toHaveClass(
			"text-[10px]",
		);
	});

	it("should apply custom className", () => {
		const { container } = render(<Kbd className="custom-kbd">K</Kbd>);
		expect(container.querySelector('[data-slot="kbd"]')).toHaveClass(
			"custom-kbd",
		);
	});

	it("should render as <kbd> element", () => {
		const { container } = render(<Kbd>X</Kbd>);
		expect(container.querySelector("kbd")).toBeInTheDocument();
	});
});
