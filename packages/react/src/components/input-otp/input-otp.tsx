"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";

import { cn } from "../../lib/utils";

const InputOTP = React.forwardRef<
	React.ComponentRef<typeof OTPInput>,
	Omit<React.ComponentProps<typeof OTPInput>, "ref">
>(({ className, containerClassName, ...props }, ref) => (
	<OTPInput
		ref={ref}
		containerClassName={cn(
			"flex items-center gap-2 has-[:disabled]:opacity-50",
			containerClassName,
		)}
		className={cn("disabled:cursor-not-allowed", className)}
		// Biome lint dislikes `any` here; OTPInput's props typing is strict under exactOptionalPropertyTypes.
		{...(props as unknown as React.ComponentPropsWithoutRef<typeof OTPInput>)}
	/>
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
	React.ComponentRef<"div">,
	Omit<React.ComponentProps<"div">, "ref">
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
	React.ComponentRef<"div">,
	Omit<React.ComponentProps<"div">, "ref"> & { index: number }
>(({ index, className, ...props }, ref) => {
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
				"relative flex h-10 w-10 items-center justify-center border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md theme-input",
				isActive && "z-10 ring-standard",
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
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
	React.ComponentRef<"hr">,
	Omit<React.ComponentProps<"hr">, "ref">
>(({ className, ...props }, ref) => (
	<hr ref={ref} className={cn(className)} {...props} />
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
