/**
 * Pure comparison for ErrorBoundary reset keys: same length and every
 * slot Object.is-equal — arrays recreated each render still count as
 * unchanged when their contents match.
 */
export function resetKeysDiffer(a?: unknown[], b?: unknown[]): boolean {
	const prev = a ?? [];
	const next = b ?? [];
	return (
		prev.length !== next.length ||
		prev.some((key, i) => !Object.is(key, next[i]))
	);
}
