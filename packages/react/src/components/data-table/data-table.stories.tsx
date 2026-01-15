/**
 * DataTable Storybook Stories
 * Essential examples demonstrating DataTable features
 */

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../badge";
import { Button } from "../button";
import { DataTable } from "./data-table";
import type { ColumnDef } from "./data-table.types";

// Mock data types
interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user" | "moderator";
	status: "active" | "inactive";
	joinedAt: Date;
	lastLogin: Date;
}

// Generate mock users
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
	id: `user-${i + 1}`,
	name: `User ${i + 1}`,
	email: `user${i + 1}@example.com`,
	role: ["admin", "user", "moderator"][i % 3] as User["role"],
	status: i % 5 === 0 ? "inactive" : "active",
	joinedAt: new Date(
		2023,
		Math.floor(Math.random() * 12),
		Math.floor(Math.random() * 28) + 1,
	),
	lastLogin: new Date(
		2024,
		Math.floor(Math.random() * 12),
		Math.floor(Math.random() * 28) + 1,
	),
}));

// Large dataset for performance testing
const largeDataset = mockUsers;

// Generate mock users
const generateUsers = (count: number): User[] => {
	const roles: User["role"][] = ["admin", "user", "moderator"];
	const statuses: User["status"][] = ["active", "inactive"];
	const names = [
		"Alice Johnson",
		"Bob Smith",
		"Charlie Brown",
		"Diana Prince",
		"Eve Adams",
		"Frank Castle",
		"Grace Hopper",
		"Henry Ford",
		"Iris West",
		"Jack Ryan",
	];

	return Array.from({ length: count }, (_, i) => ({
		id: `user-${i + 1}`,
		name: names[i % names.length] || `User ${i + 1}`,
		email: `user${i + 1}@example.com`,
		role: roles[i % roles.length] as User["role"],
		status: statuses[i % statuses.length] as User["status"],
		joinedAt: new Date(2024, 0, i + 1),
		lastLogin: new Date(2024, 11, i + 1),
	}));
};

// Column definitions
const userColumns: ColumnDef<User>[] = [
	{
		id: "name",
		header: "Name",
		accessorKey: "name",
		enableSorting: true,
	},
	{
		id: "email",
		header: "Email",
		accessorKey: "email",
		enableSorting: true,
	},
	{
		id: "role",
		header: "Role",
		accessorKey: "role",
		enableSorting: true,
		cell: (user) => (
			<Badge variant={user.role === "admin" ? "primary" : "secondary"}>
				{user.role}
			</Badge>
		),
	},
	{
		id: "status",
		header: "Status",
		accessorKey: "status",
		cell: (user) => (
			<Badge variant={user.status === "active" ? "success" : "secondary"}>
				{user.status}
			</Badge>
		),
	},
	{
		id: "joinedAt",
		header: "Joined",
		accessorKey: "joinedAt",
		enableSorting: true,
		cell: (user) => user.joinedAt.toLocaleDateString(),
	},
];

const meta: Meta<typeof DataTable<User>> = {
	title: "Data Display/DataTable",
	component: DataTable,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"A fully-featured data table with sorting, filtering, search, pagination, row selection, sticky header, seamless pagination styling, and full accessibility support.",
			},
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataTable<User>>;

/**
 * Basic Story
 * Simple table with minimal configuration
 */
export const Basic: Story = {
	args: {
		data: generateUsers(10),
		columns: userColumns,
	},
	parameters: {
		docs: {
			description: {
				story: "Basic table with no additional features enabled.",
			},
		},
	},
};

/**
 * With Search and Pagination
 * Table with search functionality and pagination
 */
export const WithSearchAndPagination: Story = {
	args: {
		data: generateUsers(50),
		columns: userColumns,
		searchable: {
			placeholder: "Search users...",
			ariaLabel: "Search users by name, email, or role",
		},
		pagination: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Table with search input (includes accessible clear button) and pagination controls.",
			},
		},
	},
};

/**
 * With Selection and Bulk Actions
 * Table with row selection and bulk actions (always visible)
 */
export const WithSelectionAndActions: Story = {
	args: {
		data: generateUsers(25),
		columns: userColumns,
		pagination: true,
		selection: {
			enabled: true,
			selectedIds: new Set(),
			getRowId: (row: User) => row.id,
			onSelectionChange: () => {},
		},
		bulkActions: [
			{
				id: "activate",
				label: "Activate",
				variant: "default" as const,
				onClick: () => alert("Activate selected users"),
			},
			{
				id: "delete",
				label: "Delete",
				variant: "destructive" as const,
				onClick: () => alert("Delete selected users"),
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"Bulk actions are always visible (disabled when no selection) to prevent layout shifts.",
			},
		},
	},
};

/**
 * Sticky Header and Footer
 * Large dataset with sticky header and footer for better UX
 */
export const StickyHeaderAndFooter: Story = {
	args: {
		data: generateUsers(200),
		columns: userColumns,
		pagination: true,
		searchable: {
			placeholder: "Search users...",
		},
		stickyHeader: true,
		stickyFooter: true,
		footer: (
			<div className="flex justify-between items-center text-sm text-muted-foreground w-full">
				<span>Total Users: 200</span>
				<span>Last updated: {new Date().toLocaleDateString()}</span>
			</div>
		),
		selection: {
			enabled: true,
			selectedIds: new Set(),
			getRowId: (row: User) => row.id,
			onSelectionChange: () => {},
		},
		bulkActions: [
			{
				id: "export",
				label: "Export",
				variant: "outline" as const,
				onClick: () => alert("Export selected users"),
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"Sticky header and footer for large datasets. Both header and pagination remain fixed during scrolling.",
			},
		},
	},
};

/**
 * Headers Below Data
 * Long table with duplicate headers at bottom for easier navigation
 */
export const HeadersBelowData: Story = {
	args: {
		data: generateUsers(100),
		columns: userColumns,
		pagination: true,
		stickyHeader: true,
		headersBelow: true,
		searchable: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Duplicate headers appear at the bottom when there are more than 10 rows per page.",
			},
		},
	},
};

/**
 * Complete Example
 * Full-featured table demonstrating all capabilities
 */
export const Complete: Story = {
	args: {
		data: generateUsers(300),
		columns: userColumns,
		searchable: {
			placeholder: "Search all users...",
			ariaLabel: "Search users by any field",
		},
		pagination: true,
		stickyHeader: true,
		stickyFooter: true,
		headersBelow: true,
		striped: true,
		footer: (
			<div className="flex justify-between items-center text-sm text-muted-foreground w-full">
				<div className="flex gap-4">
					<span>Total: 300 users</span>
					<span>Active: 240</span>
					<span>Inactive: 60</span>
				</div>
				<span>All features enabled</span>
			</div>
		),
		selection: {
			enabled: true,
			selectedIds: new Set(),
			getRowId: (row: User) => row.id,
			onSelectionChange: () => {},
		},
		bulkActions: [
			{
				id: "activate",
				label: "Activate",
				variant: "default" as const,
				onClick: () => alert("Activate selected users"),
			},
			{
				id: "deactivate",
				label: "Deactivate",
				variant: "secondary" as const,
				onClick: () => alert("Deactivate selected users"),
			},
			{
				id: "delete",
				label: "Delete",
				variant: "destructive" as const,
				onClick: () => alert("Delete selected users"),
			},
		],
		emptyState: {
			title: "No users found",
			description: "Try adjusting your search criteria.",
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Complete example with all features: search with clear button, pagination without gaps, sticky elements, headers below data, and always-visible bulk actions.",
			},
		},
	},
};

/**
 * Table with sticky header
 */
export const StickyHeader: Story = {
	args: {
		data: mockUsers,
		columns: userColumns,
		stickyHeader: true,
	},
	parameters: {
		layout: "fullscreen",
	},
};

/**
 * Scrollable table with 50 rows demonstrating vertical scrolling
 * Uses stickyHeader prop for fixed headers while scrolling
 */
export const ScrollableWithManyRows: Story = {
	args: {
		data: mockUsers, // All 50 users
		columns: userColumns,
		stickyHeader: true,
		searchable: {
			placeholder: "Search users...",
			ariaLabel: "Search users table",
		},
	},
	parameters: {
		layout: "padded",
	},
};

/**
 * Table with clickable rows
 */
export const ClickableRows: Story = {
	args: {
		data: mockUsers.slice(0, 10),
		columns: userColumns,
		onRowClick: (user) => {
			alert(`Clicked on ${user.name}`);
		},
		hoverable: true,
	},
};

/**
 * Loading state
 */
export const Loading: Story = {
	args: {
		data: mockUsers,
		columns: userColumns,
		isLoading: true,
		loadingConfig: {
			rows: 5,
		},
	},
};

/**
 * Empty state
 */
export const Empty: Story = {
	args: {
		data: [],
		columns: userColumns,
		emptyState: {
			title: "No users found",
			description: "Get started by adding your first user.",
			action: {
				label: "Add User",
				onClick: () => alert("Add user clicked"),
			},
		},
	},
};

/**
 * Custom empty state with search
 */
export const EmptySearch: Story = {
	args: {
		data: [],
		columns: userColumns,
		searchable: true,
		emptyState: {
			title: "No results",
			description: "Try adjusting your search query.",
		},
	},
};

/**
 * Server-side Pagination
 * Example of how to use server-side pagination with the DataTable
 */
export const ServerSidePagination: Story = {
	render: () => {
		const [page, setPage] = React.useState(1);
		const [pageSize, setPageSize] = React.useState(10);
		const total = 100;

		// Mock server-side data fetching
		const data = React.useMemo(() => {
			return Array.from({ length: pageSize }, (_, i) => ({
				id: `user-${(page - 1) * pageSize + i + 1}`,
				name: `Server User ${(page - 1) * pageSize + i + 1}`,
				email: `user${(page - 1) * pageSize + i + 1}@example.com`,
				role: (["admin", "user", "moderator"][i % 3] || "user") as User["role"],
				status: (i % 2 === 0 ? "active" : "inactive") as User["status"],
				joinedAt: new Date(),
				lastLogin: new Date(),
			}));
		}, [page, pageSize]);

		return (
			<DataTable<User>
				data={data}
				columns={userColumns}
				pagination={{
					page,
					pageSize,
					total,
					onChange: (newPage, newPageSize) => {
						setPage(newPage);
						setPageSize(newPageSize);
					},
				}}
			/>
		);
	},
};

/**
 * Full-featured table with all options
 */
export const FullFeatured: Story = {
	args: {
		data: mockUsers,
		columns: userColumns,
		searchable: {
			placeholder: "Search by name, email, or role...",
			ariaLabel: "Search users",
		},
		pagination: {
			page: 1,
			pageSize: 10,
			total: mockUsers.length,
			pageSizeOptions: [5, 10, 20, 50],
		},
		selection: {
			enabled: true,
			selectedIds: new Set<string>(),
			getRowId: (user) => user.id,
			onSelectionChange: () => {},
		},
		bulkActions: [
			{
				id: "activate",
				label: "Activate",
				variant: "default",
				onClick: (users) => alert(`Activate ${users.length} users`),
			},
			{
				id: "deactivate",
				label: "Deactivate",
				variant: "secondary",
				onClick: (users) => alert(`Deactivate ${users.length} users`),
			},
			{
				id: "delete",
				label: "Delete",
				variant: "destructive",
				onClick: (users) => alert(`Delete ${users.length} users`),
			},
		],
		defaultSort: {
			key: "name",
			direction: "asc",
		},
		hoverable: true,
		caption: "User management table",
		ariaLabel: "Users table with sorting and filtering",
	},
};

/**
 * Mobile responsive table
 */
export const MobileResponsive: Story = {
	args: {
		data: mockUsers.slice(0, 5),
		columns: [
			{
				id: "name",
				header: "Name",
				accessorKey: "name",
			},
			{
				id: "email",
				header: "Email",
				accessorKey: "email",
				hideOnMobile: true,
			},
			{
				id: "role",
				header: "Role",
				accessorKey: "role",
			},
			{
				id: "status",
				header: "Status",
				accessorKey: "status",
				hideOnMobile: true,
			},
		],
		searchable: true,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};

/**
 * Table with custom cell renderers
 */
export const CustomCells: Story = {
	args: {
		data: mockUsers.slice(0, 5),
		columns: [
			{
				id: "name",
				header: "User",
				cell: (user) => (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
							{user.name.charAt(0)}
						</div>
						<div>
							<div className="font-medium">{user.name}</div>
							<div className="text-sm text-muted-foreground">{user.email}</div>
						</div>
					</div>
				),
			},
			{
				id: "role",
				header: "Role",
				accessorKey: "role",
				cell: (user) => (
					<Badge variant={user.role === "admin" ? "primary" : "secondary"}>
						{user.role}
					</Badge>
				),
			},
			{
				id: "actions",
				header: "Actions",
				cell: (user) => (
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => alert(`Edit ${user.name}`)}
						>
							Edit
						</Button>
						<Button
							size="sm"
							variant="destructive"
							onClick={() => alert(`Delete ${user.name}`)}
						>
							Delete
						</Button>
					</div>
				),
			},
		],
	},
};

/**
 * Table with footer for summary data
 */
export const WithFooter: Story = {
	args: {
		data: mockUsers.slice(0, 10),
		columns: userColumns,
		footer: (
			<tr>
				<td
					colSpan={5}
					className="px-4 py-3 text-sm font-semibold text-muted-foreground"
				>
					Total: {mockUsers.slice(0, 10).length} users
				</td>
			</tr>
		),
	},
};

/**
 * Sticky header with large dataset and footer
 */
export const StickyHeaderWithFooter: Story = {
	name: "Sticky Header with Large Dataset",
	args: {
		data: largeDataset,
		columns: userColumns,
		searchable: {
			placeholder: "Search users by name, email, or role...",
			ariaLabel: "Search users",
		},
		pagination: true,
		stickyHeader: true,
		striped: true,
		hoverable: true,
		selection: {
			enabled: true,
			selectedIds: new Set<string>(),
			getRowId: (user) => user.id,
			onSelectionChange: () => {},
		},
		footer: (
			<tr>
				<td
					colSpan={5}
					className="text-center py-4 font-medium text-muted-foreground"
				>
					Total Users: {largeDataset.length} | Active:{" "}
					{largeDataset.filter((u: User) => u.status === "active").length} |
					Inactive:{" "}
					{largeDataset.filter((u: User) => u.status === "inactive").length}
				</td>
			</tr>
		),
		caption:
			"Complete user management table with sticky header for large datasets",
		ariaLabel: "User management data table",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Demonstrates the data table with sticky header functionality, large dataset (150 rows), and footer statistics. The header remains visible while scrolling through many rows, and the pagination is seamlessly connected to the table.",
			},
		},
	},
};

/**
 * Connected table and pagination styling
 */
export const ConnectedPagination: Story = {
	name: "Connected Table & Pagination",
	args: {
		data: mockUsers,
		columns: userColumns,
		pagination: {
			page: 1,
			pageSize: 5,
			total: mockUsers.length,
			pageSizeOptions: [5, 8, 15, 30],
		},
		bordered: true,
		striped: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Shows the seamless connection between table and pagination with no gaps or spacing issues. The pagination area appears as a natural extension of the table.",
			},
		},
	},
};

/**
 * Sticky Footer Story
 * Demonstrates sticky footer functionality that keeps pagination visible while scrolling
 */
export const StickyFooter: Story = {
	args: {
		data: generateUsers(200),
		columns: userColumns,
		pagination: {
			page: 1,
			pageSize: 15,
			total: mockUsers.length,
			pageSizeOptions: [10, 15, 25, 50],
		},
		stickyHeader: true,
		stickyFooter: true,
		searchable: true,
		footer: (
			<div className="text-sm text-muted-foreground text-center w-full">
				This footer stays visible while scrolling with stickyFooter enabled
			</div>
		),
		selection: {
			enabled: true,
			selectedIds: new Set(),
			getRowId: (row: User) => row.id,
			onSelectionChange: () => {},
		},
		bulkActions: [
			{
				id: "delete",
				label: "Delete Users",
				variant: "destructive" as const,
				onClick: () => alert("Delete selected users"),
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"Large dataset with sticky header and footer. The pagination remains fixed at the bottom while scrolling through data, improving UX for long tables.",
			},
		},
	},
};

/**
 * Headers Below Data Story
 * Shows duplicate column headers at the bottom of large tables for easier navigation
 */
export const HeadersBelow: Story = {
	args: {
		data: generateUsers(100),
		columns: userColumns,
		pagination: {
			page: 1,
			pageSize: 20,
			total: mockUsers.length,
			pageSizeOptions: [15, 20, 35, 50],
		},
		stickyHeader: true,
		stickyFooter: true,
		headersBelow: true,
		searchable: {
			placeholder: "Search users...",
		},
		footer: (
			<div className="text-sm text-muted-foreground text-center w-full">
				Headers are duplicated below the data and the footer is sticky
			</div>
		),
		selection: {
			enabled: true,
			selectedIds: new Set(),
			getRowId: (row: User) => row.id,
			onSelectionChange: () => {},
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"For long tables with many rows per page, duplicate headers appear at the bottom to help users understand column context without scrolling back to the top.",
			},
		},
	},
};

/**
 * Server-Side Data Fetching Story
 * Demonstrates using callbacks to fetch data from an API
 */
export const ServerSideDataFetching: Story = {
	render: () => {
		const [users, setUsers] = React.useState<User[]>([]);
		const [isLoading, setIsLoading] = React.useState(false);
		const [totalRecords, setTotalRecords] = React.useState(1000);
		const [currentPage, setCurrentPage] = React.useState(1);
		const [pageSize, setPageSize] = React.useState(10);
		const [sortConfig, setSortConfig] = React.useState<{
			key: keyof User;
			direction: "asc" | "desc";
		} | null>(null);
		const [searchQuery, setSearchQuery] = React.useState("");

		// Simulate API call
		const fetchData = React.useCallback(async () => {
			setIsLoading(true);
			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// In real app, make API call with params:
			// const response = await fetch(`/api/users?page=${currentPage}&pageSize=${pageSize}&sort=${sortConfig?.key}&order=${sortConfig?.direction}&search=${searchQuery}`);
			// const data = await response.json();

			// For demo, generate mock data
			const startIndex = (currentPage - 1) * pageSize;
			const mockData = generateUsers(pageSize).map((user, i) => ({
				...user,
				id: `user-${startIndex + i + 1}`,
				name: `${user.name} (Page ${currentPage})`,
			}));

			setUsers(mockData);
			setTotalRecords(1000); // Total records from API
			setIsLoading(false);
		}, [currentPage, pageSize]);

		// Fetch data on mount and when params change
		React.useEffect(() => {
			fetchData();
		}, [fetchData]);

		return (
			<div className="space-y-4">
				<div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
					<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
						Server-Side Mode
					</h3>
					<p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
						The table calls your callbacks when pagination, sorting, filtering, or
						search changes. You can then fetch fresh data from your API.
					</p>
					<div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
						<div>Current Page: {currentPage}</div>
						<div>Page Size: {pageSize}</div>
						<div>Total Records: {totalRecords}</div>
						<div>Sort: {sortConfig ? `${String(sortConfig.key)} (${sortConfig.direction})` : "None"}</div>
						<div>Search: {searchQuery || "None"}</div>
					</div>
				</div>

				<DataTable
					data={users}
					columns={userColumns}
					isLoading={isLoading}
					pagination={{
						page: currentPage,
						pageSize: pageSize,
						total: totalRecords,
						pageSizeOptions: [10, 20, 50, 100],
						onChange: (page, size) => {
							console.log("Pagination changed:", { page, size });
							setCurrentPage(page);
							setPageSize(size);
						},
					}}
					searchable={{
						placeholder: "Search users...",
						onChange: (query) => {
							console.log("Search changed:", query);
							setSearchQuery(query);
							setCurrentPage(1); // Reset to page 1 on search
						},
					}}
					onSortChange={(sort) => {
						console.log("Sort changed:", sort);
						setSortConfig(sort);
						setCurrentPage(1); // Reset to page 1 on sort
					}}
					onFilterChange={(filters) => {
						console.log("Filters changed:", filters);
						// Handle filter changes
					}}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Example showing how to use callbacks to fetch data from an API. When pagination, sorting, or search changes, the callbacks are triggered, allowing you to make fresh API calls. Perfect for handling large datasets (10,000+ records) where you only want to load data for the current page.",
			},
		},
	},
};

/**
 * Complete Feature Set Story
 * Demonstrates all available table features working together
 */
export const CompleteFeatureSet: Story = {
	args: {
		data: generateUsers(500),
		columns: userColumns,
		pagination: {
			page: 1,
			pageSize: 25,
			total: mockUsers.length,
			pageSizeOptions: [10, 25, 50, 100],
		},
		searchable: {
			placeholder: "Search all users...",
			ariaLabel: "Search users by name, email, or role",
		},
		stickyHeader: true,
		stickyFooter: true,
		headersBelow: true,
		bordered: true,
		hoverable: true,
		striped: false,
		compact: false,
		selection: {
			enabled: true,
			selectedIds: new Set(),
			getRowId: (row: User) => row.id,
			onSelectionChange: () => {},
		},
		bulkActions: [
			{
				id: "activate",
				label: "Activate",
				variant: "default" as const,
				onClick: () => alert("Activate selected users"),
			},
			{
				id: "deactivate",
				label: "Deactivate",
				variant: "secondary" as const,
				onClick: () => alert("Deactivate selected users"),
			},
			{
				id: "delete",
				label: "Delete",
				variant: "destructive" as const,
				onClick: () => alert("Delete selected users"),
			},
		],
		emptyState: {
			title: "No users found",
			description:
				"No users match your search criteria. Try adjusting your search terms.",
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Comprehensive example showcasing all DataTable features: sticky header/footer, headers below data, search, pagination, selection, bulk actions, and more. Perfect for large datasets requiring advanced table functionality.",
			},
		},
	},
};
