import { useCallback, useEffect, useState } from "react";

export interface UseIntersectionOptions extends IntersectionObserverInit {
	/** If true, observer will disconnect after first intersection */
	disconnectOnIntersect?: boolean;
}

export interface UseIntersectionReturnValue {
	/** Ref to attach to element */
	ref: React.RefCallback<HTMLElement>;
	/** Intersection observer entry */
	entry: IntersectionObserverEntry | null;
}

/**
 * Uses Intersection Observer API to detect element visibility
 *
 * The ref is a stable callback ref, so the observer attaches whenever the
 * node mounts — including after the initial render — and re-attaches when it
 * swaps to a different node or when the observer options change.
 *
 * @param options - Intersection observer options
 *
 * @example
 * ```tsx
 * const { ref, entry } = useIntersection({
 *   threshold: 0.5,
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {entry?.isIntersecting ? 'Visible' : 'Hidden'}
 *   </div>
 * );
 * ```
 */
export function useIntersection(
	options: UseIntersectionOptions = {},
): UseIntersectionReturnValue {
	const {
		disconnectOnIntersect = false,
		threshold,
		root,
		rootMargin,
	} = options;
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
	const [node, setNode] = useState<HTMLElement | null>(null);

	const ref = useCallback((element: HTMLElement | null) => {
		setNode(element);
	}, []);

	useEffect(() => {
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([newEntry]) => {
				if (!newEntry) return;
				setEntry(newEntry);

				if (disconnectOnIntersect && newEntry.isIntersecting) {
					observer.disconnect();
				}
			},
			{ threshold, root, rootMargin },
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [disconnectOnIntersect, threshold, root, rootMargin, node]);

	return { ref, entry };
}
