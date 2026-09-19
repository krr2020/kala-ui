"use client";

import { useClipboard } from "@kala-ui/react-hooks";
import { Check, Copy } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { applySlot, type SlotStyles } from "../../lib/slot-styles";
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
	slotStyles?: SlotStyles;
}

function CopyButton({
	value,
	timeout = 2000,
	copyIcon,
	checkIcon,
	className,
	size = "icon",
	variant = "ghost",
	slotStyles,
	"aria-label": ariaLabel = "Copy to clipboard",
	...props
}: CopyButtonProps) {
	const { copied, copy } = useClipboard({ timeout });

	const handleCopy = React.useCallback(() => {
		copy(value);
	}, [copy, value]);

	// Default glyphs honor the icon slot; custom icons stay untouched.
	const icon = applySlot("h-4 w-4", slotStyles?.icon);

	return (
		<Button
			data-kala-component="copy-button"
			data-slot="copy-button"
			data-copied={copied || undefined}
			size={size}
			variant={variant}
			aria-label={copied ? "Copied!" : ariaLabel}
			aria-live="polite"
			onClick={handleCopy}
			className={cn("transition-all", className)}
			slotStyles={slotStyles}
			{...props}
		>
			{copied
				? (checkIcon ?? (
						<Check
							className={icon.className}
							style={icon.style}
							aria-hidden="true"
						/>
					))
				: (copyIcon ?? (
						<Copy
							className={icon.className}
							style={icon.style}
							aria-hidden="true"
						/>
					))}
		</Button>
	);
}

export { CopyButton };
