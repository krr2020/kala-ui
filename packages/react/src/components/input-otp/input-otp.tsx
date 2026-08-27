"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";

import { cn } from "../../lib/utils";

function InputOTP({
	ref,
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput>) {
	return (
		<OTPInput
			ref={ref}
			containerClassName={cn(
				"flex items-center gap-2 has-[:disabled]:opacity-50",
				containerClassName,
			)}
			className={cn("disabled:cursor-not-allowed", className)}
			// Biome lint dislikes `any` here; OTPInput's props typing is strict under exactOptionalPropertyTypes.
			{...(props as unknown as React.ComponentProps<typeof OTPInput>)}
		/>
	);
}
function InputOTPGroup({
	ref,
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div ref={ref} className={cn("flex items-center", className)} {...props} />
	);
}
function InputOTPSlot({
	ref,
	index,
	className,
	...props
}: React.ComponentProps<"div"> & { index: number }) {
	const inputOTPContext = React.useContext(OTPInputContext);
	const slot = inputOTPContext.slots[index];
	const { char, hasFakeCaret, isActive } = slot || {
		char: null,
		hasFakeCaret: false,
		isActive: false,
	};

	return (
		<div
			ref={ref}
			className={cn(
				"relative flex h-10 w-10 items-center justify-center border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md kala-surface-input",
				isActive && "z-10 kala-ring",
				className,
			)}
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
	...props
}: React.ComponentProps<"hr">) {
	return <hr ref={ref} className={cn(className)} {...props} />;
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
