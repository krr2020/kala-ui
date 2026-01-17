import { useRef, useState } from "react";
import { useIsomorphicEffect } from "../use-isomorphic-effect/use-isomorphic-effect";

/**
 * Locks scroll at current position
 *
 * @example
 * ```tsx
 * const [scrollLocked, setScrollLocked] = useScrollLock(true);
 * ```
 */
export function useScrollLock(
	initialState = false,
	options: { disableBodyPadding?: boolean } = { disableBodyPadding: false },
) {
	const [scrollLocked, setScrollLocked] = useState(initialState);
	const scrollTop = useRef<number>(0);

	const lock = () => {
		scrollTop.current = window.scrollY;
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollTop.current}px`;
		document.body.style.width = "100%";

		if (options.disableBodyPadding) {
			const scrollBarWidth =
				window.innerWidth - document.documentElement.clientWidth;
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		}

		setScrollLocked(true);
	};

	const unlock = () => {
		document.body.style.overflow = "";
		document.body.style.position = "";
		document.body.style.top = "";
		document.body.style.width = "";
		document.body.style.paddingRight = "";

		window.scrollTo(0, scrollTop.current);
		setScrollLocked(false);
	};

	useIsomorphicEffect(() => {
		if (scrollLocked) {
			lock();
		} else {
			unlock();
		}

		return () => {
			if (scrollLocked) {
				unlock();
			}
		};
	}, [scrollLocked]);

	return [scrollLocked, setScrollLocked] as const;
}
