import { useEffect, useState } from "react";

/**
 * Returns true if component is mounted
 * Useful for preventing state updates on unmounted components
 *
 * @example
 * ```tsx
 * const mounted = useMounted();
 *
 * useEffect(() => {
 *   fetchData().then(data => {
 *     if (mounted) {
 *       setData(data);
 *     }
 *   });
 * }, [mounted]);
 * ```
 */
export function useMounted(): boolean {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	return mounted;
}
