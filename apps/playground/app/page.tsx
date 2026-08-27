"use client";

/**
 * Client registry: renders EVERY component from the package barrel in one
 * page. `next build` prerenders it, so every component must survive SSR
 * through the published package exports. Function props (renderers,
 * handlers) are allowed here because the page is a client component.
 */

import * as React from "react";
import {
	// primitives
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AppShell,
	AspectRatio,
	Avatar,
	AvatarFallback,
	AvatarGroup,
	Badge,
	Banner,
	Breadcrumbs,
	Box,
	Burger,
	Button,
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	Calendar,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardSubtitle,
	CardTitle,
	Center,
	Chart,
	AreaChart,
	BarChart,
	DonutChart,
	LineChart,
	RadialBarChart,
	Checkbox,
	Code,
	Collapse,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	ColorInput,
	Combobox,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Container,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	CopyButton,
	DataTable,
	DatePicker,
	DateRangePicker,
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DragDropContext,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	EmptyState,
	ErrorBoundary,
	Field,
	FieldControl,
	FieldDescription,
	FieldError,
	FieldLabel,
	FileUpload,
	Flex,
	Footer,
	Grid,
	GridItem,
	Group,
	Header,
	Heading,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Indicator,
	Input,
	InputGroup,
	InputGroupText,
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
	Kbd,
	Label,
	List,
	ListItem,
	ListItemAvatar,
	ListItemBadge,
	ListItemContent,
	ListItemIcon,
	ListItemText,
	ListItemTitle,
	LoadingOverlay,
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
	MetricCard,
	MultiSelect,
	NavLink,
	Navigation,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	NavigationSkeleton,
	NativeSelect,
	NativeSelectOption,
	NumberInput,
	Overlay,
	PageLoader,
	PageTransition,
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Paper,
	PasswordStrengthIndicator,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
	ProgressBar,
	ProgressGroup,
	RadioGroup,
	RadioGroupItem,
	Rating,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	RingProgress,
	ScrollArea,
	ScrollBar,
	SectionLoader,
	SegmentedControl,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	SessionCard,
	Sidebar,
	Skeleton,
	SkipToContent,
	Slider,
	SocialLoginButton,
	SocialLoginButtons,
	SparklineChart,
	Spinner,
	Spoiler,
	Stack,
	Steps,
	Switch,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Tag,
	TagInput,
	Text,
	Textarea,
	TimePicker,
	Timeline,
	TimelineItem,
	Toast,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
	Toolbar,
	ToolbarButton,
	ToolbarSeparator,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	TreeView,
	UserMenuDropdown,
	cn,
} from "@kala-ui/react";

type User = {
	id: string;
	name: string;
	email: string;
	role: string;
};

const users: User[] = [
	{ id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "admin" },
	{ id: "2", name: "Alan Turing", email: "alan@example.com", role: "editor" },
];

const userColumns = [
	{ id: "name", header: "Name", accessorKey: "name" as keyof User },
	{ id: "email", header: "Email", accessorKey: "email" as keyof User },
	{ id: "role", header: "Role", accessorKey: "role" as keyof User },
];

const chartSeries = [{ name: "Revenue", data: [31, 40, 28, 51, 42, 109, 100] }];
const chartCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const treeData = [
	{ id: "src", label: "src", children: [{ id: "app", label: "app" }] },
	{ id: "docs", label: "docs" },
];

function Section({
	title,
	children,
	className,
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("flex flex-col gap-4", className)}>
			<Heading level={2}>{title}</Heading>
			<div className="flex flex-wrap items-center gap-4">{children}</div>
		</section>
	);
}

export default function Home() {
	const [otp, setOtp] = React.useState("");

	return (
		<>
			<SkipToContent targetId="main" text="Skip to content" />
			<main id="main" className="mx-auto flex max-w-5xl flex-col gap-12 p-8">
				<header className="flex flex-col gap-2">
					<Badge>Kala UI</Badge>
					<Heading level={1}>Next.js App Router consumer gate</Heading>
					<Text color="muted">
						Every component from the package, server-rendered through the
						published exports with a custom theme.
					</Text>
				</header>

				<Section title="Primitives">
					<Box className="rounded border p-2">Box</Box>
					<Flex gap={2}>
						<Stack gap={1}>Stack</Stack>
					</Flex>
					<Grid gap={2}>
						<GridItem>Grid</GridItem>
					</Grid>
					<Group>Group</Group>
					<Center className="h-10 w-10 rounded bg-muted">C</Center>
					<Container>Container</Container>
					<Paper>Paper</Paper>
					<Separator orientation="vertical" className="h-6" />
					<AspectRatio ratio={16 / 9} className="w-24 rounded bg-muted" />
					<Code>npm install @kala-ui/react</Code>
					<Kbd>⌘</Kbd>
					<Badge variant="subtle">Badge</Badge>
					<Tag>Tag</Tag>
					<Spinner />
					<Skeleton className="h-6 w-24" />
					<Indicator>
						<Avatar>
							<AvatarFallback>KL</AvatarFallback>
						</Avatar>
					</Indicator>
					<AvatarGroup
						avatars={[
							{ fallback: "A", alt: "Ada" },
							{ fallback: "B", alt: "Ben" },
						]}
					/>
					<Breadcrumbs
						items={[
							{ label: "Home", href: "/" },
							{ label: "Library", href: "/library" },
						]}
					/>
					<Rating defaultValue={3.5} allowHalf />
					<CopyButton value="copied text" />
					<ColorInput />
				</Section>

				<Section title="Buttons & toggles">
					<Button>Button</Button>
					<ButtonGroup>
						<Button>One</Button>
						<ButtonGroupSeparator />
						<ButtonGroupText>or</ButtonGroupText>
						<Button>Two</Button>
					</ButtonGroup>
					<Toggle>Toggle</Toggle>
					<ToggleGroup type="single">
						<ToggleGroupItem value="a">A</ToggleGroupItem>
						<ToggleGroupItem value="b">B</ToggleGroupItem>
					</ToggleGroup>
					<Burger />
					<SegmentedControl data={["Day", "Week", "Month"]} />
					<SocialLoginButton provider="google" />
					<SocialLoginButtons providers={["google", "github"]} onProviderClick={() => {}} />
				</Section>

				<Section title="Forms">
					<Field>
						<FieldLabel>Email</FieldLabel>
						<FieldControl>
							<Input type="email" placeholder="you@example.com" />
						</FieldControl>
						<FieldDescription>We never share your email.</FieldDescription>
						<FieldError>Invalid email address.</FieldError>
					</Field>
					<Textarea placeholder="Textarea" />
					<NumberInput defaultValue={5} step={2} />
					<InputGroup>
						<InputGroupText>@</InputGroupText>
						<Input placeholder="username" />
					</InputGroup>
					<InputOTP maxLength={6} value={otp} onChange={setOtp}>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSeparator />
							<InputOTPSlot index={1} />
						</InputOTPGroup>
					</InputOTP>
					<Label>Label</Label>
					<Checkbox aria-label="Checkbox" />
					<RadioGroup defaultValue="a">
						<RadioGroupItem value="a" label="Option A" />
						<RadioGroupItem value="b" label="Option B" />
					</RadioGroup>
					<Switch aria-label="Switch" />
					<Slider defaultValue={[40]} max={100} />
					<NativeSelect aria-label="Native select">
						<NativeSelectOption value="a">Option A</NativeSelectOption>
					</NativeSelect>
					<Select>
						<SelectTrigger aria-label="Select">
							<SelectValue placeholder="Select…" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="a">Option A</SelectItem>
						</SelectContent>
					</Select>
					<Combobox
						options={[
							{ value: "a", label: "Option A" },
							{ value: "b", label: "Option B" },
						]}
						placeholder="Combobox"
					/>
					<MultiSelect
						options={[
							{ value: "a", label: "Option A" },
							{ value: "b", label: "Option B" },
						]}
						placeholder="MultiSelect"
					/>
					<TagInput defaultValue={["alpha", "beta"]} placeholder="Tags" />
					<DatePicker />
					<DateRangePicker />
					<Calendar />
					<TimePicker />
					<FileUpload />
					<PasswordStrengthIndicator password="correct-horse-battery" />
				</Section>

				<Section title="Cards & data display">
					<Card className="w-72">
						<CardHeader>
							<CardTitle>Card title</CardTitle>
							<CardSubtitle>Card subtitle</CardSubtitle>
							<CardAction>
								<Badge>Action</Badge>
							</CardAction>
						</CardHeader>
						<CardContent>
							<CardDescription>Card description goes here.</CardDescription>
						</CardContent>
						<CardFooter>
							<Button size="sm">Footer</Button>
						</CardFooter>
					</Card>
					<MetricCard title="Revenue" value="$48.2k" change={12.4} />
					<Table className="w-72">
						<TableCaption>Users</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Role</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.role}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={2}>2 users</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
					<DataTable data={users} columns={userColumns} />
					<List className="w-72">
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<AvatarFallback>A</AvatarFallback>
								</Avatar>
							</ListItemAvatar>
							<ListItemContent>
								<ListItemTitle>Ada Lovelace</ListItemTitle>
								<ListItemText>Admin</ListItemText>
							</ListItemContent>
							<ListItemIcon>→</ListItemIcon>
							<ListItemBadge>
								<Badge>active</Badge>
							</ListItemBadge>
						</ListItem>
					</List>
					<Steps
						value={1}
						items={[
							{ title: "Account" },
							{ title: "Profile" },
							{ title: "Done" },
						]}
					/>
					<Timeline>
						<TimelineItem title="Created" status="success" />
						<TimelineItem title="Shipping" status="default" />
						<TimelineItem title="Delivered" status="pending" />
					</Timeline>
					<Accordion type="single">
						<AccordionItem value="a">
							<AccordionTrigger>Accordion</AccordionTrigger>
							<AccordionContent>Accordion content</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Collapsible>
						<CollapsibleTrigger>Collapsible</CollapsibleTrigger>
						<CollapsibleContent>Collapsible content</CollapsibleContent>
					</Collapsible>
					<Collapse in>Collapsed content shown</Collapse>
					<Spoiler maxHeight={40}>Spoilable content</Spoiler>
					<EmptyState title="Nothing here" description="Empty state" />
					<Progress value={60} />
					<ProgressBar value={45} />
					<ProgressGroup>
						<ProgressBar value={30} label="A" />
						<ProgressBar value={70} label="B" />
					</ProgressGroup>
					<RingProgress value={62} />
					<ScrollArea className="h-24 w-40 rounded border">
						ScrollArea
					</ScrollArea>
					<ResizablePanelGroup orientation="horizontal" className="w-64">
						<ResizablePanel>One</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel>Two</ResizablePanel>
					</ResizablePanelGroup>
				</Section>

				<Section title="Charts" className="flex-wrap">
					<Chart
						type="bar"
						series={chartSeries}
						options={{ xaxis: { categories: chartCategories } }}
						height={180}
						className="w-64"
					/>
					<AreaChart
						series={chartSeries}
						categories={chartCategories}
						height={180}
						className="w-64"
					/>
					<BarChart
						series={chartSeries}
						categories={chartCategories}
						height={180}
						className="w-64"
					/>
					<LineChart
						series={chartSeries}
						categories={chartCategories}
						height={180}
						className="w-64"
					/>
					<DonutChart series={[44, 56]} labels={["A", "B"]} height={180} />
					<RadialBarChart series={[70]} labels={["A"]} height={180} />
					<SparklineChart data={[1, 4, 2, 7, 5, 9]} />
				</Section>

				<Section title="Overlays & feedback">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">Dialog</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Dialog title</DialogTitle>
								<DialogDescription>
									Dialog description
								</DialogDescription>
							</DialogHeader>
							<DialogBody>Dialog body</DialogBody>
							<DialogFooter>
								<DialogClose asChild>
									<Button>Close</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="outline">Alert dialog</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete?</AlertDialogTitle>
								<AlertDialogDescription>
									This cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction>Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Drawer>
						<DrawerTrigger asChild>
							<Button variant="outline">Drawer</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Drawer title</DrawerTitle>
								<DrawerDescription>Drawer description</DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<DrawerClose asChild>
									<Button>Close</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Dropdown</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Item</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<ContextMenu>
						<ContextMenuTrigger className="rounded border p-2">
							Right-click me
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>Item</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
					<HoverCard>
						<HoverCardTrigger>Hover</HoverCardTrigger>
						<HoverCardContent>Hover content</HoverCardContent>
					</HoverCard>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline">Popover</Button>
						</PopoverTrigger>
						<PopoverContent>Popover content</PopoverContent>
					</Popover>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>Tooltip</TooltipTrigger>
							<TooltipContent>Tooltip content</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>File</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>Open</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Learn</NavigationMenuTrigger>
								<NavigationMenuContent>Content</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
						<NavigationMenuViewport />
					</NavigationMenu>
					<Command className="w-64 rounded border">
						<CommandInput placeholder="Command…" />
						<CommandList>
							<CommandEmpty>No results.</CommandEmpty>
							<CommandGroup>
								<CommandItem>Item</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
					<Overlay>Overlay</Overlay>
					<LoadingOverlay visible={false}>Loading</LoadingOverlay>
					<PageLoader message="Loading…" />
					<SectionLoader message="Loading section…" />
					<Banner>Banner message</Banner>
					<Toast position="top-right" />
				</Section>

				<Section title="Navigation & layout">
					<Navigation
						links={[
							{ label: "Home", href: "/" },
							{ label: "Server", href: "/server" },
						]}
						pathname="/"
					/>
					<NavigationSkeleton />
					<Sidebar
						navSections={[{ title: "Main", links: [{ label: "Home", href: "/" }] }]}
						pathname="/"
					/>
					<Header navLinks={[{ label: "Home", href: "/" }]} />
					<NavLink label="Home" active />
					<Footer
						linkSections={[
							{ title: "Product", links: [{ label: "Features", href: "/" }] },
						]}
						copyright="© Kala UI"
					/>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious href="#" />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#" isActive>
									1
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext href="#" />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
					<Toolbar>
						<ToolbarButton>Bold</ToolbarButton>
						<ToolbarSeparator />
						<ToolbarButton>Italic</ToolbarButton>
					</Toolbar>
					<UserMenuDropdown user={{ name: "Ada", email: "ada@example.com" }} />
					<SessionCard
						session={{
							id: "s1",
							device: "Desktop",
							browser: "Chrome",
							os: "macOS",
							location: "Berlin, DE",
							ip: "203.0.113.1",
							lastActiveAt: "2026-08-27T10:00:00Z",
							createdAt: "2026-01-01T00:00:00Z",
							isCurrent: true,
						}}
					/>
					<Tabs defaultValue="a">
						<TabsList>
							<TabsTrigger value="a">Tab A</TabsTrigger>
							<TabsTrigger value="b">Tab B</TabsTrigger>
						</TabsList>
						<TabsContent value="a">Content A</TabsContent>
						<TabsContent value="b">Content B</TabsContent>
					</Tabs>
					<TreeView data={treeData} />
					<ErrorBoundary>
						<Badge>Boundary child</Badge>
					</ErrorBoundary>
					<PageTransition>
						<Text>Transitioned</Text>
					</PageTransition>
					<AppShell header={{ height: 56 }} footer={{ height: 40 }}>
						<AppShell.Main className="rounded border p-4">
							AppShell main
						</AppShell.Main>
					</AppShell>
					<DragDropContext onDragEnd={() => {}}>
						<div className="rounded border p-2">DnD context</div>
					</DragDropContext>
				</Section>
			</main>
		</>
	);
}
