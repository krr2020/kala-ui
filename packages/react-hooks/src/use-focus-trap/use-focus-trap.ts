import { useCallback, useEffect, useRef, useState } from "react";

const FOCUSABLE_SELECTOR =
	'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isFocusable(element: HTMLElement): boolean {
	if (element.hasAttribute("hidden")) return false;
	if (element.getAttribute("aria-hidden") === "true") return false;
	if (element instanceof HTMLInputElement && element.type === "hidden") {
		return false;
	}
	const style = window.getComputedStyle(element);
	return style.display !== "none" && style.visibility !== "hidden";
}

/**
 * Traps focus inside given node. While active, Tab cycles only through the
 * node's visible, enabled focusable elements; focus moves into the node on
 * activation and is restored to the previously focused element on release.
 *
 * The returned callback ref re-engages when the node mounts later than the
 * trap activates (e.g. overlays rendered through portals on the next commit).
 *
 * @example
 * ```tsx
 * const ref = useFocusTrap(active);
 * ```
 */
export function useFocusTrap(active = true) {
	const nodeRef = useRef<HTMLElement | null>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	// Triggers re-engagement when the trapped node attaches/detaches.
	const [node, setNode] = useState<HTMLElement | null>(null);

	const ref = useCallback((element: HTMLElement | null) => {
		nodeRef.current = element;
		setNode(element);
	}, []);

	const getFocusableElements = useCallback(() => {
		if (!nodeRef.current) return [];
		return Array.from(
			nodeRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
		).filter(isFocusable);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key !== "Tab" || !nodeRef.current) {
				return;
			}

			const focusableElements = getFocusableElements();
			if (focusableElements.length === 0) {
				return;
			}
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					event.preventDefault();
					lastElement.focus();
				}
			} else if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		},
		[getFocusableElements],
	);

	useEffect(() => {
		if (!active || !node) {
			return;
		}

		if (!previouslyFocusedRef.current) {
			previouslyFocusedRef.current =
				document.activeElement as HTMLElement | null;
		}

		// Move focus into the trap once it activates (or the node attaches).
		const focusTarget = getFocusableElements()[0] ?? node;
		focusTarget?.focus();

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);

			// Restore focus to where it was before the trap engaged.
			const previous = previouslyFocusedRef.current;
			if (previous?.isConnected) {
				previous.focus();
			}
			previouslyFocusedRef.current = null;
		};
	}, [active, node, getFocusableElements, handleKeyDown]);

	return ref;
}
