import { useCallback, useEffect, useRef, useState } from "react";

export interface UseStorageOptions<T> {
	/** Storage key */
	key: string;
	/** Default value */
	defaultValue?: T;
	/** If true, value will be updated in useEffect after mount */
	getInitialValueInEffect?: boolean;
	/** Custom serializer */
	serialize?: (value: T) => string;
	/** Custom deserializer */
	deserialize?: (value: string) => T;
}

export type UseStorageReturnValue<T> = [
	T,
	(value: T | ((prevState: T) => T)) => void,
	() => void,
];

function createStorageHook(storageType: "localStorage" | "sessionStorage") {
	return function useStorage<T>({
		key,
		defaultValue,
		getInitialValueInEffect = true,
		serialize,
		deserialize,
	}: UseStorageOptions<T>): UseStorageReturnValue<T> {
		// Options are kept in refs so the callbacks below stay identity-stable
		// even when callers pass inline literals (prevents effect re-run loops).
		const defaultValueRef = useRef(defaultValue);
		const serializeRef = useRef(serialize ?? JSON.stringify);
		const deserializeRef = useRef(deserialize ?? JSON.parse);

		useEffect(() => {
			defaultValueRef.current = defaultValue;
			serializeRef.current = serialize ?? JSON.stringify;
			deserializeRef.current = deserialize ?? JSON.parse;
		});

		const readStoredValue = useCallback((): T | undefined => {
			if (typeof window === "undefined") {
				return undefined;
			}

			try {
				const item = window[storageType].getItem(key);
				if (item === null) {
					return undefined;
				}
				return deserializeRef.current(item);
			} catch (error) {
				console.warn(`Error reading ${storageType} key "${key}":`, error);
				return undefined;
			}
		}, [key]);

		const [storedValue, setStoredValue] = useState<T>(() =>
			getInitialValueInEffect
				? (defaultValue as T)
				: (readStoredValue() ?? (defaultValue as T)),
		);

		// Sync from storage after mount (and whenever the key changes); a
		// missing entry leaves the default in place instead of overwriting it.
		useEffect(() => {
			if (!getInitialValueInEffect) {
				return;
			}
			const stored = readStoredValue();
			if (stored !== undefined) {
				setStoredValue(stored);
			}
		}, [getInitialValueInEffect, readStoredValue]);

		const storedValueRef = useRef(storedValue);
		storedValueRef.current = storedValue;

		const setValue = useCallback(
			(value: T | ((val: T) => T)) => {
				const valueToStore =
					value instanceof Function ? value(storedValueRef.current) : value;
				setStoredValue(valueToStore);

				try {
					if (typeof window !== "undefined") {
						window[storageType].setItem(
							key,
							serializeRef.current(valueToStore),
						);
						window.dispatchEvent(new StorageEvent("storage", { key }));
					}
				} catch (error) {
					console.warn(`Error setting ${storageType} key "${key}":`, error);
				}
			},
			[key],
		);

		const removeValue = useCallback(() => {
			try {
				if (typeof window !== "undefined") {
					window[storageType].removeItem(key);
					window.dispatchEvent(new StorageEvent("storage", { key }));
				}
				setStoredValue(defaultValueRef.current as T);
			} catch (error) {
				console.warn(`Error removing ${storageType} key "${key}":`, error);
			}
		}, [key]);

		// Listen for changes from other tabs/windows. Events we dispatched
		// ourselves carry no newValue and are ignored.
		useEffect(() => {
			if (typeof window === "undefined") {
				return undefined;
			}

			const handleStorageChange = (e: StorageEvent) => {
				if (e.key !== key || !e.newValue) {
					return;
				}
				try {
					setStoredValue(deserializeRef.current(e.newValue));
				} catch (error) {
					console.warn(
						`Error parsing ${storageType} value for key "${key}":`,
						error,
					);
				}
			};

			window.addEventListener("storage", handleStorageChange);
			return () => window.removeEventListener("storage", handleStorageChange);
		}, [key]);

		return [storedValue, setValue, removeValue];
	};
}

/**
 * Manages state synchronized with localStorage
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>({
 *   key: 'theme',
 *   defaultValue: 'light',
 * });
 *
 * return (
 *   <div>
 *     <button onClick={() => setTheme('dark')}>Dark</button>
 *     <button onClick={() => setTheme('light')}>Light</button>
 *     <button onClick={removeTheme}>Reset</button>
 *   </div>
 * );
 * ```
 */
export const useLocalStorage = createStorageHook("localStorage");

/**
 * Manages state synchronized with sessionStorage
 *
 * @example
 * ```tsx
 * const [value, setValue] = useSessionStorage({
 *   key: 'session-key',
 *   defaultValue: 'default',
 * });
 * ```
 */
export const useSessionStorage = createStorageHook("sessionStorage");
