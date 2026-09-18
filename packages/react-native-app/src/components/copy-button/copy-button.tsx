/**
 * CopyButton: token-driven icon button that copies `value` to the
 * clipboard and flashes a check state. RN has no navigator.clipboard, so
 * the writer is injectable (`writeClipboard`); apps on Expo pass
 * expo-clipboard's setTextAsync, bare-RN apps pass
 * @react-native-clipboard/clipboard — the library itself stays dep-free.
 */
import { Check, Copy } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";

import { useUnistyles } from "react-native-unistyles";
import { Button } from "@kala-ui/react-native";
import type { CopyButtonProps } from "./copy-button.types";

export function CopyButton({
	value,
	timeout = 2000,
	writeClipboard,
	onError,
	copyIcon,
	checkIcon,
	accessibilityLabel = "Copy to clipboard",
	variant = "ghost",
	color = "primary",
	style,
	slotStyles,
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);
	const { theme } = useUnistyles();

	// Last-write-wins: a slow earlier write resolving after a newer press
	// must not resurrect the copied state.
	const seq = useRef(0);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}
	}, []);

	const handlePress = useCallback(() => {
		const mySeq = seq.current + 1;
		seq.current = mySeq;

		const navigator = (
			globalThis as {
				navigator?: {
					clipboard?: { writeText?: (t: string) => Promise<void> };
				};
			}
		).navigator;
		const writer = writeClipboard ?? navigator?.clipboard?.writeText;

		if (!writer) {
			onError?.(new Error("Clipboard API not available"));
			return;
		}

		Promise.resolve()
			.then(() => writer(value))
			.then(() => {
				if (seq.current !== mySeq) return;
				setCopied(true);
				clearTimer();
				timer.current = setTimeout(() => {
					if (seq.current !== mySeq) return;
					setCopied(false);
				}, timeout);
			})
			.catch((err: unknown) => {
				if (seq.current !== mySeq) return;
				setCopied(false);
				onError?.(err instanceof Error ? err : new Error(String(err)));
			});
	}, [writeClipboard, value, timeout, onError, clearTimer]);

	return (
		<Button
			testID="k-copy-button"
			accessibilityLabel={copied ? "Copied!" : accessibilityLabel}
			accessibilityLiveRegion="polite"
			variant={variant}
			color={color}
			size="icon"
			onPress={handlePress}
			style={style}
			slotStyles={slotStyles}
		>
			{copied
				? (checkIcon ?? (
						<Check
							size={18}
							color={theme.foreground}
							testID="k-copy-button-check"
						/>
					))
				: (copyIcon ?? (
						<Copy
							size={18}
							color={theme.foreground}
							testID="k-copy-button-copy"
						/>
					))}
		</Button>
	);
}
