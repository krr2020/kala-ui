/**
 * PaginationNav Component
 * Numbered page buttons with ellipsis for DataTable pagination
 */

"use client";

import { usePagination, DOTS } from "@kala-ui/react-hooks";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Box } from "../box";
import { Button } from "../button";
import { Flex } from "../flex";

interface PaginationNavProps {
	currentPage: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
	onPageChange: (page: number) => void;
	onPreviousPage: () => void;
	onNextPage: () => void;
}

export function PaginationNav({
	currentPage,
	totalPages,
	hasPreviousPage,
	hasNextPage,
	onPageChange,
	onPreviousPage,
	onNextPage,
}: PaginationNavProps) {
	const { range } = usePagination({
		total: totalPages,
		page: currentPage,
		siblings: 1,
		boundaries: 1,
		onChange: onPageChange,
	});

	return (
		<Flex align="center" gap={1}>
			<Button
				variant="outline"
				size="sm"
				onClick={onPreviousPage}
				disabled={!hasPreviousPage}
				className="h-8 w-8 p-0"
			>
				<ChevronLeft className="h-4 w-4" />
				<Box as="span" className="sr-only">
					Previous page
				</Box>
			</Button>
			{range.map((item, index) =>
				item === DOTS ? (
					<Flex
						key={`dots-${index}`}
						align="center"
						justify="center"
						className="h-8 w-8"
						aria-hidden
					>
						<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
					</Flex>
				) : (
					<Button
						key={item}
						variant={item === currentPage ? "default" : "outline"}
						size="sm"
						onClick={() => onPageChange(item as number)}
						className="h-8 w-8 p-0 text-xs"
						aria-label={`Page ${item}`}
						aria-current={item === currentPage ? "page" : undefined}
					>
						{item}
					</Button>
				),
			)}
			<Button
				variant="outline"
				size="sm"
				onClick={onNextPage}
				disabled={!hasNextPage}
				className="h-8 w-8 p-0"
			>
				<ChevronRight className="h-4 w-4" />
				<Box as="span" className="sr-only">
					Next page
				</Box>
			</Button>
		</Flex>
	);
}
