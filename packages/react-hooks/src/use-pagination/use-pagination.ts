import { useMemo } from "react";
import { useUncontrolled } from "../use-uncontrolled/use-uncontrolled";

export const DOTS = "dots";

export interface UsePaginationSettings {
	/** Page selected on initial render, overrides value if both are provided */
	initialPage?: number;

	/** Controlled page number */
	page?: number;

	/** Total amount of pages */
	total: number;

	/** Siblings amount on left/right side of selected page */
	siblings?: number;

	/** Amount of elements visible on left/right edges */
	boundaries?: number;

	/** Callback fired after change of each page */
	onChange?: (page: number) => void;
}

function range(start: number, end: number) {
	const length = end - start + 1;
	return Array.from({ length }, (_, index) => index + start);
}

export function usePagination({
	total,
	siblings = 1,
	boundaries = 1,
	page,
	initialPage = 1,
	onChange,
}: UsePaginationSettings) {
	const _total = Math.max(0, Math.trunc(total));
	const [activePage, setActivePage] = useUncontrolled({
		value: page,
		defaultValue: initialPage,
		finalValue: initialPage,
		onChange,
	});

	const setPage = (pageNumber: number) => {
		if (pageNumber <= 0) {
			setActivePage(1);
		} else if (pageNumber > _total) {
			setActivePage(_total);
		} else {
			setActivePage(pageNumber);
		}
	};

	const next = () => setPage(activePage + 1);
	const previous = () => setPage(activePage - 1);
	const first = () => setPage(1);
	const last = () => setPage(_total);

	const paginationRange = useMemo((): (number | "dots")[] => {
		const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;
		if (totalPageNumbers >= _total) {
			return range(1, _total);
		}

		const leftSiblingIndex = Math.max(activePage - siblings, boundaries);
		const rightSiblingIndex = Math.min(
			activePage + siblings,
			_total - boundaries,
		);

		const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
		const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1);

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblings;
			const leftRange = range(1, leftItemCount);
			return [...leftRange, DOTS, ...range(_total - boundaries + 1, _total)];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblings;
			const rightRange = range(_total - rightItemCount + 1, _total);
			return [...range(1, boundaries), DOTS, ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [
				...range(1, boundaries),
				DOTS,
				...middleRange,
				DOTS,
				...range(_total - boundaries + 1, _total),
			];
		}

		return range(1, _total);
	}, [siblings, boundaries, _total, activePage]);

	return {
		range: paginationRange,
		active: activePage,
		setPage,
		next,
		previous,
		first,
		last,
		total: _total,
	};
}
