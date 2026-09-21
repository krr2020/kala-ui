import type { OTPInput } from "input-otp";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface InputOTPProps
	extends Omit<React.ComponentProps<typeof OTPInput>, "children"> {
	children?: React.ReactNode;
	slotStyles?: SlotStyles;
}
