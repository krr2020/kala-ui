import { useEffect, useRef, useState } from "react";
import { useIsomorphicEffect } from "../use-isomorphic-effect/use-isomorphic-effect";

export interface UseScrollLockOptions {
	/** Compensate for the disappearing scrollbar by padding the body */
	disableBodyPadding?: boolean;
}

// Scroll lock is a document-wide side effect shared by every consumer
// (dialogs, sidebars, headers…). Reference counting ensures the page stays
// locked until the LAST consumer releases it — one consumer unmounting must
// not unlock underneath another.
let lockCount = 0;
let lockedScrollTop = 0;

function lockScroll(disableBodyPadding: boolean) {
	lockCount += 1;
	if (lockCount > 1) return;

	lockedScrollTop = window.scrollY;
	document.body.style.overflow = "hidden";
	document.body.style.position = "fixed";
	document.body.style.top = `-${lockedScrollTop}px`;
	document.body.style.width = "100%";

	if (disableBodyPadding) {
		const scrollBarWidth =
			window.innerWidth - document.documentElement.clientWidth;
		document.body.style.paddingRight = `${scrollBarWidth}px`;
	}
}

function unlockScroll() {
	if (lockCount === 0) return;
	lockCount -= 1;
	if (lockCount > 0) return;

	document.body.style.overflow = "";
	document.body.style.position = "";
	document.body.style.top = "";
	document.body.style.width = "";
	document.body.style.paddingRight = "";

	window.scrollTo(0, lockedScrollTop);
}

/**
 * Locks scroll at the current position while active
 *
 * Returns `[scrollLocked, setScrollLocked]`; drive it through the setter —
 * the argument is only the INITIAL state. Safe to nest: the document stays
 * locked until every active consumer has released.
 *
 * @param initialState - Whether scroll starts locked
 * @param options - Body padding compensation
 *
 * @example
 * ```tsx
 * const [scrollLocked, setScrollLocked] = useScrollLock(true);
 * ```
 */
export function useScrollLock(
	initialState = false,
	options: UseScrollLockOptions = {},
) {
	const [scrollLocked, setScrollLocked] = useState(initialState);
	const isLockedRef = useRef(false);
	const optionsRef = useRef(options);

	useEffect(() => {
		optionsRef.current = options;
	});

	useIsomorphicEffect(() => {
		if (scrollLocked) {
			isLockedRef.current = true;
			lockScroll(optionsRef.current.disableBodyPadding ?? false);
		} else if (isLockedRef.current) {
			isLockedRef.current = false;
			unlockScroll();
		}

		return () => {
			if (isLockedRef.current) {
				isLockedRef.current = false;
				unlockScroll();
			}
		};
	}, [scrollLocked]);

	return [scrollLocked, setScrollLocked] as const;
}
