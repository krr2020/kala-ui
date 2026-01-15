import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, Copy, Search, User } from "lucide-react";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Skeleton } from "../skeleton/skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../dropdown-menu";
import { Input } from "../input";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../select";
import { Textarea } from "../textarea";
import { InputGroup, InputGroupText } from "./input-group";

const meta: Meta<typeof InputGroup> = {
	title: "Forms/InputGroup",
	component: InputGroup,
	tags: ["autodocs"],
	argTypes: {
		className: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
	render: () => (
		<div className="space-y-4 p-4">
			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">
					Text Addons
				</h3>
				<InputGroup>
					<InputGroupText>@</InputGroupText>
					<Input placeholder="Username" />
				</InputGroup>

				<InputGroup>
					<Input placeholder="Recipient's username" />
					<InputGroupText>@example.com</InputGroupText>
				</InputGroup>

				<InputGroup>
					<InputGroupText>$</InputGroupText>
					<Input placeholder="Amount" type="number" />
					<InputGroupText>.00</InputGroupText>
				</InputGroup>
			</div>

			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">
					Multiple Inputs
				</h3>
				<InputGroup>
					<InputGroupText>Name</InputGroupText>
					<Input placeholder="First Name" />
					<Input placeholder="Last Name" />
				</InputGroup>
			</div>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<div className="space-y-4 p-4">
			<InputGroup>
				<InputGroupText>
					<User className="h-4 w-4" />
				</InputGroupText>
				<Input placeholder="Username" />
			</InputGroup>

			<InputGroup>
				<Input placeholder="Search..." />
				<InputGroupText className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
					<Search className="h-4 w-4" />
				</InputGroupText>
			</InputGroup>
		</div>
	),
};

export const WithControls: Story = {
	render: () => (
		<div className="space-y-4 p-4">
			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">Checkbox</h3>
				<InputGroup>
					<InputGroupText>
						<Checkbox id="terms" />
					</InputGroupText>
					<Input placeholder="Input with checkbox" />
				</InputGroup>
			</div>

			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">Radio</h3>
				<InputGroup>
					<InputGroupText>
						<RadioGroup defaultValue="radio-example" name="radio-example">
							<RadioGroupItem value="radio-example" />
						</RadioGroup>
					</InputGroupText>
					<Input placeholder="Input with radio" />
				</InputGroup>
			</div>
		</div>
	),
};

export const WithButtons: Story = {
	render: () => (
		<div className="space-y-4 p-4">
			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">
					Button Addons
				</h3>
				<InputGroup>
					<Input placeholder="Search..." />
					<Button variant="outline" className="rounded-l-none border-l-0">
						<Search className="h-4 w-4" />
					</Button>
				</InputGroup>

				<InputGroup>
					<Input
						placeholder="Copy this text"
						defaultValue="https://example.com"
						readOnly
					/>
					<Button variant="outline" className="rounded-l-none border-l-0">
						<Copy className="h-4 w-4" />
						<span className="sr-only">Copy</span>
					</Button>
				</InputGroup>

				<InputGroup>
					<Button variant="outline" className="rounded-r-none border-r-0">
						Action
					</Button>
					<Input placeholder="Input with button start" />
				</InputGroup>
			</div>
		</div>
	),
};

export const WithSelect: Story = {
	render: () => (
		<div className="space-y-4 p-4">
			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">
					Select Addon
				</h3>
				<InputGroup>
					<Select defaultValue="http">
						<SelectTrigger className="w-[100px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0">
							<SelectValue placeholder="Protocol" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="http">http://</SelectItem>
							<SelectItem value="https">https://</SelectItem>
							<SelectItem value="ftp">ftp://</SelectItem>
						</SelectContent>
					</Select>
					<Input placeholder="example.com" />
				</InputGroup>
			</div>
		</div>
	),
};

export const WithDropdown: Story = {
	render: () => (
		<div className="space-y-4 p-4">
			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">
					Dropdown Addon
				</h3>
				<InputGroup>
					<Input placeholder="Search in..." />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="rounded-l-none border-l-0 px-3"
							>
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>All</DropdownMenuItem>
							<DropdownMenuItem>Products</DropdownMenuItem>
							<DropdownMenuItem>Users</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</InputGroup>
			</div>
		</div>
	),
};

export const WithTextarea: Story = {
	render: () => (
		<div className="space-y-4 p-4">
			<div className="grid gap-2">
				<h3 className="text-sm font-medium text-muted-foreground">
					Textarea with Actions
				</h3>
				<div className="flex flex-col rounded-md border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary theme-input">
					<Textarea
						placeholder="Type your message..."
						className="min-h-[100px] resize-none border-0 focus:ring-0 focus:ring-offset-0"
					/>
					<div className="flex items-center justify-between border-t border bg-muted/50 p-2">
						<span className="text-xs text-muted-foreground">0/500</span>
						<Button size="sm" className="h-8">
							Send
						</Button>
					</div>
				</div>
			</div>
		</div>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for input groups while loading.",
			},
		},
	},
};