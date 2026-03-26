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

	const handleCopy = React.useCallback(() => {
		if (!navigator?.clipboard) return;
		navigator.clipboard.writeText(value).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), timeout);
		});
	}, [value, timeout]);

	return (
		<Button
			data-slot="copy-button"
			data-copied={copied || undefined}
			size={size}
			variant={variant}
			aria-label={copied ? "Copied!" : ariaLabel}
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
