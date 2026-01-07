import { useCallback, useEffect, useRef, useState } from "react";

export interface UseClipboardOptions {
	/** Time in ms to reset copied state */
	timeout?: number;
}

export interface UseClipboardReturnValue {
	/** Copied text */
	copied: boolean;
	/** Copy text to clipboard */
	copy: (text: string) => void;
	/** Reset copied state */
	reset: () => void;
	/** Error if copy failed */
	error: Error | null;
}

/**
 * Provides copy to clipboard functionality
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const { copy, copied } = useClipboard({ timeout: 2000 });
 *
 * return (
 *   <button onClick={() => copy('Text to copy')}>
 *     {copied ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 * ```
 */
export function useClipboard(
	options: UseClipboardOptions = {},
): UseClipboardReturnValue {
	const { timeout = 2000 } = options;

	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const timeoutRef = useRef<number | null>(null);

	const copy = useCallback(
		(text: string) => {
			if (typeof navigator === "undefined" || !navigator.clipboard) {
				setError(new Error("Clipboard API not available"));
				return;
			}

			navigator.clipboard
				.writeText(text)
				.then(() => {
					setCopied(true);
					setError(null);

					if (timeoutRef.current) {
						window.clearTimeout(timeoutRef.current);
					}

					timeoutRef.current = window.setTimeout(() => {
						setCopied(false);
					}, timeout);
				})
				.catch((err) => {
					setError(err);
					setCopied(false);
				});
		},
		[timeout],
	);

	const reset = useCallback(() => {
		setCopied(false);
		setError(null);
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
		}
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return { copied, copy, reset, error };
}
