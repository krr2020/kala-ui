import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Check, Loader2 } from "./icons";
import type { IconComponent } from "./icons.types";

describe("icons", () => {
	it("renders a glyph as inline svg with kala stroke defaults", () => {
		const { container } = render(<Check data-testid="glyph" />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
		expect(svg).toHaveAttribute("stroke", "currentColor");
		expect(svg).toHaveAttribute("stroke-width", "2");
	});

	it("size prop drives width/height; className is honored", () => {
		render(<Check size={18} className="my-class" data-testid="glyph" />);
		const svg = screen.getByTestId("glyph");
		expect(svg).toHaveAttribute("width", "18");
		expect(svg).toHaveAttribute("height", "18");
		expect(svg).toHaveClass("my-class");
	});

	it("glyphs are aria-hidden by default and overridable", () => {
		const { container, rerender } = render(<Check />);
		expect(container.querySelector("svg")).toHaveAttribute(
			"aria-hidden",
			"true",
		);
		rerender(<Check aria-hidden={false} aria-label="Done" />);
		expect(container.querySelector("svg")).toHaveAttribute(
			"aria-hidden",
			"false",
		);
	});

	it("satisfies the IconComponent contract", () => {
		const Glyph: IconComponent = Loader2;
		const { container } = render(<Glyph size="1rem" />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("glyph set has no lucide import in any non-test, non-story source file", () => {
		const iconsDir = join(
			dirname(fileURLToPath(import.meta.url)),
			"..",
			"..",
			"..",
			"src",
		);
		const offenders: string[] = [];
		const walk = (dir: string) => {
			for (const entry of readdirSync(dir, { withFileTypes: true })) {
				const p = join(dir, entry.name);
				if (entry.isDirectory()) {
					walk(p);
				} else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
					if (/\.(test|stories)\.(tsx?|jsx?)$/.test(entry.name)) return;
					const src = readFileSync(p, "utf8");
					if (/from\s+"lucide-react"/.test(src)) offenders.push(p);
				}
			}
		};
		walk(iconsDir);
		expect(offenders).toEqual([]);
	});
});
