import { useCallback, useEffect, useState } from "react";

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
		serialize = JSON.stringify,
		deserialize = JSON.parse,
	}: UseStorageOptions<T>): UseStorageReturnValue<T> {
		const getStorageValue = useCallback((): T => {
			if (typeof window === "undefined") {
				return defaultValue as T;
			}

			try {
				const item = window[storageType].getItem(key);
				return item ? deserialize(item) : (defaultValue as T);
			} catch (error) {
				console.warn(`Error reading ${storageType} key "${key}":`, error);
				return defaultValue as T;
			}
		}, [key, defaultValue, deserialize]);

		const [storedValue, setStoredValue] = useState<T>(
			getInitialValueInEffect ? (defaultValue as T) : getStorageValue(),
		);

		useEffect(() => {
			if (getInitialValueInEffect) {
				setStoredValue(getStorageValue());
			}
		}, [getInitialValueInEffect, getStorageValue]);

		const setValue = useCallback(
			(value: T | ((val: T) => T)) => {
				try {
					const valueToStore =
						value instanceof Function ? value(storedValue) : value;
					setStoredValue(valueToStore);

					if (typeof window !== "undefined") {
						window[storageType].setItem(key, serialize(valueToStore));
						window.dispatchEvent(new StorageEvent("storage", { key }));
					}
				} catch (error) {
					console.warn(`Error setting ${storageType} key "${key}":`, error);
				}
			},
			[key, serialize, storedValue],
		);

		const removeValue = useCallback(() => {
			try {
				if (typeof window !== "undefined") {
					window[storageType].removeItem(key);
					window.dispatchEvent(new StorageEvent("storage", { key }));
				}
				setStoredValue(defaultValue as T);
			} catch (error) {
				console.warn(`Error removing ${storageType} key "${key}":`, error);
			}
		}, [key, defaultValue]);

		// Listen for changes from other tabs/windows
		useEffect(() => {
			if (typeof window === "undefined") {
				return undefined;
			}

			const handleStorageChange = (e: StorageEvent) => {
				if (e.key === key && e.newValue) {
					try {
						setStoredValue(deserialize(e.newValue));
					} catch (error) {
						console.warn(
							`Error parsing ${storageType} value for key "${key}":`,
							error,
						);
					}
				}
			};

			window.addEventListener("storage", handleStorageChange);
			return () => window.removeEventListener("storage", handleStorageChange);
		}, [key, deserialize]);

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
