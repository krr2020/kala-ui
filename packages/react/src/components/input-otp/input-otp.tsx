"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";

import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { InputOTPProps } from "./input-otp.types";

function InputOTP({
	ref,
	className,
	style,
	slotStyles,
	containerClassName,
	...props
}: InputOTPProps) {
	// input-otp overwrites the hidden input's `style` internally, so the root
	// slot channel lives on a wrapper element we control; `className` moves
	// with it because the input itself is visually hidden.
	const root = applySlot(cn(className), slotStyles?.root);
	return (
		<div
			data-kala-component="input-otp"
			data-slot="input-otp"
			className={root.className}
			style={mergeStyle(style, root.style)}
		>
			<OTPInput
				ref={ref}
				containerClassName={cn(
					"flex items-center gap-2 has-[:disabled]:opacity-50",
					containerClassName,
				)}
				// Biome lint dislikes `any` here; OTPInput's props typing is strict under exactOptionalPropertyTypes.
				{...(props as unknown as React.ComponentProps<typeof OTPInput>)}
			/>
		</div>
	);
}
function InputOTPGroup({
	ref,
	className,
	style,
	slotStyles,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const root = applySlot(cn("flex items-center", className), slotStyles?.root);
	return (
		<div
			data-kala-component="input-otp-group"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}
function InputOTPSlot({
	ref,
	index,
	className,
	style,
	slotStyles,
	...props
}: React.ComponentProps<"div"> & { index: number; slotStyles?: SlotStyles }) {
	const inputOTPContext = React.useContext(OTPInputContext);
	const slot = inputOTPContext.slots[index];
	const { char, hasFakeCaret, isActive } = slot || {
		char: null,
		hasFakeCaret: false,
		isActive: false,
	};

	const root = applySlot(
		cn(
			"relative flex h-10 w-10 items-center justify-center border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md kala-surface-input",
			isActive && "z-10 kala-ring",
			className,
		),
		slotStyles?.root,
	);

	return (
		<div
			data-kala-component="input-otp-slot"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
				</div>
			)}
		</div>
	);
}
function InputOTPSeparator({
	ref,
	className,
	style,
	slotStyles,
	...props
}: React.ComponentProps<"hr"> & { slotStyles?: SlotStyles }) {
	const root = applySlot(cn(className), slotStyles?.root);
	return (
		<hr
			data-kala-component="input-otp-separator"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
