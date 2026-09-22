import fs from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { DateRangePicker } from "../components/date-picker";
import { Dialog, DialogContent, DialogTitle } from "../components/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { Input } from "../components/input";
import { Paper } from "../components/paper";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "../components/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../components/tooltip";

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

	it("marks portal-rendered content on the element that actually renders", () => {
		// Radix Portal renders no DOM node of its own, so a marker on the Portal
		// wrapper never reaches the document — it must sit on the content element.
		render(
			<Dialog open>
				<DialogContent showCloseButton={false}>
					<DialogTitle>T</DialogTitle>
				</DialogContent>
			</Dialog>,
		);
		const dialog = document.body.querySelector('[role="dialog"]');
		expect(dialog?.getAttribute("data-kala-component")).toBe("dialog-content");

		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>Item</DropdownMenuContent>
			</DropdownMenu>,
		);
		const menu = document.body.querySelector('[role="menu"]');
		expect(menu?.getAttribute("data-kala-component")).toBe(
			"dropdown-menu-content",
		);

		render(
			<Select open>
				<SelectTrigger>Any</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);
		const listbox = document.body.querySelector('[role="listbox"]');
		expect(listbox?.getAttribute("data-kala-component")).toBe("select-content");

		render(
			<TooltipProvider>
				<Tooltip open>
					<TooltipTrigger>Hover</TooltipTrigger>
					<TooltipContent>Tip</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);
		const tip = document.body.querySelector('[role="tooltip"]');
		expect(tip?.getAttribute("data-kala-component")).toBe("tooltip-content");
	});

	it("marks DateRangePicker with its own name, not a prefixed stutter", () => {
		const { container } = render(<DateRangePicker />);
		expect(
			container.querySelector('[data-kala-component="date-range-picker"]'),
		).not.toBeNull();
		expect(container.innerHTML).not.toContain("date-picker-date-range-picker");
	});
});

const componentsRoot = ["src/components", "packages/react/src/components"]
	.map((p) => `${process.cwd()}/${p}`)
	.find((p) => fs.existsSync(p));
if (!componentsRoot)
	throw new Error("cannot locate packages/react/src/components from cwd");

const listFiles = (dir: string): string[] =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = `${dir}/${entry.name}`;
		return entry.isDirectory() ? listFiles(full) : [full];
	});

describe("data-kala-component source guard", () => {
	it("every component dir declares at least one marker", () => {
		const dirs = fs
			.readdirSync(componentsRoot, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);
		expect(dirs.length).toBeGreaterThan(0);
		const withoutMarkers = dirs.filter(
			(dir) =>
				!listFiles(`${componentsRoot}/${dir}`).some((f) => {
					const src = fs.readFileSync(f, "utf8");
					return (
						src.includes("data-kala-component") &&
						!/\.(test|stories)\.(ts|tsx)$/.test(f)
					);
				}),
		);
		expect(withoutMarkers).toEqual([]);
	});

	it("never places markers on Portal wrappers, which render no DOM", () => {
		const offenders = listFiles(componentsRoot).filter((f) => {
			if (!/\.tsx$/.test(f) || /\.(test|stories)\.tsx$/.test(f)) return false;
			return /<[\w.]*Portal[^>]*data-kala-component/.test(
				fs.readFileSync(f, "utf8"),
			);
		});
		expect(offenders).toEqual([]);
	});
});
