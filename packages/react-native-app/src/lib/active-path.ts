/**
 * Active-link check without false positives: "/admin" must not match
 * pathname "/admin-panel", while "/users" still matches "/users/123".
 * Ported verbatim from packages/react-app/src/lib/active-path.ts — route
 * strings (e.g. expo-router usePathname()) feed the same semantics.
 */
export function isActivePath(pathname: string, href: string): boolean {
	const path = pathname.replace(/\/+$/, "") || "/";
	const target = href.replace(/\/+$/, "");
	if (target === "/" || target === "") {
		return path === "/";
	}
	return path === target || path.startsWith(`${target}/`);
}
