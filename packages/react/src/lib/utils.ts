import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 * Note: Using tailwind-merge for class conflict resolution as it works with atomic CSS utilities
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Active-link check without false positives: "/admin" must not match
 * pathname "/admin-panel", while "/users" still matches "/users/123".
 */
export function isActivePath(pathname: string, href: string): boolean {
	const path = pathname.replace(/\/+$/, "") || "/";
	const target = href.replace(/\/+$/, "");
	if (target === "/" || target === "") {
		return path === "/";
	}
	return path === target || path.startsWith(`${target}/`);
}
