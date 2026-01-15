import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

	it("handles input", async () => {
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

		const input = screen.getByRole("textbox");
		await userEvent.type(input, "123");
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
