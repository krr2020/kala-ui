import { useId as useReactId } from "react";

/**
 * Generates unique ID
 * Wrapper around React 18's useId
 *
 * @param staticId - Static ID to use instead of generated one
 *
 * @example
 * ```tsx
 * const id = useId();
 *
 * return (
 *   <div>
 *     <label htmlFor={id}>Label</label>
 *     <input id={id} />
 *   </div>
 * );
 * ```
 */
export function useId(staticId?: string): string {
	const reactId = useReactId();
	return staticId || reactId;
}
