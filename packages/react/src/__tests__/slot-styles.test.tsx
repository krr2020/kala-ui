/**
 * Web slotStyles contract: every component accepts `slotStyles={{ root,
 * <part> }}`. Strings merge as Tailwind classes (slot last, so slots win on
 * conflict), objects merge as inline style (slot keys win). Precedence is
 * uniform: library defaults → legacy className/style → slotStyles.<part>.
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../components/dialog";
import { Input } from "../components/input";
import { Tag } from "../components/tag";
import {
	DatePicker,
	DateRangePicker,
} from "../components/date-picker";
import { FileUpload } from "../components/file-upload";
import { NumberInput } from "../components/number-input";
import { TagInput } from "../components/tag-input";
import { TimePicker } from "../components/time-picker";
import { NativeSelect, Select, SelectContent, SelectItem, SelectTrigger } from "../components/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/tooltip";
import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from "../components/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../components/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Banner } from "../components/banner";
import { MultiSelect } from "../components/multi-select";
import { AvatarGroup } from "../components/avatar-group";
import { Progress } from "../components/progress";
import { EmptyState } from "../components/empty-state";
import { RingProgress } from "../components/ring-progress";
import { buildToastClassNames } from "../components/toast/toast";
import { Toast } from "../components/toast";
import { toastStyles } from "../config/toast";
import { ErrorBoundary } from "../components/error-boundary";
import { applySlot, mergeStyle } from "../lib/slot-styles";

// Passthrough double scoped to the Toaster component only: sonner's real
// Toaster renders a classless section in jsdom (see the rollout suite's toast
// delegation), hiding the root channel — every other sonner export stays real.
vi.mock("sonner", async (importOriginal) => {
	const actual = await importOriginal<typeof import("sonner")>();
	return {
		...actual,
		Toaster: (props: { className?: string }) => (
			<div data-testid="sonner-toaster" className={props.className} />
		),
	};
});

describe("applySlot / mergeStyle units", () => {
	it("undefined and null slot keep the base untouched with no style", () => {
		expect(applySlot("p-2 m-4", undefined)).toEqual({
			className: "p-2 m-4",
		});
		expect(applySlot("p-2", null)).toEqual({ className: "p-2" });
	});

	it("string slot is appended after the base and wins on conflict", () => {
		const { className, style } = applySlot("p-2 text-sm", "p-6");
		expect(className).toBe("text-sm p-6");
		expect(style).toBeUndefined();
	});

	it("object slot becomes inline style, classes untouched", () => {
		const { className, style } = applySlot("p-2", { marginTop: 4 });
		expect(className).toBe("p-2");
		expect(style).toEqual({ marginTop: 4 });
	});

	it("mergeStyle: slot wins per key, disjoint keys merge, empty stays empty", () => {
		expect(mergeStyle({ marginTop: 1 }, { marginTop: 2, marginLeft: 3 })).toEqual(
			{ marginTop: 2, marginLeft: 3 },
		);
		expect(mergeStyle(undefined, undefined)).toBeUndefined();
		expect(mergeStyle({ marginTop: 1 }, undefined)).toEqual({ marginTop: 1 });
	});

	it("mixed channels coexist: slot string + user style object, slot object + user className", () => {
		const root = applySlot("p-2", "p-6");
		const style = mergeStyle({ color: "red" }, root.style);
		expect(root.className).toBe("p-6");
		expect(style).toEqual({ color: "red" });

		const obj = applySlot("p-2", { color: "blue" });
		expect(obj.className).toBe("p-2");
		expect(mergeStyle({ color: "red" }, obj.style)).toEqual({ color: "blue" });
	});
});

describe("Button slotStyles", () => {
	it("root slot beats legacy className on a conflicting utility", () => {
		render(
			<Button className="p-2" slotStyles={{ root: "p-6" }}>
				Go
			</Button>,
		);
		const btn = screen.getByRole("button");
		expect(btn).toHaveClass("p-6");
		expect(btn).not.toHaveClass("p-2");
	});

	it("object root slot lands as inline style above the spread style prop", () => {
		render(
			<Button style={{ marginTop: 1 }} slotStyles={{ root: { marginTop: 9 } }}>
				Go
			</Button>,
		);
		expect(screen.getByRole("button").style.marginTop).toBe("9px");
	});

	it("spinner slot reaches the loading icon", () => {
		render(
			<Button isLoading slotStyles={{ spinner: "my-spin" }}>
				Go
			</Button>,
		);
		const svg = screen.getByRole("button").querySelector("svg");
		expect(svg).toHaveClass("my-spin");
	});

	it("absent slotStyles renders the exact pre-change class string", () => {
		render(<Button>Go</Button>);
		expect(screen.getByRole("button").className).toBe(
			"cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--kala-radius-control)] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed kala-focus-ring kala-touch h-[var(--kala-control-h)] px-[var(--kala-control-px)] py-2 bg-primary text-primary-foreground hover:bg-primary/90",
		);
	});
});

describe("Alert slotStyles", () => {
	it("icon and dismiss slots reach their nodes", () => {
		render(
			<Alert dismissible slotStyles={{ icon: "my-icon", dismiss: "my-dismiss" }}>
				x
			</Alert>,
		);
		const root = screen.getByRole("alert");
		expect(root.querySelector("svg")).toHaveClass("my-icon");
		expect(screen.getByLabelText("Dismiss alert")).toHaveClass("my-dismiss");
	});

	it("root slot beats legacy className", () => {
		render(
			<Alert className="p-2" slotStyles={{ root: "p-6" }}>
				x
			</Alert>,
		);
		expect(screen.getByRole("alert")).toHaveClass("p-6");
		expect(screen.getByRole("alert")).not.toHaveClass("p-2");
	});

	it("skeleton arm keeps slotStyles.root", () => {
		const { container } = render(
			<Alert isLoading slotStyles={{ root: "my-w-64" }}>
				x
			</Alert>,
		);
		expect(
			container.querySelector('[data-kala-component="alert-skeleton"]'),
		).toHaveClass("my-w-64");
	});

	it("absent slotStyles renders the exact pre-change class string", () => {
		const { container } = render(
			<Alert variant="subtle" color="primary">
				x
			</Alert>,
		);
		expect(
			container.querySelector('[data-kala-component="alert"]')?.className,
		).toBe(
			"relative w-full rounded-[var(--kala-radius-card)] px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 border bg-primary/10 border-primary/20 text-primary [&>svg]:text-primary",
		);
	});
});

describe("Badge slotStyles", () => {
	it("root slot beats legacy className on the loaded arm", () => {
		render(
			<span data-testid="holder">
				<Badge className="w-10" slotStyles={{ root: "w-64" }}>
					x
				</Badge>
			</span>,
		);
		const badge = screen
			.getByTestId("holder")
			.querySelector('[data-slot="badge"]');
		expect(badge).toHaveClass("w-64");
		expect(badge).not.toHaveClass("w-10");
	});

	it("skeleton arm keeps slotStyles.root", () => {
		const { container } = render(
			<Badge isLoading slotStyles={{ root: "my-w-64" }}>
				x
			</Badge>,
		);
		expect(container.querySelector('[data-kala-component="badge"]')).toHaveClass(
			"my-w-64",
		);
	});
});

describe("Tag slotStyles", () => {
	it("icon wrapper and remove button slots reach their nodes", () => {
		render(
			<Tag
				icon={<span data-testid="tag-icon" />}
				onRemove={() => {}}
				slotStyles={{ icon: "my-ico", remove: "my-rm" }}
			>
				x
			</Tag>,
		);
		expect(screen.getByTestId("tag-icon").parentElement).toHaveClass("my-ico");
		expect(screen.getByLabelText("Remove")).toHaveClass("my-rm");
	});

	it("root slot beats legacy className", () => {
		const { container } = render(
			<Tag className="w-10" slotStyles={{ root: "w-64" }}>
				x
			</Tag>,
		);
		const tag = container.querySelector('[data-slot="tag"]');
		expect(tag).toHaveClass("w-64");
		expect(tag).not.toHaveClass("w-10");
	});

	it("absent slotStyles renders the exact pre-change class string", () => {
		render(<Tag>x</Tag>);
		expect(screen.getByText("x").className).toBe(
			"inline-flex items-center gap-1 font-medium transition-colors select-none rounded-full text-sm px-2.5 py-1 [&_svg]:size-3.5 bg-muted text-muted-foreground",
		);
	});

	it("variant arm composes base, size and compound in cva order", () => {
		render(
			<Tag variant="solid" color="primary" size="sm">
				x
			</Tag>,
		);
		expect(screen.getByText("x").className).toBe(
			"inline-flex items-center gap-1 font-medium transition-colors select-none rounded-full text-xs px-2 py-0.5 [&_svg]:size-3 bg-primary text-primary-foreground",
		);
	});
});

describe("Banner slotStyles", () => {
	it("absent slotStyles renders the exact pre-change class string", () => {
		render(<Banner>x</Banner>);
		expect(screen.getByRole("status").className).toBe(
			"w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4 fixed top-0 left-0 right-0 shadow-md bg-info text-info-foreground",
		);
	});

	it("color and position arms compose from the table", () => {
		render(
			<Banner color="destructive" position="static">
				x
			</Banner>,
		);
		expect(screen.getByRole("status").className).toBe(
			"w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4 relative bg-destructive text-destructive-foreground",
		);
	});
});

describe("Input slotStyles", () => {
	it("root slot beats legacy className", () => {
		render(<Input className="p-2" slotStyles={{ root: "p-6" }} />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("p-6");
		expect(input).not.toHaveClass("p-2");
	});

	it("skeleton arm keeps slotStyles.root", () => {
		const { container } = render(
			<Input isLoading slotStyles={{ root: "my-w-64" }} />,
		);
		expect(container.querySelector('[data-kala-component="input"]')).toHaveClass(
			"my-w-64",
		);
	});

	it("absent slotStyles renders the exact pre-change class string", () => {
		render(<Input />);
		expect(screen.getByRole("textbox").className).toBe(
			"cursor-text flex h-[var(--kala-control-h)] w-full rounded-[var(--kala-radius-input,var(--kala-radius-control))] border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 kala-focus-ring kala-surface-input file:mr-3 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-accent",
		);
	});
});

describe("Card slotStyles", () => {
	it("card root and compound part roots accept slotStyles", () => {
		const { container } = render(
			<Card className="w-10" slotStyles={{ root: "w-64" }}>
				<CardHeader slotStyles={{ root: "my-hd" }}>
					<CardTitle slotStyles={{ root: "my-ti" }}>T</CardTitle>
					<CardDescription slotStyles={{ root: "my-de" }}>D</CardDescription>
				</CardHeader>
				<CardContent slotStyles={{ root: "my-ct" }}>C</CardContent>
				<CardFooter slotStyles={{ root: "my-ft" }}>F</CardFooter>
			</Card>,
		);
		const q = (name: string) =>
			container.querySelector(`[data-kala-component="${name}"]`);
		expect(q("card")).toHaveClass("w-64");
		expect(q("card")).not.toHaveClass("w-10");
		expect(q("card-header")).toHaveClass("my-hd");
		expect(q("card-title")).toHaveClass("my-ti");
		expect(q("card-description")).toHaveClass("my-de");
		expect(q("card-content")).toHaveClass("my-ct");
		expect(q("card-footer")).toHaveClass("my-ft");
	});
});

describe("Dialog slotStyles", () => {
	it("content root slot beats legacy className, close and closeIcon slots reach their nodes", () => {
		render(
			<Dialog open>
				<DialogContent
					className="p-2"
					slotStyles={{
						root: "p-6",
						close: "my-close",
						closeIcon: "my-x",
						overlay: "my-ov",
					}}
				>
					x
				</DialogContent>
			</Dialog>,
		);
		const content = document.body.querySelector('[data-slot="dialog-content"]');
		expect(content).toHaveClass("p-6");
		expect(content).not.toHaveClass("p-2");
		expect(document.body.querySelector('[data-slot="dialog-close"]')).toHaveClass(
			"my-close",
		);
		expect(
			document.body.querySelector('[data-slot="dialog-close"]')?.querySelector("svg"),
		).toHaveClass("my-x");
		expect(
			document.body.querySelector('[data-slot="dialog-overlay"]'),
		).toHaveClass("my-ov");
	});

	it("header, body, title, description, footer each take their own root slot", () => {
		render(
			<Dialog open>
				<DialogContent showCloseButton={false}>
					<DialogHeader slotStyles={{ root: "my-hd" }}>
						<DialogTitle slotStyles={{ root: "my-ti" }}>T</DialogTitle>
						<DialogDescription slotStyles={{ root: "my-de" }}>
							D
						</DialogDescription>
					</DialogHeader>
					<DialogBody slotStyles={{ root: "my-bd" }}>B</DialogBody>
					<DialogFooter slotStyles={{ root: "my-ft" }}>F</DialogFooter>
				</DialogContent>
			</Dialog>,
		);
		const q = (slot: string) =>
			document.body.querySelector(`[data-slot="dialog-${slot}"]`);
		expect(q("header")).toHaveClass("my-hd");
		expect(q("title")).toHaveClass("my-ti");
		expect(q("description")).toHaveClass("my-de");
		expect(q("body")).toHaveClass("my-bd");
		expect(q("footer")).toHaveClass("my-ft");
	});
});

describe("NumberInput slotStyles", () => {
	it("increment, decrement and divider slots reach the stepper chrome", () => {
		render(
			<NumberInput
				slotStyles={{
					increment: "my-inc",
					decrement: "my-dec",
					divider: "border-red-500",
				}}
			/>,
		);
		expect(screen.getByLabelText("Increase value")).toHaveClass("my-inc");
		expect(screen.getByLabelText("Decrease value")).toHaveClass("my-dec");
		expect(screen.getByLabelText("Increase value")).toHaveClass(
			"border-red-500",
		);
		expect(screen.getByLabelText("Decrease value")).toHaveClass(
			"border-red-500",
		);
	});

	it("root slot beats legacy className and survives the skeleton arm", () => {
		const { container, rerender } = render(
			<NumberInput className="w-10" slotStyles={{ root: "w-64" }} />,
		);
		const root = container.querySelector('[data-slot="number-input"]');
		expect(root).toHaveClass("w-64");
		expect(root).not.toHaveClass("w-10");
		rerender(<NumberInput isLoading slotStyles={{ root: "w-64" }} />);
		expect(
			container.querySelector('[data-kala-component="number-input"]'),
		).toHaveClass("w-64");
	});
});

describe("TagInput slotStyles", () => {
	it("tag, remove and clear slots reach their nodes", () => {
		render(
			<TagInput
				defaultValue={["a", "b"]}
				slotStyles={{ tag: "my-tag", remove: "my-rm", clear: "my-cl" }}
			/>,
		);
		const tags = document.body.querySelectorAll('[data-slot="badge"]');
		expect(tags.length).toBe(2);
		expect(tags[0]).toHaveClass("my-tag");
		expect(screen.getByLabelText("Remove a")).toHaveClass("my-rm");
		expect(screen.getByLabelText("Clear all tags")).toHaveClass("my-cl");
	});

	it("root slot beats legacy className on the chip container", () => {
		const { container } = render(
			<TagInput className="w-10" slotStyles={{ root: "w-64" }} />,
		);
		const chip = container.querySelector(".kala-surface-input");
		expect(chip).toHaveClass("w-64");
		expect(chip).not.toHaveClass("w-10");
	});
});

describe("TimePicker slotStyles", () => {
	it("hour, minute, second and colon slots reach their columns", () => {
		const { container } = render(
			<TimePicker showSeconds slotStyles={{
				hour: "my-h",
				minute: "my-m",
				second: "my-s",
				colon: "my-c",
			}} />,
		);
		const cols = container.querySelectorAll(
			'[data-kala-component="time-picker-time-column"]',
		);
		expect(cols.length).toBe(3);
		expect(cols[0]).toHaveClass("my-h");
		expect(cols[1]).toHaveClass("my-m");
		expect(cols[2]).toHaveClass("my-s");
		const colons = container.querySelectorAll('[data-slot="time-picker-colon"]');
		expect(colons.length).toBe(2);
		expect(colons[0]).toHaveClass("my-c");
	});

	it("root slot beats legacy className and survives the skeleton arm", () => {
		const { container, rerender } = render(
			<TimePicker className="w-10" slotStyles={{ root: "w-64" }} />,
		);
		expect(container.querySelector('[data-slot="time-picker"]')).toHaveClass(
			"w-64",
		);
		rerender(<TimePicker isLoading slotStyles={{ root: "w-64" }} />);
		expect(
			container.querySelector('[data-kala-component="time-picker"]'),
		).toHaveClass("w-64");
	});
});

describe("DatePicker slotStyles", () => {
	it("icon slot reaches the calendar glyph; root beats buttonClassName", () => {
		const { container } = render(
			<DatePicker buttonClassName="w-10" slotStyles={{ root: "w-64", icon: "my-ic" }} />,
		);
		const button = container.querySelector("button");
		expect(button).toHaveClass("w-64");
		expect(button).not.toHaveClass("w-10");
		expect(button?.querySelector("svg")).toHaveClass("my-ic");
	});

	it("loading arms keep slotStyles.root on both pickers", () => {
		const { container, rerender } = render(
			<DatePicker isLoading slotStyles={{ root: "w-64" }} />,
		);
		expect(
			container.querySelector('[data-kala-component="date-picker"]'),
		).toHaveClass("w-64");
		rerender(
			<DateRangePicker isLoading slotStyles={{ root: "w-64" }} />,
		);
		expect(
			container.querySelector(
				'[data-kala-component="date-range-picker"]',
			),
		).toHaveClass("w-64");
	});
});

describe("RingProgress slotStyles", () => {
	it("string root slot beats legacy className and keeps base classes", () => {
		const { container } = render(
			<RingProgress
				value={50}
				className="w-10"
				slotStyles={{ root: "k-slot-root w-64" }}
			/>,
		);
		const el = container.querySelector('[data-kala-component="ring-progress"]');
		expect(el?.className).toContain("k-slot-root");
		expect(el?.className).toContain("w-64");
		expect(el?.className).not.toContain("w-10");
		expect(el?.className).toContain("relative");
	});

	it("object root slot wins per key over the style prop and keeps the size style", () => {
		const { container } = render(
			<RingProgress
				value={50}
				style={{ marginTop: "1px" }}
				slotStyles={{ root: { marginTop: "9px", maxWidth: "42px" } }}
			/>,
		);
		const el = container.querySelector<HTMLDivElement>(
				'[data-kala-component="ring-progress"]',
		);
		expect(el?.style.marginTop).toBe("9px");
		expect(el?.style.maxWidth).toBe("42px");
		expect(el?.style.width).toBe("120px");
	});

	it("label slot reaches the centered label wrapper", () => {
		const { container } = render(
			<RingProgress value={50} label="half" slotStyles={{ label: "my-lbl" }} />,
		);
		const wrapper = container.querySelector(
			'[data-kala-component="ring-progress"] > div',
		);
		expect(wrapper).toHaveClass("my-lbl");
		expect(wrapper?.className).toContain("absolute");
	});

	it("never leaks slotStyles to the DOM", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const { container } = render(
			<RingProgress value={50} label="x" slotStyles={{ root: "p-1", label: "p-2" }} />,
		);
		expect(container.innerHTML).not.toContain("slotStyles");
		const leaked = errorSpy.mock.calls.filter((c) =>
			String(c[0]).includes("slotStyles"),
		);
		expect(leaked).toEqual([]);
		errorSpy.mockRestore();
	});

	it("absent slotStyles renders the pre-change root class string", () => {
		const { container } = render(<RingProgress value={50} />);
		expect(
			container.querySelector('[data-kala-component="ring-progress"]')?.className,
		).toBe("relative flex items-center justify-center");
	});
});

describe("FileUpload slotStyles", () => {
	it("icon slot reaches the dropzone icon circle; root beats legacy className", () => {
		const { container } = render(
			<FileUpload className="w-10" slotStyles={{ root: "w-64", icon: "my-ic" }} />,
		);
		const root = container.querySelector('[data-kala-component="file-upload"]');
		expect(root).toHaveClass("w-64");
		expect(root).not.toHaveClass("w-10");
		expect(container.querySelector("svg")?.parentElement).toHaveClass("my-ic");
	});
});

describe("TimePicker structure", () => {
	it("renders columns in HH : MM order with one separator and no seconds column by default", () => {
		const { container } = render(<TimePicker />);
		const labels = Array.from(
			container.querySelectorAll(
				'[data-kala-component="time-picker-time-column"] > span',
			),
		).map((el) => el.textContent);
		expect(labels).toEqual(["HH", "MM"]);
		expect(
			container.querySelectorAll('[data-slot="time-picker-colon"]').length,
		).toBe(1);
	});

	it("keeps HH : MM : SS order with two separators and slots landing on each column", () => {
		const { container } = render(
			<TimePicker
				showSeconds
				slotStyles={{ hour: "my-h", minute: "my-m", second: "my-s", colon: "my-c" }}
			/>,
		);
		const cols = container.querySelectorAll(
			'[data-kala-component="time-picker-time-column"]',
		);
		const labels = Array.from(cols).map((c) => c.querySelector("span")?.textContent);
		expect(labels).toEqual(["HH", "MM", "SS"]);
		const colons = container.querySelectorAll('[data-slot="time-picker-colon"]');
		expect(colons.length).toBe(2);
		expect(colons[0].nextElementSibling).toBe(cols[1]);
		expect(colons[1].nextElementSibling).toBe(cols[2]);
		expect(cols[0]).toHaveClass("my-h");
		expect(cols[1]).toHaveClass("my-m");
		expect(cols[2]).toHaveClass("my-s");
		expect(colons[0]).toHaveClass("my-c");
	});

	it("hourCycle=12 appends the AM/PM toggle after the minute column", () => {
		const { container } = render(<TimePicker hourCycle={12} />);
		const cols = container.querySelectorAll(
			'[data-kala-component="time-picker-time-column"]',
		);
		const periodButtons = container.querySelectorAll("button[aria-pressed]");
		expect(periodButtons.length).toBe(2);
		expect(periodButtons[0].textContent).toBe("AM");
		expect(periodButtons[1].textContent).toBe("PM");
		expect(cols[1].nextElementSibling?.querySelector("button[aria-pressed]")).toBe(
			periodButtons[0] as HTMLButtonElement,
		);
	});
});

describe("Select slotStyles", () => {
it("chevron slot beats its config base and reaches the glyph", () => {
	render(
		<Select defaultValue="a">
			<SelectTrigger slotStyles={{ chevron: "my-chev size-8" }}>pick</SelectTrigger>
		</Select>,
	);
		const chevron = screen.getByRole("combobox").querySelector("svg");
		expect(chevron).toHaveClass("my-chev");
		expect(chevron).toHaveClass("size-8");
		expect(chevron).not.toHaveClass("size-4");
	});

	it("itemIndicator slot beats its config base on the check glyph", () => {
		render(
			<Select defaultValue="a" open>
				<SelectTrigger>pick</SelectTrigger>
				<SelectContent>
					<SelectItem value="a" slotStyles={{ itemIndicator: "my-chk size-6" }}>
						a
					</SelectItem>
			</SelectContent>
			</Select>,
		);
		const check = document.body.querySelector(
			'[data-kala-component="select-item"] svg',
		);
		expect(check).toHaveClass("my-chk");
		expect(check).not.toHaveClass("size-4");
	});
});

describe("SelectTrigger config composition", () => {
	it("trigger composes base and size from the config table", () => {
		const { rerender } = render(
			<Select defaultValue="a">
				<SelectTrigger>pick</SelectTrigger>
			</Select>,
		);
		expect(screen.getByRole("combobox").className).toBe(
			"cursor-pointer bg-card text-foreground data-placeholder:text-muted-foreground aria-invalid:kala-ring-destructive/20 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between gap-2 rounded-[var(--kala-radius-input,var(--kala-radius-control))] border whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 kala-surface-input kala-focus-ring *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-[var(--kala-control-h)] px-3 py-2 text-sm",
		);
		rerender(
			<Select defaultValue="a">
				<SelectTrigger size="sm">pick</SelectTrigger>
			</Select>,
		);
		expect(screen.getByRole("combobox").className).toContain(
			"h-[var(--kala-control-h-sm)] px-2 py-1 text-xs",
		);
	});

	it("trigger root slot still beats legacy className", () => {
		render(
			<Select defaultValue="a">
				<SelectTrigger className="w-10" slotStyles={{ root: "w-64" }}>
					pick
				</SelectTrigger>
			</Select>,
		);
		const trigger = screen.getByRole("combobox");
		expect(trigger).toHaveClass("w-64");
		expect(trigger).not.toHaveClass("w-full");
	});
});

describe("MultiSelect slotStyles", () => {
	it("trigger, chip, chipRemove, overflowChip, clearAll and chevron slots reach their nodes", () => {
		const { container } = render(
			<MultiSelect
				options={[
					{ value: "a", label: "A" },
					{ value: "b", label: "B" },
					{ value: "c", label: "C" },
					{ value: "d", label: "D" },
				]}
				value={["a", "b", "c", "d"]}
				slotStyles={{
					root: "k-slot-root",
					trigger: "k-slot-trig",
					chip: "k-slot-chip",
					chipRemove: "k-slot-rm",
					overflowChip: "k-slot-more",
					clearAll: "k-slot-clear",
					chevron: "k-slot-chev",
				}}
			/>,
		);
		const root = container.querySelector('[data-slot="multi-select"]');
		expect(root?.className).toContain("k-slot-root");
		expect(
			container.querySelector('button[role="combobox"]'),
		).toHaveClass("k-slot-trig");
		expect(screen.getByText("A").className).toContain("k-slot-chip");
		expect(screen.getByLabelText("Remove A")).toHaveClass("k-slot-rm");
		expect(screen.getByText("+1 more").className).toContain("k-slot-more");
		expect(screen.getByLabelText("Clear all")).toHaveClass("k-slot-clear");
		const svgs = root?.querySelectorAll("svg");
		expect(svgs?.[svgs.length - 1]).toHaveClass("k-slot-chev");
	});

	it("absent slotStyles renders the exact pre-change class strings", () => {
		const { container } = render(
			<MultiSelect options={[{ value: "a", label: "A" }]} value={["a"]} />,
		);
		expect(
			container.querySelector('[data-slot="multi-select"]')?.className,
		).toBe(
			"relative flex min-h-[var(--kala-control-h)] w-full items-center justify-between rounded-md border bg-background text-sm transition-colors kala-surface-input hover:bg-accent/50",
		);
		expect(screen.getByText("A").className).toBe(
			"inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground",
		);
	});
});

describe("Tooltip slotStyles", () => {
	it("content root and arrow slots land on the portal-rendered surface", () => {
		render(
			<TooltipProvider>
				<Tooltip open>
					<TooltipTrigger>trg</TooltipTrigger>
				<TooltipContent
						slotStyles={{ root: "my-ttc", arrow: "my-tta" }}
					/>
			</Tooltip>
			</TooltipProvider>,
		);
		expect(
			document.body.querySelector('[data-slot="tooltip-content"]'),
		).not.toBeNull();
		expect(document.body.innerHTML).toContain("my-ttc");
		expect(document.body.innerHTML).toContain("my-tta");
	});
});

describe("Popover slotStyles", () => {
	it("body slot reaches the body region under its config base", () => {
		render(
			<Popover open>
				<PopoverTrigger>trg</PopoverTrigger>
				<PopoverContent>
					<PopoverBody slotStyles={{ root: "my-pb text-lg" }}>body</PopoverBody>
				</PopoverContent>
			</Popover>,
		);
		const body = document.body.querySelector(
			'[data-kala-component="popover-body"]',
		);
		expect(body).toHaveClass("my-pb");
		expect(body).toHaveClass("text-lg");
		expect(body).not.toHaveClass("text-sm");
	});
});

describe("DropdownMenu slotStyles", () => {
	it("content root slot lands on the portal-rendered surface", () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>trg</DropdownMenuTrigger>
				<DropdownMenuContent slotStyles={{ root: "my-dmc" }} />
			</DropdownMenu>,
		);
		expect(document.body.innerHTML).toContain("my-dmc");
	});
});

describe("Tabs slotStyles", () => {
	it("list, trigger and content slots reach their nodes", () => {
		const { container } = render(
			<Tabs defaultValue="a">
				<TabsList slotStyles={{ root: "my-list" }}>
					<TabsTrigger value="a" slotStyles={{ root: "my-trg" }}>
						A
					</TabsTrigger>
				</TabsList>
				<TabsContent value="a" slotStyles={{ root: "my-ct" }}>
					c
				</TabsContent>
			</Tabs>,
		);
		expect(container.querySelector('[data-slot="tabs-list"]')).toHaveClass(
			"my-list",
		);
		expect(container.querySelector('[data-slot="tabs-trigger"]')).toHaveClass(
			"my-trg",
		);
		expect(container.querySelector('[data-slot="tabs-content"]')).toHaveClass(
			"my-ct",
		);
	});
});

describe("Banner slotStyles", () => {
	it("actions, close and icon slots land when onClose renders the close button", () => {
		const { container } = render(
			<Banner
				onClose={() => {}}
				slotStyles={{ actions: "my-act", close: "my-cl", icon: "my-ic" }}
			>
				x
			</Banner>,
		);
		expect(
			container.querySelector('[data-kala-component="banner"] > div'),
		).toHaveClass("my-act");
		expect(screen.getByLabelText("Close banner")).toHaveClass("my-cl");
		expect(screen.getByLabelText("Close banner").querySelector("svg")).toHaveClass(
			"my-ic",
		);
	});

	it("without onClose the actions slot still lands and no close button renders", () => {
		const { container } = render(
			<Banner slotStyles={{ actions: "my-act" }}>x</Banner>,
		);
		expect(
			container.querySelector('[data-kala-component="banner"] > div'),
		).toHaveClass("my-act");
		expect(screen.queryByLabelText("Close banner")).toBeNull();
	});
});

describe("AvatarGroup slotStyles", () => {
	it("ring slot lands on every visible avatar; overflow chip only when overflowing", () => {
		const avatars = [
			{ fallback: "A" },
			{ fallback: "B" },
			{ fallback: "C" },
		];
		const { container, rerender } = render(
			<AvatarGroup
				avatars={avatars}
				max={3}
				showTooltip={false}
				slotStyles={{ ring: "my-ring" }}
			/>,
		);
		expect(container.querySelectorAll(".my-ring").length).toBe(3);
		expect(container.querySelector(".my-ovf")).toBeNull();

		rerender(
			<AvatarGroup
				avatars={avatars}
				max={1}
				showTooltip={false}
				slotStyles={{ ring: "my-ring", overflow: "my-ovf" }}
			/>,
		);
		expect(container.querySelectorAll(".my-ring").length).toBe(1);
		const chip = container.querySelector(".my-ovf");
		expect(chip?.textContent).toContain("+2");
	});
});

describe("Progress slotStyles", () => {
	it("indicator and label slots reach their nodes over the config bases", () => {
		const { container } = render(
			<Progress
				value={50}
				showValue
				label="uploading"
				slotStyles={{ indicator: "my-ind", label: "my-lbl" }}
			/>,
		);
		const indicator = container.querySelector(
			'[data-kala-component="progress"] > div',
		);
		expect(indicator).toHaveClass("my-ind");
		expect(screen.getByText("uploading")).toHaveClass("my-lbl");
	});
});

describe("EmptyState slotStyles", () => {
	it("icon, title and description slots land with a component icon", () => {
		const { container } = render(
			<EmptyState
				title="Nothing here"
				description="Try something else"
				slotStyles={{ icon: "my-ic", title: "my-ti", description: "my-de" }}
			/>,
		);
		expect(container.querySelector("svg")?.parentElement).toHaveClass("my-ic");
		expect(screen.getByText("Nothing here")).toHaveClass("my-ti");
		expect(screen.getByText("Try something else")).toHaveClass("my-de");
	});

	it("icon slot lands on the emoji wrapper for a string icon", () => {
		const { container } = render(
			<EmptyState
				icon="📦"
				title="Nothing here"
				slotStyles={{ icon: "my-ic" }}
			/>,
		);
		const wrapper = container.querySelector(
			'[data-kala-component="empty-state"] > div',
		);
		expect(wrapper).toHaveClass("my-ic");
		expect(wrapper?.querySelector("span")).toHaveClass("inline-block");
	});
});

describe("Input chrome slotStyles", () => {
	it("wrapper, prefix, suffix and toggle slots reach their nodes", () => {
		const { container } = render(
			<Input
				type="password"
				showPasswordToggle
				prefixIcon={<span>P</span>}
				slotStyles={{
					wrapper: "k-slot-wrapper w-64",
					prefix: "k-slot-prefix",
					suffix: "k-slot-suffix",
					toggle: "k-slot-toggle",
				}}
			/>,
		);
		const wrapper = container.querySelector('[data-kala-component="input"]');
		expect(wrapper?.className).toContain("k-slot-wrapper");
		expect(wrapper?.className).toContain("w-64");
		const prefix = wrapper?.firstElementChild;
		expect(prefix?.className).toContain("k-slot-prefix");
		const toggle = screen.getByRole("button", { name: "Show password" });
		expect(toggle.className).toContain("k-slot-toggle");
		expect(toggle.parentElement?.className).toContain("k-slot-suffix");
	});

	it("absent slotStyles keeps the chrome class strings byte-identical", () => {
		const { container } = render(
			<Input type="password" showPasswordToggle prefixIcon={<span>P</span>} />,
		);
		const wrapper = container.querySelector('[data-kala-component="input"]');
		expect(wrapper?.className).toBe("relative w-full");
		const toggle = screen.getByRole("button", { name: "Show password" });
		expect(toggle.className).toBe(
			"kala-touch cursor-pointer rounded-sm p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
		);
	});
});

describe("AlertTitle / AlertDescription slotStyles", () => {
	it("title and description root slots beat legacy className", () => {
		const { container } = render(
			<Alert>
				<AlertTitle className="w-10" slotStyles={{ root: "k-slot-title w-64" }}>
					T
				</AlertTitle>
				<AlertDescription
					className="w-10"
					slotStyles={{ root: "k-slot-desc w-64" }}
				>
					D
				</AlertDescription>
			</Alert>,
		);
		const title = container.querySelector(
			'[data-kala-component="alert-title"]',
		);
		expect(title?.className).toContain("k-slot-title");
		expect(title?.className).not.toContain("w-10");
		const desc = container.querySelector(
			'[data-kala-component="alert-description"]',
		);
		expect(desc?.className).toContain("k-slot-desc");
		expect(desc?.className).not.toContain("w-10");
	});

	it("absent slotStyles renders the exact pre-change class strings", () => {
		const { container } = render(
			<Alert>
				<AlertTitle>T</AlertTitle>
				<AlertDescription>D</AlertDescription>
			</Alert>,
		);
		expect(
			container.querySelector('[data-kala-component="alert-title"]')
				?.className,
		).toBe("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight");
		expect(
			container.querySelector('[data-kala-component="alert-description"]')
				?.className,
		).toBe("col-start-2 text-sm [&_p]:leading-relaxed");
	});
});

describe("Toast per-part slotStyles", () => {
	it("every sonner surface merges its slot over the config base", () => {
		const slots = {
			toast: "k-slot-toast",
			description: "k-slot-description",
			actionButton: "k-slot-action",
			cancelButton: "k-slot-cancel",
			icon: "k-slot-icon",
			closeButton: "k-slot-close",
		} as const;
		const classNames = buildToastClassNames(slots);
		for (const part of Object.keys(slots) as Array<keyof typeof slots>) {
			expect(classNames[part]).toContain(slots[part]);
			expect(classNames[part]).toContain(toastStyles[part]);
		}
	});

	it("absent slotStyles yields the exact current sonner classNames", () => {
		expect(buildToastClassNames()).toEqual({
			toast: "group toast group-[.toaster]:bg-popover group-[.toaster]:text-foreground group-[.toaster]:border data-[type=error]:!border-destructive data-[type=success]:!border-success data-[type=warning]:!border-warning data-[type=info]:!border-info data-[type=success]:[&_[data-icon]]:!text-success data-[type=error]:[&_[data-icon]]:!text-destructive data-[type=warning]:[&_[data-icon]]:!text-warning data-[type=info]:[&_[data-icon]]:!text-info",
			description: "group-[.toast]:text-muted-foreground",
			actionButton:
				"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-data-[type=success]:!bg-success group-data-[type=success]:!text-success-foreground group-data-[type=error]:!bg-destructive group-data-[type=error]:!text-destructive-foreground group-data-[type=warning]:!bg-warning group-data-[type=warning]:!text-warning-foreground group-data-[type=info]:!bg-info group-data-[type=info]:!text-info-foreground",
			cancelButton:
				"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
			icon: "group-[.toast]:!text-current",
			closeButton:
				"group-[.toast]:bg-popover group-[.toast]:border group-[.toast]:hover:bg-accent group-[.toast]:!left-auto group-[.toast]:!-right-4 group-[.toast]:!-top-1 group-data-[type=success]:!border-success group-data-[type=error]:!border-destructive group-data-[type=warning]:!border-warning group-data-[type=info]:!border-info",
		});
	});

	it("slot entries beat same-group base utilities via tailwind-merge", () => {
		// The description base and the slot share the group-[.toast]:text-*
		// group; slot-last ordering must let the slot displace the base, not
		// just append to it.
		const classNames = buildToastClassNames({
			description: "group-[.toast]:text-primary",
		});
		expect(classNames.description).toContain("group-[.toast]:text-primary");
		expect(classNames.description).not.toContain(
			"group-[.toast]:text-muted-foreground",
		);
	});

	it("wrapper root still channels through the Toaster", () => {
		// jsdom sonner swallows className (its section renders classless), so
		// the root channel is asserted through a passthrough Toaster double.
		render(<Toast slotStyles={{ root: "k-slot-root" }} />);
		const toaster = screen.getByTestId("sonner-toaster");
		expect(toaster.className).toContain("toaster group");
		expect(toaster.className).toContain("k-slot-root");
	});
});

describe("Badge loading arm", () => {
	it("skeleton uses the config loading base and keeps slotStyles.root", () => {
		const { container } = render(
			<Badge isLoading slotStyles={{ root: "k-slot-root" }} />,
		);
		const el = container.querySelector('[data-kala-component="badge"]');
		expect(el?.className).toContain("k-slot-root");
		expect(el?.className).toContain("inline-flex h-5 w-16 items-center rounded-full");
	});
});

describe("NativeSelect slotStyles", () => {
	it("root, select and icon slots reach their nodes", () => {
		const { container } = render(
			<NativeSelect
				className="w-10"
				slotStyles={{
					root: "k-slot-root",
					select: "k-slot-select w-64",
					icon: "k-slot-icon",
				}}
			>
				<option value="a">A</option>
			</NativeSelect>,
		);
		const root = container.querySelector(
			'[data-kala-component="select-native-select"]',
		);
		expect(root?.className).toContain("k-slot-root");
		const select = container.querySelector("select");
		expect(select?.className).toContain("k-slot-select");
		expect(select?.className).toContain("w-64");
		expect(select?.className).not.toContain("w-10");
		const icon = root?.querySelector("svg")?.parentElement;
		expect(icon?.className).toContain("k-slot-icon");
	});

	it("absent slotStyles keeps the pre-change class strings", () => {
		const { container } = render(
			<NativeSelect>
				<option value="a">A</option>
			</NativeSelect>,
		);
		expect(
			container.querySelector('[data-kala-component="select-native-select"]')
				?.className,
		).toBe("relative w-full");
		expect(container.querySelector("select")?.className).toBe(
			"w-full rounded-[var(--kala-radius-input,var(--kala-radius-control))] border bg-background text-sm transition-colors kala-surface-input kala-focus-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none h-[var(--kala-control-h)] px-3 py-2",
		);
	});

	it("size=sm and error variants keep their classes through the table", () => {
		const { container } = render(
			<NativeSelect size="sm" hasError>
				<option value="a">A</option>
			</NativeSelect>,
		);
		const select = container.querySelector("select");
		expect(select?.className).toContain("h-[var(--kala-control-h-sm)] px-2 py-1 text-xs");
		expect(select?.className).toContain("border-destructive");
	});
});

describe("ErrorBoundary slotStyles", () => {
	it("applies the fallback root slot over the config base on error", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const Bomb = (): never => {
			throw new Error("boom");
		};
		const { container } = render(
			<ErrorBoundary slotStyles={{ root: "k-slot-root" }}>
				<Bomb />
			</ErrorBoundary>,
		);
		const el = container.querySelector(
			'[data-kala-component="error-boundary-default-error-fallback"]',
		);
		expect(el?.className).toContain("k-slot-root");
		expect(el?.className).toContain(
			"rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm kala-surface-card",
		);
		errorSpy.mockRestore();
	});

	it("healthy path renders children and leaks nothing", () => {
		const { container } = render(
			<ErrorBoundary slotStyles={{ root: "k-slot-root" }}>
				<span>ok</span>
			</ErrorBoundary>,
		);
		expect(container.querySelector("span")?.textContent).toBe("ok");
		expect(container.innerHTML).not.toContain("slotStyles");
	});
});

/**
 * Style-file guard: per-part base classes for the components wired in this
 * contract live in src/config/<name>.ts style tables (keys = slot part
 * names), never inlined in the component .tsx. Each entry pins the exact
 * pre-extraction base string so a silent re-inline or reword fails here.
 */
const readSource = (relative: string) =>
	fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

// Short generic bases (e.g. "size-4") legitimately appear on other parts'
// glyphs, so absence is asserted on the re-inline call shape instead.
type StyleTableEntry = {
	part: string;
	tsx: string;
	config: string;
	base: string;
	absent?: string;
};

const styleTableEntries = [
	{
		part: "dialog.overlay",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-30 bg-overlay backdrop-blur-sm",
	},
	{
		part: "dialog.content",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "bg-card text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed inset-0 z-30 flex flex-col w-full h-full max-h-none translate-x-0 translate-y-0 rounded-none border duration-200 kala-surface-card",
	},
	{
		part: "dialog.close",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "absolute top-4 right-4 rounded-[var(--kala-radius-sm)] opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none p-1 hover:bg-accent",
	},
	{
		part: "dialog.header",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "flex flex-col gap-1.5 px-6 py-4 border-b",
	},
	{
		part: "dialog.footer",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 py-4 border-t bg-muted/50 rounded-b-[var(--kala-radius-card)]",
	},
	{
		part: "dialog.title",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "text-lg font-semibold leading-none tracking-tight text-foreground",
	},
	{
		part: "dialog.description",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "text-sm leading-relaxed text-muted-foreground",
	},
	{
		part: "dialog.body",
		tsx: "../components/dialog/dialog.tsx",
		config: "../config/dialog.ts",
		base: "flex-auto overflow-y-auto px-6 py-4 min-h-0",
	},
	{
		part: "tooltip.content",
		tsx: "../components/tooltip/tooltip.tsx",
		config: "../config/tooltip.ts",
		base: "z-30 rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground duration-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 kala-surface-popover",
	},
	{
		part: "tooltip.arrow",
		tsx: "../components/tooltip/tooltip.tsx",
		config: "../config/tooltip.ts",
		base: "z-30 size-2.5 rotate-225 border-t border-l bg-popover border-inherit -translate-y-[50%] kala-surface-popover",
	},
	{
		part: "tag.icon",
		tsx: "../components/tag/tag.tsx",
		config: "../config/tag.ts",
		base: "shrink-0",
	},
	{
		part: "tag.remove",
		tsx: "../components/tag/tag.tsx",
		config: "../config/tag.ts",
		base: "shrink-0 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current transition-opacity",
	},
	{
		part: "banner.actions",
		tsx: "../components/banner/banner.tsx",
		config: "../config/banner.ts",
		base: "flex-1 flex items-center gap-3",
	},
	{
		part: "banner.close",
		tsx: "../components/banner/banner.tsx",
		config: "../config/banner.ts",
		base: "kala-touch cursor-pointer shrink-0 p-1 rounded hover:bg-overlay/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
	},
	{
		part: "banner.icon",
		tsx: "../components/banner/banner.tsx",
		config: "../config/banner.ts",
		base: "w-4 h-4",
	},
	{
		part: "emptyState.icon",
		tsx: "../components/empty-state/empty-state.tsx",
		config: "../config/empty-state.ts",
		base: "flex h-20 w-20 items-center justify-center rounded-full bg-muted",
	},
	{
		part: "emptyState.title",
		tsx: "../components/empty-state/empty-state.tsx",
		config: "../config/empty-state.ts",
		base: "mt-4 text-lg font-semibold text-foreground",
	},
	{
		part: "emptyState.description",
		tsx: "../components/empty-state/empty-state.tsx",
		config: "../config/empty-state.ts",
		base: "mb-4 mt-2 max-w-sm text-center text-sm text-muted-foreground",
	},
	{
		part: "numberInput.root",
		tsx: "../components/number-input/number-input.tsx",
		config: "../config/number-input.ts",
		base: "flex w-full rounded-[var(--kala-radius-input,var(--kala-radius-control))] border bg-card kala-surface-input transition-colors",
	},
	{
		part: "numberInput.increment",
		tsx: "../components/number-input/number-input.tsx",
		config: "../config/number-input.ts",
		base: "flex items-center justify-center px-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-inherit",
	},
	{
		part: "numberInput.decrement",
		tsx: "../components/number-input/number-input.tsx",
		config: "../config/number-input.ts",
		base: "flex items-center justify-center px-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-inherit",
	},
	{
		part: "tagInput.root",
		tsx: "../components/tag-input/tag-input.tsx",
		config: "../config/tag-input.ts",
		base: "flex min-h-[2.5rem] w-full flex-wrap gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm kala-surface-input",
	},
	{
		part: "tagInput.remove",
		tsx: "../components/tag-input/tag-input.tsx",
		config: "../config/tag-input.ts",
		base: "ml-0.5 rounded-sm p-0.5 hover:bg-muted-foreground/20",
	},
	{
		part: "tagInput.clear",
		tsx: "../components/tag-input/tag-input.tsx",
		config: "../config/tag-input.ts",
		base: "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm",
	},
	{
		part: "timePicker.root",
		tsx: "../components/time-picker/time-picker.tsx",
		config: "../config/time-picker.ts",
		base: "inline-flex flex-col rounded-md border bg-card p-3 kala-surface-input",
	},
	{
		part: "timePicker.column",
		tsx: "../components/time-picker/time-picker.tsx",
		config: "../config/time-picker.ts",
		base: "flex flex-col items-center gap-1 min-w-0",
	},
	{
		part: "timePicker.colon",
		tsx: "../components/time-picker/time-picker.tsx",
		config: "../config/time-picker.ts",
		base: "flex items-center self-center mt-5 text-muted-foreground font-bold text-lg select-none",
	},
	{
		part: "timePicker.option",
		tsx: "../components/time-picker/time-picker.tsx",
		config: "../config/time-picker.ts",
		base: "w-10 h-8 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	},
	{
		part: "timePicker.period",
		tsx: "../components/time-picker/time-picker.tsx",
		config: "../config/time-picker.ts",
		base: "w-10 h-8 rounded-md text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	},
	{
		part: "datePicker.trigger",
		tsx: "../components/date-picker/date-picker.tsx",
		config: "../config/date-picker.ts",
		base: "w-[280px] justify-start text-left font-normal",
	},
	{
		part: "datePicker.triggerRange",
		tsx: "../components/date-picker/date-picker.tsx",
		config: "../config/date-picker.ts",
		base: "w-[300px] justify-start text-left font-normal",
	},
	{
		part: "datePicker.icon",
		tsx: "../components/date-picker/date-picker.tsx",
		config: "../config/date-picker.ts",
		base: "mr-2 h-4 w-4",
	},
	{
		part: "datePicker.content",
		tsx: "../components/date-picker/date-picker.tsx",
		config: "../config/date-picker.ts",
		base: "w-auto p-0",
	},
	{
		part: "fileUpload.dropzone",
		tsx: "../components/file-upload/file-upload.tsx",
		config: "../config/file-upload.ts",
		base: "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded transition-colors cursor-pointer kala-surface-input",
	},
	{
		part: "fileUpload.icon",
		tsx: "../components/file-upload/file-upload.tsx",
		config: "../config/file-upload.ts",
		base: "p-3 mb-3 rounded-full bg-muted",
	},
	{
		part: "avatarGroup.ring",
		tsx: "../components/avatar-group/avatar-group.tsx",
		config: "../config/avatar-group.ts",
		base: "ring-2 ring-background -ml-2 first:ml-0 transition-transform hover:z-10 hover:-translate-y-0.5",
	},
	{
		part: "avatarGroup.overflow",
		tsx: "../components/avatar-group/avatar-group.tsx",
		config: "../config/avatar-group.ts",
		base: "ring-2 ring-background -ml-2",
	},
	{
		part: "progress.root",
		tsx: "../components/progress/progress.tsx",
		config: "../config/progress.ts",
		base: "relative w-full overflow-hidden rounded-full bg-primary/20",
	},
	{
		part: "progress.indicator",
		tsx: "../components/progress/progress.tsx",
		config: "../config/progress.ts",
		base: "h-full w-full flex-1 transition-all duration-500 ease-in-out",
	},
	{
		part: "progress.valueLabel",
		tsx: "../components/progress/progress.tsx",
		config: "../config/progress.ts",
		base: "flex h-full items-center justify-center text-xs font-medium",
	},
	{
		part: "button.spinner",
		tsx: "../components/button/button.tsx",
		config: "../config/button.ts",
		base: "animate-spin h-4 w-4",
	},
	{
		part: "alert.icon",
		tsx: "../components/alert/alert.tsx",
		config: "../config/alert.ts",
		base: "size-4 translate-y-0.5",
	},
	{
		part: "alert.dismiss",
		tsx: "../components/alert/alert.tsx",
		config: "../config/alert.ts",
		base: "cursor-pointer absolute right-2 top-2 rounded-[var(--kala-radius-sm)] p-1 hover:bg-accent transition-colors",
	},
	{
		part: "popover.body",
		tsx: "../components/popover/popover.tsx",
		config: "../config/popover.ts",
		base: "text-sm",
	},
	{
		part: "select.chevron",
		tsx: "../components/select/select.tsx",
		config: "../config/select.ts",
		base: "size-4 opacity-50",
	},
	{
		part: "select.itemIndicator",
		tsx: "../components/select/select.tsx",
		config: "../config/select.ts",
		base: "size-4",
		absent: 'applySlot("size-4",',
	},
	{
		part: "input.wrapper",
		tsx: "../components/input/input.tsx",
		config: "../config/input.ts",
		base: "relative w-full",
	},
	{
		part: "input.prefix",
		tsx: "../components/input/input.tsx",
		config: "../config/input.ts",
		base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground",
	},
	{
		part: "input.suffix",
		tsx: "../components/input/input.tsx",
		config: "../config/input.ts",
		base: "absolute inset-y-0 right-0 flex items-center gap-2 pr-3",
	},
	{
		part: "input.toggle",
		tsx: "../components/input/input.tsx",
		config: "../config/input.ts",
		base: "kala-touch cursor-pointer rounded-sm p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
	},
	{
		part: "alert.title",
		tsx: "../components/alert/alert.tsx",
		config: "../config/alert.ts",
		base: "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
	},
	{
		part: "alert.description",
		tsx: "../components/alert/alert.tsx",
		config: "../config/alert.ts",
		base: "col-start-2 text-sm [&_p]:leading-relaxed",
	},
	{
		part: "badge.loading",
		tsx: "../components/badge/badge.tsx",
		config: "../config/badge.ts",
		base: "inline-flex h-5 w-16 items-center rounded-full",
	},
	{
		part: "toast.toast",
		tsx: "../components/toast/toast.tsx",
		config: "../config/toast.ts",
		base: "group toast group-[.toaster]:bg-popover group-[.toaster]:text-foreground group-[.toaster]:border data-[type=error]:!border-destructive data-[type=success]:!border-success data-[type=warning]:!border-warning data-[type=info]:!border-info data-[type=success]:[&_[data-icon]]:!text-success data-[type=error]:[&_[data-icon]]:!text-destructive data-[type=warning]:[&_[data-icon]]:!text-warning data-[type=info]:[&_[data-icon]]:!text-info",
	},
	{
		part: "toast.description",
		tsx: "../components/toast/toast.tsx",
		config: "../config/toast.ts",
		base: "group-[.toast]:text-muted-foreground",
		absent: 'description: "group-[.toast]:text-muted-foreground"',
	},
	{
		part: "toast.actionButton",
		tsx: "../components/toast/toast.tsx",
		config: "../config/toast.ts",
		base: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-data-[type=success]:!bg-success group-data-[type=success]:!text-success-foreground group-data-[type=error]:!bg-destructive group-data-[type=error]:!text-destructive-foreground group-data-[type=warning]:!bg-warning group-data-[type=warning]:!text-warning-foreground group-data-[type=info]:!bg-info group-data-[type=info]:!text-info-foreground",
	},
	{
		part: "toast.cancelButton",
		tsx: "../components/toast/toast.tsx",
		config: "../config/toast.ts",
		base: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
		absent: 'cancelButton: "group-[.toast]:bg-muted',
	},
	{
		part: "toast.icon",
		tsx: "../components/toast/toast.tsx",
		config: "../config/toast.ts",
		base: "group-[.toast]:!text-current",
		absent: 'icon: "group-[.toast]:!text-current"',
	},
	{
		part: "toast.closeButton",
		tsx: "../components/toast/toast.tsx",
		config: "../config/toast.ts",
		base: "group-[.toast]:bg-popover group-[.toast]:border group-[.toast]:hover:bg-accent group-[.toast]:!left-auto group-[.toast]:!-right-4 group-[.toast]:!-top-1 group-data-[type=success]:!border-success group-data-[type=error]:!border-destructive group-data-[type=warning]:!border-warning group-data-[type=info]:!border-info",
	},
	{
		part: "nativeSelect.root",
		tsx: "../components/select/native-select.tsx",
		config: "../config/select.ts",
		base: "relative w-full",
	},
	{
		part: "nativeSelect.select",
		tsx: "../components/select/native-select.tsx",
		config: "../config/select.ts",
		base: "w-full rounded-[var(--kala-radius-input,var(--kala-radius-control))] border bg-background text-sm transition-colors kala-surface-input kala-focus-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10",
	},
	{
		part: "nativeSelect.icon",
		tsx: "../components/select/native-select.tsx",
		config: "../config/select.ts",
		base: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2",
	},
	{
		part: "errorBoundary.fallback",
		tsx: "../components/error-boundary/error-boundary.tsx",
		config: "../config/error-boundary.ts",
		base: "rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm kala-surface-card",
	},
	{
		part: "tag.root",
		tsx: "../components/tag/tag.tsx",
		config: "../config/tag.ts",
		base: "inline-flex items-center gap-1 font-medium transition-colors select-none",
	},
	{
		part: "banner.root",
		tsx: "../components/banner/banner.tsx",
		config: "../config/banner.ts",
		base: "w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4",
	},
	{
		part: "multiSelect.root",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "relative flex min-h-[var(--kala-control-h)] w-full items-center justify-between rounded-md border bg-background text-sm transition-colors kala-surface-input",
	},
	{
		part: "multiSelect.rootHover",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "hover:bg-accent/50",
		absent: '"hover:bg-accent/50"',
	},
	{
		part: "multiSelect.rootDisabled",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "cursor-not-allowed opacity-50",
		absent: '"cursor-not-allowed opacity-50"',
	},
	{
		part: "multiSelect.trigger",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "absolute inset-0 z-0 rounded-md kala-focus-ring",
	},
	{
		part: "multiSelect.chipsContainer",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "pointer-events-none relative z-10 flex flex-1 flex-wrap items-center gap-1 py-1.5 pl-3",
	},
	{
		part: "multiSelect.placeholder",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "text-muted-foreground",
		absent: '"text-muted-foreground"',
	},
	{
		part: "multiSelect.chip",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground",
	},
	{
		part: "multiSelect.chipIcon",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "mr-1 flex size-3 items-center",
	},
	{
		part: "multiSelect.chipRemove",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "kala-touch pointer-events-auto rounded-sm hover:bg-secondary-foreground/20",
	},
	{
		part: "multiSelect.chipRemoveIcon",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "size-3",
		absent: '"size-3"',
	},
	{
		part: "multiSelect.overflowChip",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground",
	},
	{
		part: "multiSelect.controls",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "pointer-events-none relative z-10 flex items-center gap-1 py-1.5 pr-3",
	},
	{
		part: "multiSelect.clearAll",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "kala-touch pointer-events-auto mr-1 rounded-sm opacity-50 hover:opacity-100",
	},
	{
		part: "multiSelect.clearAllIcon",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "size-4",
		absent: '"size-4"',
	},
	{
		part: "multiSelect.chevron",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "size-4 shrink-0 opacity-50",
	},
	{
		part: "multiSelect.popoverContent",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "z-30 p-0",
	},
	{
		part: "multiSelect.command",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "rounded-lg border bg-popover text-popover-foreground kala-surface-popover",
	},
	{
		part: "multiSelect.commandMatched",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "w-full",
		absent: '"w-full"',
	},
	{
		part: "multiSelect.commandFluid",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "min-w-[200px]",
	},
	{
		part: "multiSelect.groupHeader",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "sticky top-0 z-10 bg-popover p-0 kala-surface-card",
	},
	{
		part: "multiSelect.groupHeaderItem",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "cursor-pointer rounded-none border-b py-2",
	},
	{
		part: "multiSelect.checkbox",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "mr-2 pointer-events-none",
	},
	{
		part: "multiSelect.separator",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "my-1",
		absent: '"my-1"',
	},
	{
		part: "multiSelect.optionIcon",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "mr-2 flex size-4 items-center text-muted-foreground",
	},
	{
		part: "multiSelect.truncate",
		tsx: "../components/multi-select/multi-select.tsx",
		config: "../config/multi-select.ts",
		base: "truncate",
		absent: '"truncate"',
	},
	{
		part: "selectTrigger.root",
		tsx: "../components/select/select.tsx",
		config: "../config/select.ts",
		base: "cursor-pointer bg-card text-foreground data-placeholder:text-muted-foreground aria-invalid:kala-ring-destructive/20 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between gap-2 rounded-[var(--kala-radius-input,var(--kala-radius-control))] border whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 kala-surface-input kala-focus-ring *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	},
	{
		part: "selectTrigger.sizeMd",
		tsx: "../components/select/select.tsx",
		config: "../config/select.ts",
		base: "h-[var(--kala-control-h)] px-3 py-2 text-sm",
	},
	{
		part: "selectTrigger.sizeSm",
		tsx: "../components/select/select.tsx",
		config: "../config/select.ts",
		base: "h-[var(--kala-control-h-sm)] px-2 py-1 text-xs",
	},
	{
		part: "calendar.root",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
	},
	{
		part: "calendar.rootRtlNext",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		// Backslash-free pin: the value's `\_` escapes make byte-verbatim
		// matching fragile across writers, so the key-prefixed prefix carries
		// the uniqueness instead.
		base: 'rootRtlNext: "rtl:**:[.rdp-button',
	},
	{
		part: "calendar.rootRtlPrevious",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: 'rootRtlPrevious: "rtl:**:[.rdp-button',
	},
	{
		part: "calendar.innerRoot",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "w-fit",
		absent: '"w-fit"',
	},
	{
		part: "calendar.months",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "flex gap-4 flex-col md:flex-row relative",
	},
	{
		part: "calendar.month",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "flex flex-col w-full gap-4",
	},
	{
		part: "calendar.nav",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
	},
	{
		part: "calendar.navButton",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
	},
	{
		part: "calendar.month_caption",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
	},
	{
		part: "calendar.dropdowns",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
	},
	{
		part: "calendar.dropdown_root",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "relative focus-within:border-primary border focus-within:ring rounded-md kala-surface-input",
	},
	{
		part: "calendar.dropdown",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "absolute bg-popover inset-0 opacity-0",
	},
	{
		part: "calendar.caption_label",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "select-none font-medium",
	},
	{
		part: "calendar.caption_labelLabel",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "text-sm",
		absent: '"text-sm"',
	},
	{
		part: "calendar.caption_labelDropdown",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
	},
	{
		part: "calendar.month_grid",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "w-full border-collapse",
	},
	{
		part: "calendar.weekdays",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "flex",
		absent: '"flex"',
	},
	{
		part: "calendar.weekday",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
	},
	{
		part: "calendar.week",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "flex w-full mt-2",
	},
	{
		part: "calendar.week_number_header",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "select-none w-(--cell-size)",
	},
	{
		part: "calendar.week_number",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "text-[0.8rem] select-none text-muted-foreground",
	},
	{
		part: "calendar.day",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
	},
	{
		part: "calendar.dayWeekNumber",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md",
	},
	{
		part: "calendar.dayDefault",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "[&:first-child[data-selected=true]_button]:rounded-l-md",
	},
	{
		part: "calendar.range_start",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "rounded-l-md bg-accent",
	},
	{
		part: "calendar.range_middle",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "rounded-none",
		absent: '"rounded-none"',
	},
	{
		part: "calendar.range_end",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "rounded-r-md bg-accent",
	},
	{
		part: "calendar.today",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
	},
	{
		part: "calendar.outside",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "text-muted-foreground aria-selected:text-muted-foreground",
	},
	{
		part: "calendar.disabled",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "text-muted-foreground opacity-50",
	},
	{
		part: "calendar.hidden",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "invisible",
		absent: '"invisible"',
	},
	{
		part: "calendar.chevron",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "size-4",
		absent: '"size-4"',
	},
	{
		part: "calendar.weekNumber",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "flex size-(--cell-size) items-center justify-center text-center",
	},
	{
		part: "calendar.dayButton",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-primary group-data-[focused=true]/day:ring/50 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
	},
	{
		part: "calendar.skeleton",
		tsx: "../components/calendar/calendar.tsx",
		config: "../config/calendar.ts",
		base: "p-3",
		absent: '"p-3"',
	},
] as const satisfies readonly StyleTableEntry[];

describe("style tables own the base classes", () => {
	it.each(styleTableEntries)(
		"$part base lives verbatim in its config table and not in the component",
		({ tsx, config, base, absent }) => {
			expect(readSource(config)).toContain(base);
			expect(readSource(tsx)).not.toContain(absent ?? base);
		},
	);
});
