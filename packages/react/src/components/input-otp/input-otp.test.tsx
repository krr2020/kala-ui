import { fireEvent, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "./input-otp";

describe("InputOTP", () => {
	beforeAll(() => {
		// Mock document.elementFromPoint for input-otp
		if (typeof document !== "undefined") {
			document.elementFromPoint = () => null;
		}
		// input-otp schedules internal timers (caret/selection tracking) that
		// outlive the jsdom environment and fire `window`-dependent callbacks
		// after teardown -> "window is not defined". Fake timers virtualize them
		// so they never escape into a torn-down environment.
		vi.useFakeTimers();
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it("renders correctly", () => {
		render(
			<InputOTP maxLength={6}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
			</InputOTP>,
		);
		// input-otp renders a hidden input
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("handles input", () => {
		const handleChange = vi.fn();
		render(
			<InputOTP maxLength={3} onChange={handleChange}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
			</InputOTP>,
		);

		// Set the value via the native setter + `input` event so React's
		// controlled-input onChange fires. Synchronous and timer-independent,
		// which keeps this stable under fake timers.
		const input = screen.getByRole("textbox") as HTMLInputElement;
		const setter = Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			"value",
		)?.set;
		setter?.call(input, "123");
		fireEvent.input(input);

		expect(handleChange).toHaveBeenCalledWith("123");
	});

	it("renders separator", () => {
		render(
			<InputOTP maxLength={6}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={1} />
				</InputOTPGroup>
			</InputOTP>,
		);
		expect(screen.getByRole("separator")).toBeInTheDocument();
	});

	it("respects disabled state", () => {
		render(
			<InputOTP maxLength={3} disabled>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
			</InputOTP>,
		);
		expect(screen.getByRole("textbox")).toBeDisabled();
	});
});
