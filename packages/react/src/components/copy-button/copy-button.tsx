"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "../button/button";
import type { ButtonProps } from "../button/button.types";

export interface CopyButtonProps
	extends Omit<ButtonProps, "onClick" | "children"> {
	/** Text to copy to clipboard */
	value: string;
	/** Duration in ms to show the success state */
	timeout?: number;
	/** Icon to show in copy state (default: Copy icon) */
	copyIcon?: React.ReactNode;
	/** Icon to show in success state (default: Check icon) */
	checkIcon?: React.ReactNode;
	/** Accessible label */
	"aria-label"?: string;
}

function CopyButton({
	value,
	timeout = 2000,
	copyIcon,
	checkIcon,
	className,
	size = "icon",
	variant = "ghost",
	"aria-label": ariaLabel = "Copy to clipboard",
	...props
}: CopyButtonProps) {
	const [copied, setCopied] = React.useState(false);
	const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	React.useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const handleCopy = React.useCallback(() => {
		if (!navigator?.clipboard) return;
		navigator.clipboard
			.writeText(value)
			.then(() => {
				if (timerRef.current) clearTimeout(timerRef.current);
				setCopied(true);
				timerRef.current = setTimeout(() => {
					setCopied(false);
					timerRef.current = null;
				}, timeout);
			})
			.catch(() => {
				// Clipboard write rejected (permissions, non-secure context):
				// swallow so the click doesn't produce an unhandled rejection.
			});
	}, [value, timeout]);

	return (
		<Button
			data-slot="copy-button"
			data-copied={copied || undefined}
			size={size}
			variant={variant}
			aria-label={copied ? "Copied!" : ariaLabel}
			aria-live="polite"
			onClick={handleCopy}
			className={cn("transition-all", className)}
			{...props}
		>
			{copied
				? (checkIcon ?? <Check className="h-4 w-4" aria-hidden="true" />)
				: (copyIcon ?? <Copy className="h-4 w-4" aria-hidden="true" />)}
		</Button>
	);
}

export { CopyButton };
