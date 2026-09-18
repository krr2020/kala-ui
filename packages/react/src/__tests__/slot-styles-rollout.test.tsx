/**
 * slotStyles rollout contract: every remaining visual component family
 * accepts `slotStyles={{ root, <part> }}` with the uniform precedence
 * library defaults → legacy className/style → slot entry. This suite is
 * self-verifying: the inventory guard enumerates src/components and fails
 * when a family is neither wired, rolled out here, nor explicitly excluded.
 *
 * Excluded (no styled DOM root of their own): theme-provider (context
 * provider), error-boundary (class wrapper), design-system (docs helper).
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Accordion, AccordionItem, AccordionTrigger } from "../components/accordion";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "../components/alert-dialog";
import { AspectRatio } from "../components/aspect-ratio";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Box } from "../components/box";
import { Breadcrumbs } from "../components/breadcrumbs";
import { Burger } from "../components/burger";
import { ButtonGroup } from "../components/button-group";
import { Calendar } from "../components/calendar";
import { Center } from "../components/center";
import { Checkbox } from "../components/checkbox";
import { Code } from "../components/code";
import { Collapse } from "../components/collapse";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/collapsible";
import { ColorInput } from "../components/color-input";
import { Combobox } from "../components/combobox";
import { Command, CommandInput, CommandItem, CommandList } from "../components/command";
import { Container } from "../components/container";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../components/context-menu";
import { CopyButton } from "../components/copy-button";
import { Drawer, DrawerContent, DrawerTrigger } from "../components/drawer";
import { Field, FieldLabel } from "../components/field";
import { Flex } from "../components/flex";
import { Grid, GridItem } from "../components/grid";
import { Group } from "../components/group";
import { Heading } from "../components/heading";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/hover-card";
import { Indicator } from "../components/indicator";
import { InputGroup, InputGroupText } from "../components/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/input-otp";
import { Kbd } from "../components/kbd";
import { Label } from "../components/label";
import { List, ListItem } from "../components/list";
import { PageLoader, SectionLoader } from "../components/loading";
import { LoadingOverlay } from "../components/loading-overlay";
import { Menubar, MenubarMenu, MenubarTrigger } from "../components/menubar";
import { MultiSelect } from "../components/multi-select";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "../components/navigation-menu";
import { Overlay } from "../components/overlay";
import { PageTransition } from "../components/page-transition";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from "../components/pagination";
import { Paper } from "../components/paper";
import { PasswordStrengthIndicator } from "../components/password-strength-indicator";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { Rating } from "../components/rating";
import { ResizablePanelGroup, ResizablePanel } from "../components/resizable";
import { RingProgress } from "../components/ring-progress";
import { ScrollArea } from "../components/scroll-area";
import { SegmentedControl } from "../components/segmented-control";
import { Separator } from "../components/separator";
import { Skeleton } from "../components/skeleton";
import { SkipToContent } from "../components/skip-to-content";
import { Slider } from "../components/slider";
import { Spoiler } from "../components/spoiler";
import { Spinner } from "../components/spinner";
import { Stack } from "../components/stack";
import { Steps } from "../components/steps";
import { Switch } from "../components/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table";
import { Text } from "../components/text";
import { Textarea } from "../components/textarea";
import { Timeline, TimelineItem } from "../components/timeline";
import { Toggle } from "../components/toggle";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";
import { Toolbar } from "../components/toolbar";
import { Toast } from "../components/toast";
import { TreeView } from "../components/tree-view";
import type { SlotStyles } from "../lib/slot-styles";

afterEach(cleanup);

/** Already-wired families (src/__tests__/slot-styles.test.tsx covers them). */
const WIRED = [
	"alert", "avatar-group", "badge", "banner", "button", "card", "date-picker",
	"dialog", "dropdown-menu", "empty-state", "file-upload", "input",
	"number-input", "popover", "progress", "select", "tabs", "tag", "tag-input",
	"time-picker", "tooltip",
] as const;

/** Families with no styled DOM root of their own. */
const EXCLUDED: Record<string, string> = {
	"theme-provider": "context provider, renders no styled element",
	"error-boundary": "class wrapper, renders children or fallback only",
	"design-system": "docs/demo helper, not a shipped visual component",
};

type OverrideProps = {
	className?: string;
	style?: React.CSSProperties;
	slotStyles?: SlotStyles;
};

type Row = {
	/** Family = component dir name; compound rows share the family. */
	family: string;
	marker: string;
	render: (p: OverrideProps) => React.ReactElement;
	/** Addressable internal chrome; find() resolves the node from the family root. */
	parts?: { slot: string; find: (root: Element | null) => Element | null }[];
};

const byMarker = (root: Element | null, marker: string) =>
	root?.querySelector(`[data-kala-component="${marker}"]`) ?? null;

/**
 * Rule (c) delegations — parts these families cannot expose because a
 * third-party owns the node. Asserted present so each omission is audited.
 */
const DELEGATIONS: Record<string, string> = {
	toast: "sonner owns the toast chrome; slots limited to wrapper-rendered nodes",
	command: "cmdk owns list rendering internals; wrapper-rendered nodes only",
	resizable: "react-resizable-panels owns handles; wrapper-rendered nodes only",
	calendar: "react-day-picker owns day cells; wrapper-level slots only",
};

const rows: Row[] = [
	// Layout primitives
	{ family: "box", marker: "box", render: (p) => <Box {...p}>x</Box> },
	{ family: "flex", marker: "flex", render: (p) => <Flex {...p}>x</Flex> },
	{ family: "grid", marker: "grid", render: (p) => <Grid {...p}>x</Grid> },
	{
		family: "grid",
		marker: "grid-item",
		render: (p) => (
			<Grid>
				<GridItem {...p}>x</GridItem>
			</Grid>
		),
	},
	{ family: "stack", marker: "stack", render: (p) => <Stack {...p}>x</Stack> },
	{ family: "center", marker: "center", render: (p) => <Center {...p}>x</Center> },
	{ family: "container", marker: "container", render: (p) => <Container {...p}>x</Container> },
	{ family: "paper", marker: "paper", render: (p) => <Paper {...p}>x</Paper> },
	{ family: "group", marker: "group", render: (p) => <Group {...p}>x</Group> },
	{ family: "separator", marker: "separator", render: (p) => <Separator {...p} /> },
	{
		family: "aspect-ratio",
		marker: "aspect-ratio",
		render: (p) => (
			<AspectRatio ratio={16 / 9} {...p}>
				x
			</AspectRatio>
		),
	},
	{ family: "scroll-area", marker: "scroll-area", render: (p) => <ScrollArea {...p}>x</ScrollArea> },
	{
		family: "resizable",
		marker: "resizable-panel-group",
		render: (p) => (
			<ResizablePanelGroup {...p}>
				<ResizablePanel>x</ResizablePanel>
			</ResizablePanelGroup>
		),
	},

	// Form
	{ family: "textarea", marker: "textarea", render: (p) => <Textarea {...p} /> },
	{
		family: "checkbox",
		marker: "checkbox",
		render: (p) => <Checkbox defaultChecked {...p} />,
		parts: [
			{
				slot: "indicator",
				find: (r) => r?.querySelector("[data-slot='checkbox-indicator']") ?? null,
			},
		],
	},
	{
		family: "radio-group",
		marker: "radio-group",
		render: (p) => (
			<RadioGroup {...p}>
				<RadioGroupItem value="a" />
			</RadioGroup>
		),
	},
	{
		family: "radio-group",
		marker: "radio-group-item",
		render: (p) => (
			<RadioGroup defaultValue="a">
				<RadioGroupItem value="a" {...p} />
			</RadioGroup>
		),
		parts: [
			{
				slot: "indicator",
				find: (r) =>
					r?.querySelector("[data-slot='radio-group-indicator']") ?? null,
			},
		],
	},
	{
		family: "switch",
		marker: "switch",
		render: (p) => <Switch {...p} />,
		parts: [{ slot: "thumb", find: (r) => byMarker(r, "switch-thumb") }],
	},
	{ family: "slider", marker: "slider", render: (p) => <Slider {...p} /> },
	{ family: "rating", marker: "rating", render: (p) => <Rating {...p} /> },
	{ family: "label", marker: "label", render: (p) => <Label {...p}>L</Label> },
	{
		family: "field",
		marker: "field",
		render: (p) => (
			<Field {...p}>
				<FieldLabel>L</FieldLabel>
			</Field>
		),
	},
	{
		family: "field",
		marker: "field-label",
		render: (p) => (
			<Field>
				<FieldLabel {...p}>L</FieldLabel>
			</Field>
		),
	},
	{
		family: "input-group",
		marker: "input-group",
		render: (p) => (
			<InputGroup {...p}>
				<InputGroupText>@</InputGroupText>
			</InputGroup>
		),
	},
	{
		family: "input-group",
		marker: "input-group-text",
		render: (p) => (
			<InputGroup>
				<InputGroupText {...p}>@</InputGroupText>
			</InputGroup>
		),
	},
	{
		family: "input-otp",
		marker: "input-otp",
		render: (p) => (
			<InputOTP maxLength={6} {...p}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
				</InputOTPGroup>
			</InputOTP>
		),
	},
	{ family: "color-input", marker: "color-input", render: (p) => <ColorInput {...p} /> },
	{
		family: "password-strength-indicator",
		marker: "password-strength-indicator",
		render: (p) => <PasswordStrengthIndicator password="abc123" {...p} />,
	},
	{
		family: "combobox",
		marker: "combobox",
		render: (p) => <Combobox options={[{ value: "a", label: "A" }]} {...p} />,
	},
	{
		family: "multi-select",
		marker: "multi-select",
		render: (p) => <MultiSelect options={[{ value: "a", label: "A" }]} {...p} />,
	},

	// Overlays/menus
	{
		family: "alert-dialog",
		marker: "alert-dialog-content",
		render: (p) => (
			<AlertDialog defaultOpen>
				<AlertDialogTrigger>o</AlertDialogTrigger>
				<AlertDialogContent {...p}>x</AlertDialogContent>
			</AlertDialog>
		),
	},
	{
		family: "drawer",
		marker: "drawer-content",
		render: (p) => (
			<Drawer open>
				<DrawerTrigger>o</DrawerTrigger>
				<DrawerContent {...p}>x</DrawerContent>
			</Drawer>
		),
	},
	{
		family: "hover-card",
		marker: "hover-card-content",
		render: (p) => (
			<HoverCard open>
				<HoverCardTrigger>
					<span>o</span>
				</HoverCardTrigger>
				<HoverCardContent {...p}>c</HoverCardContent>
			</HoverCard>
		),
	},
	{
		family: "context-menu",
		marker: "context-menu-content",
		render: (p) => (
			<ContextMenu>
				<ContextMenuTrigger>
					<span>o</span>
				</ContextMenuTrigger>
				<ContextMenuContent forceMount {...p} />
			</ContextMenu>
		),
	},
	{
		family: "command",
		marker: "command",
		render: (p) => (
			<Command {...p}>
				<CommandInput />
				<CommandList>
					<CommandItem>x</CommandItem>
				</CommandList>
			</Command>
		),
	},
	{
		family: "menubar",
		marker: "menubar",
		render: (p) => (
			<Menubar {...p}>
				<MenubarMenu>
					<MenubarTrigger>F</MenubarTrigger>
				</MenubarMenu>
			</Menubar>
		),
	},
	{
		family: "navigation-menu",
		marker: "navigation-menu",
		render: (p) => (
			<NavigationMenu {...p}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink href="#">L</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		),
	},
	{
		family: "breadcrumbs",
		marker: "breadcrumbs",
		render: (p) => <Breadcrumbs items={[{ label: "a", href: "#" }]} {...p} />,
	},

	// Feedback/data
	{
		family: "toast",
		marker: "toast",
		render: (p) => <Toast {...p} />,
	},
	{ family: "spinner", marker: "spinner", render: (p) => <Spinner {...p} /> },
	{
		family: "loading",
		marker: "loading-page-loader",
		render: (p) => <PageLoader {...p} />,
	},
	{
		family: "loading",
		marker: "loading-section-loader",
		render: (p) => <SectionLoader {...p} />,
	},
	{
		family: "loading-overlay",
		marker: "loading-overlay",
		render: (p) => (
			<LoadingOverlay visible {...p}>
				<div>x</div>
			</LoadingOverlay>
		),
	},
	{ family: "skeleton", marker: "skeleton", render: (p) => <Skeleton {...p} /> },
	{
		family: "table",
		marker: "table",
		render: (p) => (
			<Table {...p}>
				<TableHeader>
					<TableRow>
						<TableHead>H</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>C</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		),
	},
	{
		family: "pagination",
		marker: "pagination",
		render: (p) => (
			<Pagination {...p}>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		),
		parts: [
			{ slot: "ellipsis", find: (r) => byMarker(r, "pagination-ellipsis") },
		],
	},
	{
		family: "accordion",
		marker: "accordion-trigger",
		render: (p) => (
			<Accordion type="single">
				<AccordionItem value="a">
					<AccordionTrigger {...p}>x</AccordionTrigger>
				</AccordionItem>
			</Accordion>
		),
		parts: [{ slot: "chevron", find: (r) => r?.querySelector("svg") ?? null }],
	},
	{
		family: "collapsible",
		marker: "collapsible-content",
		render: (p) => (
			<Collapsible open>
				<CollapsibleTrigger>t</CollapsibleTrigger>
				<CollapsibleContent {...p}>c</CollapsibleContent>
			</Collapsible>
		),
	},
	{
		family: "collapse",
		marker: "collapse",
		render: (p) => (
			<Collapse in {...p}>
				<div>x</div>
			</Collapse>
		),
	},
	{
		family: "steps",
		marker: "steps",
		render: (p) => (
			<Steps value={1} items={[{ title: "a" }, { title: "b" }]} {...p} />
		),
	},
	{
		family: "timeline",
		marker: "timeline",
		render: (p) => (
			<Timeline {...p}>
				<TimelineItem title="e" />
			</Timeline>
		),
	},
	{
		family: "tree-view",
		marker: "tree-view",
		render: (p) => <TreeView {...p} data={[{ id: "a", label: "A" }]} />,
	},
	{ family: "page-transition", marker: "page-transition", render: (p) => <PageTransition {...p}>x</PageTransition> },
	{ family: "skip-to-content", marker: "skip-to-content", render: (p) => <SkipToContent {...p}>S</SkipToContent> },
	{
		family: "list",
		marker: "list",
		render: (p) => (
			<List {...p}>
				<ListItem>i</ListItem>
			</List>
		),
	},
	{
		family: "list",
		marker: "list-item",
		render: (p) => (
			<List>
				<ListItem {...p}>i</ListItem>
			</List>
		),
	},
	{ family: "overlay", marker: "overlay", render: (p) => <Overlay {...p} /> },
	{
		family: "toolbar",
		marker: "toolbar",
		render: (p) => (
			<Toolbar {...p}>
				<button type="button">b</button>
			</Toolbar>
		),
	},
	{
		family: "segmented-control",
		marker: "segmented-control",
		render: (p) => <SegmentedControl data={["a", "b"]} {...p} />,
	},

	// Identity/text
	{
		family: "avatar",
		marker: "avatar",
		render: (p) => (
			<Avatar {...p}>
				<AvatarFallback>A</AvatarFallback>
			</Avatar>
		),
	},
	{
		family: "avatar",
		marker: "avatar-fallback",
		render: (p) => (
			<Avatar>
				<AvatarFallback {...p}>A</AvatarFallback>
			</Avatar>
		),
	},
	{ family: "heading", marker: "heading", render: (p) => <Heading {...p}>H</Heading> },
	{ family: "text", marker: "text", render: (p) => <Text {...p}>x</Text> },
	{ family: "code", marker: "code", render: (p) => <Code {...p}>x</Code> },
	{ family: "kbd", marker: "kbd", render: (p) => <Kbd {...p}>⌘</Kbd> },
	{
		family: "copy-button",
		marker: "copy-button",
		render: (p) => <CopyButton value="x" {...p} />,
		parts: [{ slot: "icon", find: (r) => r?.querySelector("svg") ?? null }],
	},
	{
		family: "spoiler",
		marker: "spoiler",
		render: (p) => (
			<Spoiler maxHeight={100} {...p}>
				x
			</Spoiler>
		),
	},
	{
		family: "indicator",
		marker: "indicator",
		render: (p) => (
			<Indicator {...p}>
				<span>x</span>
			</Indicator>
		),
	},
	{ family: "toggle", marker: "toggle", render: (p) => <Toggle {...p}>x</Toggle> },
	{
		family: "toggle-group",
		marker: "toggle-group",
		render: (p) => (
			<ToggleGroup type="single" {...p}>
				<ToggleGroupItem value="a">x</ToggleGroupItem>
			</ToggleGroup>
		),
	},
	{
		family: "button-group",
		marker: "button-group",
		render: (p) => (
			<ButtonGroup {...p}>
				<button type="button">a</button>
				<button type="button">b</button>
			</ButtonGroup>
		),
	},
	{ family: "burger", marker: "burger", render: (p) => <Burger {...p} /> },
];

const findEl = (marker: string) =>
	document.body.querySelector(`[data-kala-component="${marker}"]`);

describe("inventory guard", () => {
	it("classifies every component dir as wired, rolled out, or excluded", () => {
		const dirs = fs
			.readdirSync(
				fileURLToPath(new URL("../components", import.meta.url)),
				{ withFileTypes: true },
			)
			.filter((d) => d.isDirectory())
			.map((d) => d.name);
		const tableFamilies = new Set(rows.map((r) => r.family));
		const classified = new Set<string>([
			...WIRED,
			...Object.keys(EXCLUDED),
			...tableFamilies,
		]);
		const unclassified = dirs.filter((d) => !classified.has(d));
		expect(unclassified).toEqual([]);
	});

	it("records a delegation reason for every third-party-owned family", () => {
		for (const [family] of Object.entries(DELEGATIONS)) {
			expect(rows.some((r) => r.family === family)).toBe(true);
		}
	});
});

describe.each(rows)("$marker slotStyles", (row) => {
	it("string root slot beats legacy className and keeps base classes", () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const partSlots = Object.fromEntries(
			(row.parts ?? []).map((p) => [p.slot, `k-slot-${p.slot}`]),
		);
		const { unmount } = render(
			row.render({
				className: "w-10",
				slotStyles: { root: "k-slot-root w-64", ...partSlots },
			}),
		);
		const el = findEl(row.marker);
		expect(el).not.toBeNull();
		expect(el?.className).toContain("k-slot-root");
		expect(el?.className).toContain("w-64");
		expect(el?.className).not.toContain("w-10");
		for (const part of row.parts ?? []) {
			const node = part.find(el);
			expect(node?.className).toContain(`k-slot-${part.slot}`);
		}
		expect(document.body.innerHTML).not.toContain("slotStyles");
		const leaked = errorSpy.mock.calls.filter((c) =>
			String(c[0]).includes("slotStyles"),
		);
		expect(leaked).toEqual([]);
		errorSpy.mockRestore();
		unmount();
	});

	it("object root slot wins per key over the style prop", () => {
		const { unmount } = render(
			row.render({
				style: { marginTop: "1px" },
				slotStyles: { root: { marginTop: "9px", opacity: "0.5" } },
			}),
		);
		const el = findEl(row.marker) as HTMLElement | null;
		expect(el).not.toBeNull();
		expect(el?.style.marginTop).toBe("9px");
		expect(el?.style.opacity).toBe("0.5");
		unmount();
	});
});

describe("absent slotStyles renders byte-identical class strings", () => {
	it("Skeleton", () => {
		render(<Skeleton />);
		expect(findEl("skeleton")?.className).toBe(
			"bg-muted dark:bg-muted/70 rounded-md animate-pulse",
		);
	});
	it("Text", () => {
		render(<Text>x</Text>);
		expect(findEl("text")?.className).toBe(
			"text-foreground text-base font-normal text-left",
		);
	});
	it("Box", () => {
		render(<Box>x</Box>);
		expect(findEl("box")?.className).toBe("");
	});
	it("Flex", () => {
		render(<Flex>x</Flex>);
		expect(findEl("flex")?.className).toBe(
			"flex flex-row flex-nowrap items-stretch justify-start gap-0",
		);
	});
	it("PaginationItem", () => {
		render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);
		expect(document.body.querySelector("li")?.className).toBe("");
	});
	it("Separator", () => {
		render(<Separator />);
		expect(findEl("separator")?.className).toBe(
			"bg-separator shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
		);
	});
	it("Switch", () => {
		render(<Switch />);
		expect(findEl("switch")?.className).toBe(
			"cursor-pointer peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all kala-focus-ring kala-touch disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
		);
	});
	it("AccordionTrigger", () => {
		render(
			<Accordion type="single">
				<AccordionItem value="a">
					<AccordionTrigger>x</AccordionTrigger>
				</AccordionItem>
			</Accordion>,
		);
		expect(findEl("accordion-trigger")?.className).toBe("flex");
	});
	it("TableHead", () => {
		render(
			<Table>
				<thead>
					<TableHead>H</TableHead>
				</thead>
			</Table>,
		);
		expect(document.body.querySelector("th")?.className).toBe(
			"text-muted-foreground h-10 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wider whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
		);
	});
	it("Avatar", () => {
		render(
			<Avatar>
				<AvatarFallback>A</AvatarFallback>
			</Avatar>,
		);
		expect(document.body.querySelector('[data-slot="avatar"]')?.className).toBe(
			"relative flex shrink-0 items-center justify-center size-10 text-sm rounded-full",
		);
	});
	it("Kbd", () => {
		render(<Kbd>⌘</Kbd>);
		expect(findEl("kbd")?.className).toBe(
			"inline-flex items-center justify-center font-mono font-medium rounded border border-b-2 bg-muted text-muted-foreground shadow-sm select-none text-xs px-1.5 py-0.5 min-w-[1.5rem] h-6",
		);
	});
});

describe("excluded families tolerate slotStyles", () => {
	it("ThemeProvider accepts and ignores slotStyles with no DOM leak", async () => {
		const { ThemeProvider } = await import("../components/theme-provider");
		const { container } = render(
			// @ts-expect-error — excluded family: slotStyles must be tolerated
			// (accepted and ignored) even though it is not a typed prop.
			<ThemeProvider slotStyles={{ root: "k-slot-root" }}>
				<span>x</span>
			</ThemeProvider>,
		);
		expect(container.innerHTML).not.toContain("slotStyles");
	});
});

// Byte-stable baselines: with slotStyles absent these literals are the exact
// (or containing) class strings the families rendered before the rollout —
// the regression guard for "absent slotStyles, output unchanged".
const BASELINES: Record<string, string> = {
	skeleton: "bg-muted dark:bg-muted/70 rounded-md animate-pulse",
	box: "",
	text: "text-foreground",
	flex: "flex",
};

describe("absent slotStyles baselines", () => {
	it("pagination-item renders the pre-rollout class string", () => {
		const { unmount } = render(
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>,
		);
		expect(findEl("pagination-item")?.className).toBe("");
		unmount();
	});

	it.each(Object.entries(BASELINES))("%s renders the pre-rollout class string", (marker, expected) => {
		const row = rows.find((r) => r.marker === marker);
		if (!row) throw new Error(`missing row for ${marker}`);
		const { unmount } = render(row.render({}));
		const el = findEl(marker);
		expect(el).not.toBeNull();
		if (expected === "") {
			expect(el?.className).toBe("");
		} else {
			expect(` ${el?.className} `).toContain(` ${expected} `);
		}
		unmount();
	});
});
