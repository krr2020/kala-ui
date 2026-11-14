/**
 * Frozen children for overlays — keeps exit animations rendering the
 * last-open content instead of mid-close parent state (blank/fallback).
 */

import type { ReactNode } from "react";
import { useRef } from "react";

export function useFrozenChildren(
	open: boolean | undefined,
	children: ReactNode,
): ReactNode {
	const frozen = useRef<ReactNode>(children);
	if (open !== false) {
		frozen.current = children;
	}
	// Closed: Radix keeps the portal mounted during the exit animation.
	return open === false ? frozen.current : children;
}
