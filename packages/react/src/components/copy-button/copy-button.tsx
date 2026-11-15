"use client";

import { useClipboard } from "@kala-ui/react-hooks";
import type { IconComponent } from "../icons";
import { Check, Copy } from "../icons";
import * as React from "react";
import { applySlot } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Button } from "../button/button";
import { useSlotStyles } from "../kala-provider";
import type { CopyButtonProps } from "./copy-button.types";

function CopyButton({
	value,
	timeout = 2000,
	copyIcon = Copy,
	checkIcon = Check,
	className,
	size = "icon",
	variant = "ghost",
	slotStyles: slotStylesRaw,
	"aria-label": ariaLabel = "Copy to clipboard",
	...props
}: CopyButtonProps) {
	const slotStyles = useSlotStyles("copy-button", slotStylesRaw);
	const { copied, copy } = useClipboard({ timeout });

	const handleCopy = React.useCallback(() => {
		copy(value);
	}, [copy, value]);

	const icon = applySlot("h-4 w-4", slotStyles?.icon);

	const renderGlyph = (
		glyph: CopyButtonProps["copyIcon"],
		Fallback: IconComponent,
	) => {
		if (typeof glyph === "function") {
			return React.createElement(glyph, {
				className: icon.className,
				style: icon.style,
				"aria-hidden": "true",
			});
		}
		return (
			glyph ??
			React.createElement(Fallback, {
				className: icon.className,
				style: icon.style,
				"aria-hidden": "true",
			})
		);
	};

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
			{copied ? renderGlyph(checkIcon, Check) : renderGlyph(copyIcon, Copy)}
		</Button>
	);
}

export { CopyButton };
