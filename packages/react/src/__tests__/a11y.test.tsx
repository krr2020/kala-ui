/**
 * Automated accessibility sweep: every kala-ui core component rendered in a
 * minimal realistic composition and checked with axe-core.
 *
 * When adding a component to this package, add a case here. A failure means
 * the default markup violates WCAG (axe's ruleset) — fix the component,
 * not the test.
 */
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { toHaveNoViolations } from "vitest-axe/matchers";
import * as K from "../index";

expect.extend({ toHaveNoViolations });

const cases: Array<[string, () => ReactElement]> = [
	[
		"Accordion",
		() => (
			<K.Accordion type="single">
				<K.AccordionItem value="a">
					<K.AccordionTrigger>Section</K.AccordionTrigger>
					<K.AccordionContent>Content</K.AccordionContent>
				</K.AccordionItem>
			</K.Accordion>
		),
	],
	[
		"Alert",
		() => (
			<K.Alert>
				<K.AlertTitle>Heads up</K.AlertTitle>
				<K.AlertDescription>Something happened.</K.AlertDescription>
			</K.Alert>
		),
	],
	[
		"AlertDialog",
		() => (
			<K.AlertDialog open>
				<K.AlertDialogContent>
					<K.AlertDialogTitle>Confirm</K.AlertDialogTitle>
					<K.AlertDialogDescription>Are you sure?</K.AlertDialogDescription>
					<K.AlertDialogCancel>Cancel</K.AlertDialogCancel>
					<K.AlertDialogAction>Continue</K.AlertDialogAction>
				</K.AlertDialogContent>
			</K.AlertDialog>
		),
	],
	["AspectRatio", () => <K.AspectRatio ratio={16 / 9}>media</K.AspectRatio>],
	[
		"Avatar",
		() => (
			<K.Avatar>
				<K.AvatarImage src="x.jpg" alt="Jane Doe" />
				<K.AvatarFallback>JD</K.AvatarFallback>
			</K.Avatar>
		),
	],
	[
		"AvatarGroup",
		() => <K.AvatarGroup avatars={[{ fallback: "A" }, { fallback: "B" }]} />,
	],
	["Badge", () => <K.Badge>Badge</K.Badge>],
	["Banner", () => <K.Banner color="info">Maintenance at midnight</K.Banner>],
	["Box", () => <K.Box>box</K.Box>],
	[
		"Breadcrumbs",
		() => (
			<K.Breadcrumbs
				items={[
					{ label: "Home", href: "/" },
					{ label: "Settings", href: "/settings" },
				]}
			/>
		),
	],
	["Burger", () => <K.Burger aria-label="Toggle menu" />],
	["Button", () => <K.Button>Save</K.Button>],
	[
		"ButtonGroup",
		() => (
			<K.ButtonGroup>
				<K.Button>One</K.Button>
				<K.Button>Two</K.Button>
			</K.ButtonGroup>
		),
	],
	["Calendar", () => <K.Calendar aria-label="Date picker" />],
	[
		"Card",
		() => (
			<K.Card>
				<K.CardHeader>
					<K.CardTitle>Title</K.CardTitle>
					<K.CardDescription>Description</K.CardDescription>
				</K.CardHeader>
				<K.CardContent>Body</K.CardContent>
			</K.Card>
		),
	],
	["Center", () => <K.Center>centered</K.Center>],
	["Checkbox", () => <K.Checkbox aria-label="Accept terms" />],
	["Collapse", () => <K.Collapse>collapsed content</K.Collapse>],
	[
		"Collapsible",
		() => (
			<K.Collapsible>
				<K.CollapsibleTrigger>Toggle</K.CollapsibleTrigger>
				<K.CollapsibleContent>Hidden</K.CollapsibleContent>
			</K.Collapsible>
		),
	],
	["ColorInput", () => <K.ColorInput aria-label="Pick a color" />],
	[
		"Combobox",
		() => (
			<K.Combobox
				options={[
					{ value: "a", label: "Option A" },
					{ value: "b", label: "Option B" },
				]}
			/>
		),
	],
	[
		"Command",
		() => (
			<K.Command>
				<K.CommandInput placeholder="Search…" />
				<K.CommandList>
					<K.CommandEmpty>No results.</K.CommandEmpty>
					<K.CommandGroup heading="Suggestions">
						<K.CommandItem>Item one</K.CommandItem>
					</K.CommandGroup>
				</K.CommandList>
			</K.Command>
		),
	],
	["Container", () => <K.Container>content</K.Container>],
	[
		"ContextMenu",
		() => (
			<K.ContextMenu>
				<K.ContextMenuTrigger>Right click me</K.ContextMenuTrigger>
				<K.ContextMenuContent>
					<K.ContextMenuItem>Back</K.ContextMenuItem>
				</K.ContextMenuContent>
			</K.ContextMenu>
		),
	],
	["CopyButton", () => <K.CopyButton value="text" />],
	["DatePicker", () => <K.DatePicker aria-label="Pick a date" />],
	[
		"Dialog",
		() => (
			<K.Dialog open>
				<K.DialogContent>
					<K.DialogTitle>Dialog</K.DialogTitle>
					<K.DialogDescription>Description</K.DialogDescription>
				</K.DialogContent>
			</K.Dialog>
		),
	],
	[
		"Drawer",
		() => (
			<K.Drawer open>
				<K.DrawerContent>
					<K.DrawerTitle>Drawer</K.DrawerTitle>
					<K.DrawerDescription>Description</K.DrawerDescription>
				</K.DrawerContent>
			</K.Drawer>
		),
	],
	[
		"DropdownMenu",
		() => (
			<K.DropdownMenu>
				<K.DropdownMenuTrigger>Open</K.DropdownMenuTrigger>
				<K.DropdownMenuContent>
					<K.DropdownMenuItem>Item</K.DropdownMenuItem>
				</K.DropdownMenuContent>
			</K.DropdownMenu>
		),
	],
	[
		"EmptyState",
		() => (
			<K.EmptyState
				title="Nothing here"
				description="No items yet"
				actions={[{ label: "Create one", onClick: () => {} }]}
			/>
		),
	],
	["Field", () => <K.Field />],
	[
		"Field composition",
		() => (
			<K.Field>
				<K.FieldLabel>Email</K.FieldLabel>
				<K.FieldControl>
					<K.Input type="email" />
				</K.FieldControl>
				<K.FieldDescription>We never share it.</K.FieldDescription>
			</K.Field>
		),
	],
	["FileUpload", () => <K.FileUpload onFileSelect={() => {}} />],
	["Flex", () => <K.Flex>flex</K.Flex>],
	["Grid", () => <K.Grid>grid</K.Grid>],
	["Heading", () => <K.Heading level={2}>Heading</K.Heading>],
	[
		"HoverCard",
		() => (
			<K.HoverCard>
				<K.HoverCardTrigger>
					<a href="/">Hover me</a>
				</K.HoverCardTrigger>
				<K.HoverCardContent>Card</K.HoverCardContent>
			</K.HoverCard>
		),
	],
	[
		"Indicator",
		() => (
			<K.Indicator>
				<K.Badge>4</K.Badge>
			</K.Indicator>
		),
	],
	["Input", () => <K.Input aria-label="Name" />],
	[
		"InputGroup",
		() => (
			<K.InputGroup aria-label="Search fields">
				<K.Input aria-label="Search term" />
			</K.InputGroup>
		),
	],
	["InputOTP", () => <K.InputOTP aria-label="One-time code" maxLength={6} />],
	["Kbd", () => <K.Kbd>⌘K</K.Kbd>],
	["Label", () => <K.Label>Label</K.Label>],
	[
		"List",
		() => (
			<K.List>
				<K.ListItem>
					<K.ListItemContent>
						<K.ListItemTitle>Title</K.ListItemTitle>
						<K.ListItemText>Text</K.ListItemText>
					</K.ListItemContent>
				</K.ListItem>
			</K.List>
		),
	],
	["PageLoader", () => <K.PageLoader />],
	["LoadingOverlay", () => <K.LoadingOverlay />],
	[
		"Menubar",
		() => (
			<K.Menubar>
				<K.MenubarMenu>
					<K.MenubarTrigger>File</K.MenubarTrigger>
					<K.MenubarContent>
						<K.MenubarItem>New</K.MenubarItem>
					</K.MenubarContent>
				</K.MenubarMenu>
			</K.Menubar>
		),
	],
	[
		"MultiSelect",
		() => (
			<K.MultiSelect
				options={[
					{ value: "a", label: "Option A" },
					{ value: "b", label: "Option B" },
				]}
			/>
		),
	],
	[
		"NavigationMenu",
		() => (
			<K.NavigationMenu>
				<K.NavigationMenuList>
					<K.NavigationMenuItem>
						<K.NavigationMenuLink href="/">Home</K.NavigationMenuLink>
					</K.NavigationMenuItem>
				</K.NavigationMenuList>
			</K.NavigationMenu>
		),
	],
	["NumberInput", () => <K.NumberInput aria-label="Quantity" />],
	["Overlay", () => <K.Overlay />],
	["PageTransition", () => <K.PageTransition>page</K.PageTransition>],
	[
		"Pagination",
		() => (
			<K.Pagination>
				<K.PaginationContent>
					<K.PaginationItem>
						<K.PaginationPrevious href="#" />
					</K.PaginationItem>
					<K.PaginationItem>
						<K.PaginationLink href="#" isActive>
							1
						</K.PaginationLink>
					</K.PaginationItem>
					<K.PaginationItem>
						<K.PaginationNext href="#" />
					</K.PaginationItem>
				</K.PaginationContent>
			</K.Pagination>
		),
	],
	["Paper", () => <K.Paper>paper</K.Paper>],
	[
		"PasswordStrengthIndicator",
		() => <K.PasswordStrengthIndicator password="Str0ng!pw" />,
	],
	[
		"Popover",
		() => (
			<K.Popover>
				<K.PopoverTrigger>Open</K.PopoverTrigger>
				<K.PopoverContent>Popover body</K.PopoverContent>
			</K.Popover>
		),
	],
	["Progress", () => <K.Progress value={42} aria-label="Loading" />],
	[
		"RadioGroup",
		() => (
			<K.RadioGroup aria-label="Plan">
				<K.RadioGroupItem value="free" label="Free" />
				<K.RadioGroupItem value="pro" label="Pro" />
			</K.RadioGroup>
		),
	],
	["Rating", () => <K.Rating defaultValue={3} />],
	[
		"Resizable",
		() => (
			<K.ResizablePanelGroup direction="horizontal">
				<K.ResizablePanel defaultSize={50}>One</K.ResizablePanel>
				<K.ResizableHandle />
				<K.ResizablePanel defaultSize={50}>Two</K.ResizablePanel>
			</K.ResizablePanelGroup>
		),
	],
	["RingProgress", () => <K.RingProgress value={60} aria-label="Progress" />],
	["ScrollArea", () => <K.ScrollArea>scrollable</K.ScrollArea>],
	[
		"SegmentedControl",
		() => (
			<K.SegmentedControl aria-label="View" data={["Day", "Week", "Month"]} />
		),
	],
	[
		"Select",
		() => (
			<K.Select>
				<K.SelectTrigger aria-label="Fruit">
					<K.SelectValue placeholder="Pick a fruit" />
				</K.SelectTrigger>
				<K.SelectContent>
					<K.SelectItem value="apple">Apple</K.SelectItem>
				</K.SelectContent>
			</K.Select>
		),
	],
	["Separator", () => <K.Separator />],
	["Skeleton", () => <K.Skeleton />],
	["SkipToContent", () => <K.SkipToContent />],
	["Slider", () => <K.Slider aria-label="Volume" defaultValue={[50]} />],
	["Spinner", () => <K.Spinner />],
	[
		"Spoiler",
		() => (
			<K.Spoiler>
				Lorem ipsum dolor sit amet consectetur adipiscing elit sed do.
			</K.Spoiler>
		),
	],
	["Stack", () => <K.Stack>stack</K.Stack>],
	[
		"Steps",
		() => (
			<K.Steps
				currentStep={2}
				items={[{ title: "Cart" }, { title: "Payment" }, { title: "Done" }]}
			/>
		),
	],
	["Switch", () => <K.Switch aria-label="Notifications" />],
	[
		"Table",
		() => (
			<K.Table>
				<K.TableCaption>Users</K.TableCaption>
				<K.TableHeader>
					<K.TableRow>
						<K.TableHead>Name</K.TableHead>
					</K.TableRow>
				</K.TableHeader>
				<K.TableBody>
					<K.TableRow>
						<K.TableCell>Ada</K.TableCell>
					</K.TableRow>
				</K.TableBody>
			</K.Table>
		),
	],
	[
		"Tabs",
		() => (
			<K.Tabs defaultValue="one">
				<K.TabsList>
					<K.TabsTrigger value="one">One</K.TabsTrigger>
					<K.TabsTrigger value="two">Two</K.TabsTrigger>
				</K.TabsList>
				<K.TabsContent value="one">First</K.TabsContent>
			</K.Tabs>
		),
	],
	["Tag", () => <K.Tag>tag</K.Tag>],
	["TagInput", () => <K.TagInput value={["alpha"]} onChange={() => {}} />],
	["Text", () => <K.Text>text</K.Text>],
	["Textarea", () => <K.Textarea aria-label="Bio" />],
	["TimePicker", () => <K.TimePicker aria-label="Pick a time" />],
	[
		"Timeline",
		() => (
			<K.Timeline
				items={[
					{ title: "Created", description: "Just now" },
					{ title: "Approved", description: "Yesterday" },
				]}
			/>
		),
	],
	["Toast (Toaster)", () => <K.Toast />],
	["Toggle", () => <K.Toggle aria-label="Bold">B</K.Toggle>],
	[
		"ToggleGroup",
		() => (
			<K.ToggleGroup type="single">
				<K.ToggleGroupItem value="b">B</K.ToggleGroupItem>
			</K.ToggleGroup>
		),
	],
	[
		"Toolbar",
		() => (
			<K.Toolbar aria-label="Formatting">
				<K.ToolbarButton>Bold</K.ToolbarButton>
			</K.Toolbar>
		),
	],
	[
		"Tooltip",
		() => (
			<K.TooltipProvider>
				<K.Tooltip>
					<K.TooltipTrigger asChild>
						<K.Button variant="outline">Hover</K.Button>
					</K.TooltipTrigger>
					<K.TooltipContent>Tooltip text</K.TooltipContent>
				</K.Tooltip>
			</K.TooltipProvider>
		),
	],
	[
		"TreeView",
		() => (
			<K.TreeView
				aria-label="Files"
				data={[
					{
						id: "1",
						label: "Documents",
						children: [{ id: "1-1", label: "Resume.pdf" }],
					},
					{ id: "2", label: "Notes.txt" },
				]}
			/>
		),
	],
	[
		"ThemeProvider",
		() => (
			<K.ThemeProvider>
				<div>themed</div>
			</K.ThemeProvider>
		),
	],
];

describe("axe accessibility sweep", () => {
	for (const [name, renderCase] of cases) {
		it(`${name} has no axe violations`, async () => {
			const { container } = render(renderCase());
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	}
});
