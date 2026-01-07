import { useEffect, useRef } from "react";
import { useCallbackRef } from "../utils";

export interface UseClickOutsideOptions {
	/** Events to listen to */
	events?: string[];
	/** Nodes to ignore clicks on */
	ignore?: (HTMLElement | null)[];
}

/**
 * Detects clicks outside of a given element
 *
 * @param handler - Function to call when click outside is detected
 * @param events - Events to listen to (default: ['mousedown', 'touchstart'])
 * @param nodes - Additional nodes to exclude from detection
 *
 * @example
 * ```tsx
 * const ref = useClickOutside<HTMLDivElement>(() => {
 *   console.log('Clicked outside');
 * });
 *
 * return <div ref={ref}>Click outside me</div>;
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
	handler: () => void,
	events: string[] = ["mousedown", "touchstart"],
	nodes: (HTMLElement | null)[] = [],
): React.RefObject<T> {
	const ref = useRef<T>(null);
	const handlerRef = useCallbackRef(handler);

	useEffect(() => {
		const listener = (event: Event) => {
			const target = event.target as Node;

			if (!ref.current || ref.current.contains(target)) {
				return;
			}

			// Check if click was on any of the ignore nodes
			for (const node of nodes) {
				if (node?.contains(target)) {
					return;
				}
			}

			handlerRef();
		};

		events.forEach((event) => {
			document.addEventListener(event, listener);
		});

		return () => {
			events.forEach((event) => {
				document.removeEventListener(event, listener);
			});
		};
	}, [events, nodes, handlerRef]);

	return ref;
}
