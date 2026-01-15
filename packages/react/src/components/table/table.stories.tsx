import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Skeleton } from "../skeleton/skeleton";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";
import { TableSkeleton } from "./table-skeleton";

const meta = {
	title: "Data Display/Table",
	component: Table,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic table example
 */
export const Default: Story = {
	args: {},
	render: () => (
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Method</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell className="font-medium">INV001</TableCell>
					<TableCell>Paid</TableCell>
					<TableCell>Credit Card</TableCell>
					<TableCell className="text-right">$250.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className="font-medium">INV002</TableCell>
					<TableCell>Pending</TableCell>
					<TableCell>PayPal</TableCell>
					<TableCell className="text-right">$150.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className="font-medium">INV003</TableCell>
					<TableCell>Unpaid</TableCell>
					<TableCell>Bank Transfer</TableCell>
					<TableCell className="text-right">$350.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className="font-medium">INV004</TableCell>
					<TableCell>Paid</TableCell>
					<TableCell>Credit Card</TableCell>
					<TableCell className="text-right">$450.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className="font-medium">INV005</TableCell>
					<TableCell>Paid</TableCell>
					<TableCell>PayPal</TableCell>
					<TableCell className="text-right">$550.00</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};

/**
 * Table with footer for totals
 */
export const WithFooter: Story = {
	args: {},
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Product</TableHead>
					<TableHead>Quantity</TableHead>
					<TableHead className="text-right">Price</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>Item 1</TableCell>
					<TableCell>2</TableCell>
					<TableCell className="text-right">$100.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Item 2</TableCell>
					<TableCell>1</TableCell>
					<TableCell className="text-right">$50.00</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Item 3</TableCell>
					<TableCell>3</TableCell>
					<TableCell className="text-right">$75.00</TableCell>
				</TableRow>
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={2}>Total</TableCell>
					<TableCell className="text-right font-semibold">$225.00</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	),
};

/**
 * Striped rows for better readability
 */
export const Striped: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead className="text-right">Salary</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[
					{
						name: "Alice Johnson",
						email: "alice@example.com",
						role: "Manager",
						salary: "$85,000",
					},
					{
						name: "Bob Smith",
						email: "bob@example.com",
						role: "Developer",
						salary: "$75,000",
					},
					{
						name: "Carol White",
						email: "carol@example.com",
						role: "Designer",
						salary: "$70,000",
					},
					{
						name: "David Brown",
						email: "david@example.com",
						role: "Developer",
						salary: "$72,000",
					},
					{
						name: "Eve Davis",
						email: "eve@example.com",
						role: "Manager",
						salary: "$90,000",
					},
				].map((person, idx) => (
					<TableRow
						key={person.email}
						className={idx % 2 === 0 ? "bg-muted/50" : ""}
					>
						<TableCell className="font-medium">{person.name}</TableCell>
						<TableCell>{person.email}</TableCell>
						<TableCell>{person.role}</TableCell>
						<TableCell className="text-right">{person.salary}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

/**
 * Bordered table with all cells having borders
 */
export const Bordered: Story = {
	render: () => (
		<Table className="border-collapse [&_td]:border [&_th]:border">
			<TableHeader>
				<TableRow>
					<TableHead>#</TableHead>
					<TableHead>First Name</TableHead>
					<TableHead>Last Name</TableHead>
					<TableHead>Username</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>1</TableCell>
					<TableCell>Mark</TableCell>
					<TableCell>Otto</TableCell>
					<TableCell>@mdo</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>2</TableCell>
					<TableCell>Jacob</TableCell>
					<TableCell>Thornton</TableCell>
					<TableCell>@fat</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>3</TableCell>
					<TableCell>Larry</TableCell>
					<TableCell>Bird</TableCell>
					<TableCell>@twitter</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};

/**
 * Borderless table - clean minimal look
 */
export const Borderless: Story = {
	render: () => (
		<Table className="[&_tr]:border-0">
			<TableHeader>
				<TableRow>
					<TableHead>#</TableHead>
					<TableHead>First Name</TableHead>
					<TableHead>Last Name</TableHead>
					<TableHead>Username</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>1</TableCell>
					<TableCell>Mark</TableCell>
					<TableCell>Otto</TableCell>
					<TableCell>@mdo</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>2</TableCell>
					<TableCell>Jacob</TableCell>
					<TableCell>Thornton</TableCell>
					<TableCell>@fat</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>3</TableCell>
					<TableCell>Larry</TableCell>
					<TableCell>Bird</TableCell>
					<TableCell>@twitter</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};

/**
 * Small/Compact table with reduced padding
 */
export const Small: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="py-2">#</TableHead>
					<TableHead className="py-2">First Name</TableHead>
					<TableHead className="py-2">Last Name</TableHead>
					<TableHead className="py-2">Username</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[
					{ id: 1, first: "Mark", last: "Otto", username: "@mdo" },
					{ id: 2, first: "Jacob", last: "Thornton", username: "@fat" },
					{ id: 3, first: "Larry", last: "Bird", username: "@twitter" },
				].map((row) => (
					<TableRow key={row.id}>
						<TableCell className="py-2">{row.id}</TableCell>
						<TableCell className="py-2">{row.first}</TableCell>
						<TableCell className="py-2">{row.last}</TableCell>
						<TableCell className="py-2">{row.username}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

/**
 * Table with contextual classes for row states
 */
export const ContextualRows: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Progress</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>Default Row</TableCell>
					<TableCell>Normal</TableCell>
					<TableCell>50%</TableCell>
				</TableRow>
				<TableRow className="bg-primary/10">
					<TableCell>Primary Row</TableCell>
					<TableCell>Active</TableCell>
					<TableCell>100%</TableCell>
				</TableRow>
				<TableRow className="bg-success/10">
					<TableCell>Success Row</TableCell>
					<TableCell>Completed</TableCell>
					<TableCell>100%</TableCell>
				</TableRow>
				<TableRow className="bg-warning/10">
					<TableCell>Warning Row</TableCell>
					<TableCell>Pending</TableCell>
					<TableCell>75%</TableCell>
				</TableRow>
				<TableRow className="bg-destructive/10">
					<TableCell>Danger Row</TableCell>
					<TableCell>Failed</TableCell>
					<TableCell>0%</TableCell>
				</TableRow>
				<TableRow className="bg-muted/50">
					<TableCell>Info Row</TableCell>
					<TableCell>Processing</TableCell>
					<TableCell>25%</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};

/**
 * Hoverable rows with pointer cursor
 */
export const Hoverable: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>#</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[
					{
						id: 1,
						name: "John Doe",
						email: "john@example.com",
						status: "Active",
					},
					{
						id: 2,
						name: "Jane Smith",
						email: "jane@example.com",
						status: "Active",
					},
					{
						id: 3,
						name: "Bob Wilson",
						email: "bob@example.com",
						status: "Inactive",
					},
				].map((user) => (
					<TableRow
						key={user.id}
						className="cursor-pointer hover:bg-primary/10"
						onClick={() => alert(`Clicked ${user.name}`)}
					>
						<TableCell>{user.id}</TableCell>
						<TableCell className="font-medium">{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>
							<span
								className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
									user.status === "Active"
										? "bg-success/10 text-success"
										: "bg-muted text-muted-foreground"
								}`}
							>
								{user.status}
							</span>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

/**
 * Responsive table that stacks on mobile
 */
export const Responsive: Story = {
	render: () => (
		<div className="w-full max-w-4xl">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead className="hidden sm:table-cell">Category</TableHead>
						<TableHead className="hidden md:table-cell">Stock</TableHead>
						<TableHead className="text-right">Price</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{[
						{
							product: "Laptop Pro",
							category: "Electronics",
							stock: "45",
							price: "$1,299.00",
						},
						{
							product: "Wireless Mouse",
							category: "Accessories",
							stock: "120",
							price: "$29.99",
						},
						{
							product: "USB-C Cable",
							category: "Accessories",
							stock: "200",
							price: "$12.99",
						},
						{
							product: 'Monitor 27"',
							category: "Electronics",
							stock: "30",
							price: "$399.00",
						},
					].map((item) => (
						<TableRow key={item.product}>
							<TableCell className="font-medium">{item.product}</TableCell>
							<TableCell className="hidden sm:table-cell">
								{item.category}
							</TableCell>
							<TableCell className="hidden md:table-cell">
								{item.stock}
							</TableCell>
							<TableCell className="text-right">{item.price}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	),
};

/**
 * Table with column spanning
 */
export const WithColspan: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead rowSpan={2}>#</TableHead>
					<TableHead rowSpan={2}>Name</TableHead>
					<TableHead colSpan={2} className="text-center">
						Contact
					</TableHead>
				</TableRow>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Phone</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>1</TableCell>
					<TableCell>Alice Johnson</TableCell>
					<TableCell>alice@example.com</TableCell>
					<TableCell>555-0101</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>2</TableCell>
					<TableCell>Bob Smith</TableCell>
					<TableCell>bob@example.com</TableCell>
					<TableCell>555-0102</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};

/**
 * Table with center-aligned content
 */
export const CenterAligned: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="text-center">#</TableHead>
					<TableHead className="text-center">Status</TableHead>
					<TableHead className="text-center">Progress</TableHead>
					<TableHead className="text-center">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[
					{ id: 1, status: "✓ Complete", progress: "100%" },
					{ id: 2, status: "⏳ Pending", progress: "50%" },
					{ id: 3, status: "✗ Failed", progress: "0%" },
				].map((item) => (
					<TableRow key={item.id}>
						<TableCell className="text-center">{item.id}</TableCell>
						<TableCell className="text-center">{item.status}</TableCell>
						<TableCell className="text-center">{item.progress}</TableCell>
						<TableCell className="text-center">
							<Button variant="link" size="sm" className="h-auto p-0">
								View
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

/**
 * Dark theme table
 */
export const BackgroundExample: Story = {
	render: () => (
		<div className="p-6 bg-card rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead className="text-right">Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="font-medium">Alice Johnson</TableCell>
						<TableCell>alice@example.com</TableCell>
						<TableCell>Admin</TableCell>
						<TableCell className="text-right">
							<Badge variant="success">Active</Badge>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Bob Smith</TableCell>
						<TableCell>bob@example.com</TableCell>
						<TableCell>User</TableCell>
						<TableCell className="text-right">
							<Badge variant="success">Active</Badge>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Carol White</TableCell>
						<TableCell>carol@example.com</TableCell>
						<TableCell>User</TableCell>
						<TableCell className="text-right">
							<Badge variant="secondary">Inactive</Badge>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	),
};

/**
 * Scrollable table with fixed height - useful for tables with many rows
 * Wraps table in a container with max-height and overflow-y-auto
 */
export const ScrollableWithManyRows: Story = {
	render: () => {
		// Generate 50 rows of data
		const generateRows = (count: number) => {
			const roles = ["Admin", "User", "Moderator", "Guest"];
			const statuses = ["Active", "Inactive", "Pending"];
			return Array.from({ length: count }, (_, i) => ({
				id: i + 1,
				name: `User ${i + 1}`,
				email: `user${i + 1}@example.com`,
				role: roles[i % roles.length],
				status: statuses[i % statuses.length],
			}));
		};

		const rows = generateRows(50);

		return (
			<div className="space-y-4">
				<div className="text-sm text-muted-foreground">
					This table has 50 rows with a maximum height of 600px and vertical
					scrolling.
				</div>
				<div className="max-h-[600px] overflow-y-auto rounded-lg border">
					<Table>
						<TableHeader className="sticky top-0 bg-card z-10">
							<TableRow>
								<TableHead className="w-[80px]">#</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead className="text-right">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.id}>
									<TableCell className="font-medium">{row.id}</TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{row.email}</TableCell>
									<TableCell>{row.role}</TableCell>
									<TableCell className="text-right">
										<Badge
											variant={
												row.status === "Active"
													? "success"
													: row.status === "Inactive"
														? "secondary"
														: "warning"
											}
										>
											{row.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		);
	},
};

/**
 * Table skeleton loading state
 */
export const SkeletonDefault: Story = {
	render: () => <TableSkeleton />,
};

/**
 * Table skeleton with headers
 */
export const SkeletonWithHeaders: Story = {
	render: () => (
		<TableSkeleton
			rows={5}
			columns={4}
			headers={["Name", "Email", "Role", "Status"]}
		/>
	),
};

/**
 * Table skeleton with actions column
 */
export const SkeletonWithActions: Story = {
	render: () => (
		<TableSkeleton
			rows={5}
			columns={3}
			headers={["Product", "Price", "Stock"]}
			showActions={true}
		/>
	),
};

/**
 * Recommended pattern: using Table with isLoading prop
 */
export const LoadingState: Story = {
	render: () => {
		const [isLoading, setIsLoading] = useState(true);

		const data = [
			{ id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
			{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
			{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
		];

		return (
			<div>
				<div className="mb-4">
					<Button onClick={() => setIsLoading(!isLoading)}>
						{isLoading ? "Show Data" : "Show Loading"}
					</Button>
				</div>
				<Table
					isLoading={isLoading}
					loadingRows={3}
					loadingColumns={4}
					loadingHeaders={["ID", "Name", "Email", "Role"]}
				>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((row) => (
							<TableRow key={row.id}>
								<TableCell>{row.id}</TableCell>
								<TableCell>{row.name}</TableCell>
								<TableCell>{row.email}</TableCell>
								<TableCell>{row.role}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	},
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead><Skeleton className="h-4 w-16" /></TableHead>
						<TableHead><Skeleton className="h-4 w-24" /></TableHead>
						<TableHead><Skeleton className="h-4 w-32" /></TableHead>
						<TableHead><Skeleton className="h-4 w-20" /></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i}>
							<TableCell><Skeleton className="h-4 w-12" /></TableCell>
							<TableCell><Skeleton className="h-4 w-32" /></TableCell>
							<TableCell><Skeleton className="h-4 w-40" /></TableCell>
							<TableCell><Skeleton className="h-4 w-24" /></TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for table rows while data is loading.",
			},
		},
	},
};