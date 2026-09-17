import { useState } from "react";

/**
 * Controlled/uncontrolled resolution shared by every form control: a
 * provided `value` prop locks the current state (the parent owns it),
 * otherwise an internal seed advances on commit. Commits still fire the
 * caller's callback in both arms.
 */
export function useUncontrolled<T>(
	value: T | undefined,
	defaultValue: T,
): readonly [T, (next: T) => void] {
	const [internal, setInternal] = useState<T>(defaultValue);
	const isControlled = value !== undefined;
	const current = isControlled ? (value as T) : internal;
	const setCurrent = (next: T): void => {
		if (!isControlled) setInternal(next);
	};
	return [current, setCurrent] as const;
}
