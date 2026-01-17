import { useEffect } from "react";

export type HotkeyItem = [
	string,
	(event: KeyboardEvent) => void,
	{ preventDefault?: boolean }?,
];

function getHotkeyMatcher(hotkey: string): (event: KeyboardEvent) => boolean {
	const parts = hotkey.toLowerCase().split("+");
	const modifiers = {
		alt: parts.includes("alt"),
		ctrl: parts.includes("ctrl"),
		meta: parts.includes("meta"),
		shift: parts.includes("shift"),
	};

	const key = parts.find((part) => !Object.keys(modifiers).includes(part));

	return (event: KeyboardEvent) => {
		return (
			event.altKey === modifiers.alt &&
			(event.ctrlKey || event.metaKey) === modifiers.ctrl &&
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
