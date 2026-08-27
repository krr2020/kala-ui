import { useEffect } from "react";

export type HotkeyItem = [
	string,
	(event: KeyboardEvent) => void,
	{ preventDefault?: boolean }?,
];

const MODIFIERS = ["alt", "ctrl", "meta", "shift"];

function isApplePlatform(): boolean {
	if (typeof navigator === "undefined") return false;
	return /mac|iphone|ipad|ipod/i.test(
		`${navigator.platform} ${navigator.userAgent}`,
	);
}

function getHotkeyMatcher(hotkey: string): (event: KeyboardEvent) => boolean {
	// `mod` maps to ⌘ on Apple platforms and Ctrl everywhere else.
	const parts = hotkey
		.toLowerCase()
		.split("+")
		.map((part) =>
			part === "mod" ? (isApplePlatform() ? "meta" : "ctrl") : part,
		);

	const modifiers = {
		alt: parts.includes("alt"),
		ctrl: parts.includes("ctrl"),
		meta: parts.includes("meta"),
		shift: parts.includes("shift"),
	};

	const key = parts.find((part) => !MODIFIERS.includes(part));

	return (event: KeyboardEvent) => {
		return (
			event.altKey === modifiers.alt &&
			event.ctrlKey === modifiers.ctrl &&
			event.metaKey === modifiers.meta &&
			event.shiftKey === modifiers.shift &&
			event.key.toLowerCase() === key
		);
	};
}

/**
 * Manages keyboard shortcuts
 *
 * @example
 * ```tsx
 * useHotkeys([
 *   ['mod+J', () => console.log('Save')],
 *   ['ctrl+K', () => console.log('Search')],
 * ]);
 * ```
 */
export function useHotkeys(
	hotkeys: HotkeyItem[],
	tagsToIgnore: string[] = ["INPUT", "TEXTAREA", "SELECT"],
	triggerOnContentEditable = false,
) {
	useEffect(() => {
		const keydownListener = (event: KeyboardEvent) => {
			hotkeys.forEach(([hotkey, handler, options]) => {
				if (getHotkeyMatcher(hotkey)(event)) {
					const target = event.target as HTMLElement;
					if (
						tagsToIgnore.includes(target.tagName) ||
						(target.isContentEditable && !triggerOnContentEditable)
					) {
						return;
					}

					if (options?.preventDefault) {
						event.preventDefault();
					}

					handler(event);
				}
			});
		};

		document.documentElement.addEventListener("keydown", keydownListener);
		return () =>
			document.documentElement.removeEventListener("keydown", keydownListener);
	}, [hotkeys, tagsToIgnore, triggerOnContentEditable]);
}
