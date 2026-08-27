import { useEffect, useRef } from "react";
import { useCallbackRef } from "../utils";

const DEFAULT_EVENTS = ["mousedown", "touchstart"];

export interface UseClickOutsideOptions {
	/** Events to listen to (default: ['mousedown', 'touchstart']) */
	events?: string[];
	/** Nodes whose subtrees never count as "outside" */
	ignore?: (HTMLElement | null)[];
}

/**
 * Detects clicks outside of a given element
 *
 * The handler is kept in a ref, so changing it never rebinds the listeners.
 * The `ignore` nodes are read at event time, so mutating the array contents
 * takes effect immediately. The event list only takes effect through a
 * re-render — it is matched by content, not array identity.
 *
 * @param handler - Function to call when a click outside is detected
 * @param options - Events to listen to and nodes to ignore
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
	options: UseClickOutsideOptions = {},
): React.RefObject<T | null> {
	const ref = useRef<T>(null);
	const handlerRef = useCallbackRef(handler);
	const optionsRef = useRef(options);

	useEffect(() => {
		optionsRef.current = options;
	});

	const events = options.events ?? DEFAULT_EVENTS;

	useEffect(() => {
		const listener = (event: Event) => {
			const target = event.target as Node;

			if (!ref.current || ref.current.contains(target)) {
				return;
			}

			for (const node of optionsRef.current.ignore ?? []) {
				if (node?.contains(target)) {
					return;
				}
			}

			handlerRef();
		};

		for (const eventName of events) {
			document.addEventListener(eventName, listener);
		}

		return () => {
			for (const eventName of events) {
				document.removeEventListener(eventName, listener);
			}
		};
		// Content-matched dep: identity changes in the events array do not
		// rebind, but an actually different event list does.
	}, [handlerRef, events]);

	return ref;
}
