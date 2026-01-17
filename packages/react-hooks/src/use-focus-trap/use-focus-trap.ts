import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE_ELEMENTS =
	'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Traps focus inside given node
 *
 * @example
 * ```tsx
 * const ref = useFocusTrap(active);
 * ```
 */
export function useFocusTrap(active = true) {
	const ref = useRef<HTMLElement>(null);

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key !== "Tab" || !ref.current) {
			return;
		}

		const focusableElements = ref.current.querySelectorAll(FOCUSABLE_ELEMENTS);
		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[
			focusableElements.length - 1
		] as HTMLElement;

		if (event.shiftKey) {
			if (document.activeElement === firstElement) {
				lastElement.focus();
				event.preventDefault();
			}
		} else {
			if (document.activeElement === lastElement) {
				firstElement.focus();
				event.preventDefault();
			}
		}
	}, []);

	useEffect(() => {
		if (active) {
			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}
	}, [active, handleKeyDown]);

	return ref;
}
