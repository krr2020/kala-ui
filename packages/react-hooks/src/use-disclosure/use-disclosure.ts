import { useCallback, useState } from "react";

export interface UseDisclosureHandlers {
	/** Open handler */
	open: () => void;
	/** Close handler */
	close: () => void;
	/** Toggle handler */
	toggle: () => void;
	/** Set state handler */
	set: (value: boolean) => void;
}

export type UseDisclosureReturnValue = [boolean, UseDisclosureHandlers];

/**
 * Manages boolean state with open/close/toggle handlers
 * Commonly used for modals, drawers, popovers
 *
 * @param initialState - Initial state (default: false)
 *
 * @example
 * ```tsx
 * const [opened, { open, close, toggle }] = useDisclosure(false);
 *
 * return (
 *   <div>
 *     <button onClick={open}>Open Modal</button>
 *     <Modal opened={opened} onClose={close}>
 *       Content
 *     </Modal>
 *   </div>
 * );
 * ```
 */
export function useDisclosure(
	initialState: boolean = false,
): UseDisclosureReturnValue {
	const [opened, setOpened] = useState(initialState);

	const open = useCallback(() => setOpened(true), []);
	const close = useCallback(() => setOpened(false), []);
	const toggle = useCallback(() => setOpened((o) => !o), []);
	const set = useCallback((value: boolean) => setOpened(value), []);

	return [opened, { open, close, toggle, set }];
}
