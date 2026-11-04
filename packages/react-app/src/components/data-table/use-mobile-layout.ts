/**
 * Mobile layout resolution for DataTable — true when a mobile mode is active
 * below the configured breakpoint.
 */

import { useMediaQuery } from "@kala-ui/react-hooks";
import type { DataTableMobileMode } from "./data-table.types";

export const DEFAULT_MOBILE_BREAKPOINT = 768;

export function useMobileLayout(
	mode: DataTableMobileMode,
	breakpoint: number = DEFAULT_MOBILE_BREAKPOINT,
): boolean {
	const matches = useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
	return mode !== "scroll" && matches;
}
