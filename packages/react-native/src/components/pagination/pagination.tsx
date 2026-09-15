/**
 * Pagination: the web compound (Root/Content/Link/Previous/Next/Ellipsis)
 * collapses into one props-driven component — same controlled/uncontrolled
 * lock as Tabs. The page-list algorithm is inlined from
 * @kala-ui/react-hooks use-pagination to keep the native package free of the
 * hooks dependency; "dots" entries render as an aria-hidden ellipsis marker
 * distinct from the numbered page buttons. Pressing the current page is a
 * no-op and never fires onPageChange.
 */
import { useState } from "react";
import type { ReactElement } from "react";
import {
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
} from "lucide-react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import type { PaginationProps, PaginationSize } from "./pagination.types";

const DOT = "dots" as const;
type PageEntry = number | typeof DOT;

const FONT: Record<PaginationSize, number> = { sm: 12, md: 14, lg: 16 };
const SIDE: Record<PaginationSize, number> = { sm: 32, md: 38, lg: 44 };

const range = (start: number, end: number): number[] => {
	const length = end - start + 1;
	return Array.from({ length }, (_, index) => index + start);
};

// port of use-pagination's paginationRange (see @kala-ui/react-hooks)
const computeRange = (
	total: number,
	active: number,
	siblings: number,
	boundaries: number,
): PageEntry[] => {
	if (siblings * 2 + 3 + boundaries * 2 >= total) return range(1, total);
	const leftSibling = Math.max(active - siblings, boundaries);
	const rightSibling = Math.min(active + siblings, total - boundaries);
	const showLeftDots = leftSibling > boundaries + 2;
	const showRightDots = rightSibling < total - (boundaries + 1);
	if (!showLeftDots && showRightDots) {
		return [
			...range(1, 3 + 2 * siblings),
			DOT,
			...range(total - boundaries + 1, total),
		];
	}
	if (showLeftDots && !showRightDots) {
		const rightCount = 3 + 2 * siblings;
		return [
			...range(1, boundaries),
			DOT,
			...range(total - rightCount + 1, total),
		];
	}
	if (showLeftDots && showRightDots) {
		return [
			...range(1, boundaries),
			DOT,
			...range(leftSibling, rightSibling),
			DOT,
			...range(total - boundaries + 1, total),
		];
	}
	return range(1, total);
};

export function Pagination({
	total = 0,
	page,
	defaultPage = 1,
	siblings = 1,
	boundaries = 1,
	onPageChange,
	size = "md",
	accessibilityLabel = "Pagination",
	style,
	testID = "k-pagination",
}: PaginationProps): ReactElement {
	const { theme } = useUnistyles();
	const themeMap = theme as unknown as Record<string, string>;
	const totalPages = Math.max(0, Math.trunc(total));
	// controlled lock: a provided page prop always wins over internal state
	const controlled = page !== undefined;
	const [internal, setInternal] = useState(() => defaultPage);
	const active = Math.min(
		Math.max(controlled ? (page as number) : internal, 1),
		Math.max(totalPages, 1),
	);
	const side = Math.max(SIDE[size], 44);

	const goTo = (next: number) => {
		const target = Math.min(Math.max(next, 1), totalPages);
		if (target === active) return;
		if (!controlled) setInternal(target);
		onPageChange?.(target);
	};

	const controlStyle = {
		minWidth: side,
		height: side,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		borderRadius: tokens.radius.control,
	};

	return (
		<View
			testID={testID}
			accessible={true}
			// RN has no "navigation" role; the labelled container is the landmark
			accessibilityLabel={accessibilityLabel}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					gap: 4,
					alignSelf: "flex-start",
				},
				style,
			]}
		>
			<Pressable
				testID="k-pagination-previous"
				accessibilityRole="button"
				accessibilityLabel="Go to previous page"
				accessibilityState={{ disabled: active <= 1 }}
				disabled={active <= 1}
				onPress={() => goTo(active - 1)}
				style={controlStyle}
			>
				<ChevronLeft size={16} color={themeMap.foreground} />
			</Pressable>
			{computeRange(totalPages, active, siblings, boundaries).map(
				(entry: PageEntry, index: number) =>
					entry === DOT ? (
						<View
							key={`dot-${index}`}
							testID="k-pagination-ellipsis"
							accessible={false}
							accessibilityElementsHidden={true}
							style={controlStyle}
						>
							<MoreHorizontal size={16} color={themeMap.mutedForeground} />
						</View>
					) : (
						<Pressable
							key={entry}
							testID="k-pagination-page"
							accessibilityRole="button"
							accessibilityLabel={String(entry)}
							accessibilityState={{ selected: entry === active }}
							onPress={() => goTo(entry)}
							style={[
								controlStyle,
								{
									backgroundColor:
										entry === active ? themeMap.primary : "transparent",
								},
							]}
						>
							<RNText
								style={{
									color:
										entry === active
											? themeMap.primaryForeground
											: themeMap.foreground,
									fontSize: FONT[size],
									fontWeight: entry === active ? "600" : "500",
								}}
							>
								{String(entry)}
							</RNText>
						</Pressable>
					),
			)}
			<Pressable
				testID="k-pagination-next"
				accessibilityRole="button"
				accessibilityLabel="Go to next page"
				accessibilityState={{ disabled: active >= totalPages }}
				disabled={active >= totalPages}
				onPress={() => goTo(active + 1)}
				style={controlStyle}
			>
				<ChevronRight size={16} color={themeMap.foreground} />
			</Pressable>
		</View>
	);
}
