import { usePagination } from "@kala-ui/react-hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Skeleton } from "../skeleton";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "./pagination";

const meta = {
	title: "Components/Pagination",
	component: Pagination,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to adapt usePagination range to story format
function usePaginationItems(currentPage: number, totalPages: number) {
	const { range } = usePagination({
		total: totalPages,
		page: currentPage,
		siblings: 1,
		boundaries: 1,
	});

	return range.map((item, index) => {
		if (item === "dots") {
			return { key: `dots-${index}`, type: "ellipsis" } as const;
		}
		return { key: item, type: "page", page: item } as const;
	});
}

// ============================================================================
// Basic Example
// ============================================================================

export const Basic: Story = {
	render: () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">1</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						2
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">3</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

// ============================================================================
// With Ellipsis
// ============================================================================

export const WithEllipsis: Story = {
	render: () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">1</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">4</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						5
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">6</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">10</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

// ============================================================================
// Icon Only (No Labels)
// ============================================================================

export const IconOnly: Story = {
	render: () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" showLabel={false} />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">1</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						2
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">3</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" showLabel={false} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

// ============================================================================
// Sizes
// ============================================================================

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{/* Small */}
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" size="sm" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="sm">
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="sm" isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="sm">
							3
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" size="sm" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{/* Default */}
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">3</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{/* Large */}
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" size="lg" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="lg">
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="lg" isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="lg">
							3
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" size="lg" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	),
};

// ============================================================================
// Dynamic (Using Hook Range)
// ============================================================================

export const Dynamic: Story = {
	render: () => {
		const [page, setPage] = useState(1);
		const total = 10;

		return (
			<Pagination total={total} page={page} onChange={setPage}>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious />
					</PaginationItem>

					<PaginationItem>
						<PaginationLink page={1} isActive={page === 1}>
							1
						</PaginationLink>
					</PaginationItem>

					{page > 3 && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{page > 2 && page < total - 1 && (
						<PaginationItem>
							<PaginationLink page={page} isActive>
								{page}
							</PaginationLink>
						</PaginationItem>
					)}

					{page < total - 2 && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					<PaginationItem>
						<PaginationLink page={total} isActive={page === total}>
							{total}
						</PaginationLink>
					</PaginationItem>

					<PaginationItem>
						<PaginationNext />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
	},
};

// ============================================================================
// Visual Variants
// ============================================================================

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{/* Default */}
			<div>
				<p className="mb-2 text-sm font-medium text-muted-foreground">
					Default
				</p>
				<Pagination>
					<PaginationContent variant="default">
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#" isActive>
								2
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">3</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			{/* Outline */}
			<div>
				<p className="mb-2 text-sm font-medium text-muted-foreground">
					Outline
				</p>
				<Pagination>
					<PaginationContent variant="outline">
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#" isActive>
								2
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">3</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			{/* Filled */}
			<div>
				<p className="mb-2 text-sm font-medium text-muted-foreground">Filled</p>
				<Pagination>
					<PaginationContent variant="filled">
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#" isActive>
								2
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">3</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			{/* Circle */}
			<div>
				<p className="mb-2 text-sm font-medium text-muted-foreground">Circle</p>
				<Pagination>
					<PaginationContent variant="circle">
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#" isActive>
								2
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">3</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	),
};

// ============================================================================
// Spaced Variant
// ============================================================================

export const Spaced: Story = {
	render: () => (
		<Pagination>
			<PaginationContent spaced>
				<PaginationItem>
					<PaginationPrevious href="#" />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">1</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						2
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">3</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

// ============================================================================
// Interactive Example with State
// ============================================================================

export const Interactive: Story = {
	render: () => {
		const [currentPage, setCurrentPage] = useState(5);
		const totalPages = 10;
		const pages = usePaginationItems(currentPage, totalPages);

		return (
			<div className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					Page {currentPage} of {totalPages}
				</p>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									setCurrentPage((p) => Math.max(1, p - 1));
								}}
								aria-disabled={currentPage === 1}
								className={
									currentPage === 1 ? "pointer-events-none opacity-50" : ""
								}
							/>
						</PaginationItem>

						{pages.map((item) =>
							item.type === "ellipsis" ? (
								<PaginationItem key={item.key}>
									<PaginationEllipsis />
								</PaginationItem>
							) : (
								<PaginationItem key={item.key}>
									<PaginationLink
										href="#"
										isActive={currentPage === item.page}
										onClick={(e) => {
											e.preventDefault();
											if (item.page) setCurrentPage(item.page);
										}}
									>
										{item.page}
									</PaginationLink>
								</PaginationItem>
							),
						)}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									setCurrentPage((p) => Math.min(totalPages, p + 1));
								}}
								aria-disabled={currentPage === totalPages}
								className={
									currentPage === totalPages
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		);
	},
};

// ============================================================================
// With Results Summary
// ============================================================================

export const WithResultsSummary: Story = {
	render: () => {
		const [currentPage, setCurrentPage] = useState(2);
		const totalPages = 8;
		const itemsPerPage = 20;
		const totalItems = 157;

		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(currentPage * itemsPerPage, totalItems);

		const pages = usePaginationItems(currentPage, totalPages);

		return (
			<div className="w-full max-w-3xl space-y-4 rounded-lg border bg-card text-card-foreground p-6 theme-card">
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing <span className="font-medium">{startItem}</span> to{" "}
						<span className="font-medium">{endItem}</span> of{" "}
						<span className="font-medium">{totalItems}</span> results
					</p>

					<Pagination>
						<PaginationContent variant="outline" spaced>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									size="sm"
									onClick={(e) => {
										e.preventDefault();
										setCurrentPage((p) => Math.max(1, p - 1));
									}}
									aria-disabled={currentPage === 1}
									className={
										currentPage === 1 ? "pointer-events-none opacity-50" : ""
									}
								/>
							</PaginationItem>

							{pages.map((item) =>
								item.type === "ellipsis" ? (
									<PaginationItem key={item.key}>
										<PaginationEllipsis />
									</PaginationItem>
								) : (
									<PaginationItem key={item.key}>
										<PaginationLink
											href="#"
											size="sm"
											isActive={currentPage === item.page}
											onClick={(e) => {
												e.preventDefault();
												if (item.page) setCurrentPage(item.page);
											}}
										>
											{item.page}
										</PaginationLink>
									</PaginationItem>
								),
							)}

							<PaginationItem>
								<PaginationNext
									href="#"
									size="sm"
									onClick={(e) => {
										e.preventDefault();
										setCurrentPage((p) => Math.min(totalPages, p + 1));
									}}
									aria-disabled={currentPage === totalPages}
									className={
										currentPage === totalPages
											? "pointer-events-none opacity-50"
											: ""
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		);
	},
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="flex gap-1">
			<Skeleton className="h-10 w-10 rounded-md" />
			<Skeleton className="h-10 w-10 rounded-md" />
			<Skeleton className="h-10 w-10 rounded-md" />
			<Skeleton className="h-10 w-10 rounded-md" />
			<Skeleton className="h-10 w-10 rounded-md" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for pagination controls while loading.",
			},
		},
	},
};
