/**
 * SocialLoginButton Tests
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SocialLoginButton } from "./social-login-button";

describe("SocialLoginButton", () => {
	it("should render with Google provider", () => {
		render(<SocialLoginButton provider="google" onClick={vi.fn()} />);
		expect(screen.getByRole("button")).toHaveTextContent("Google");
	});

	it("should render with GitHub provider", () => {
		render(<SocialLoginButton provider="github" onClick={vi.fn()} />);
		expect(screen.getByRole("button")).toHaveTextContent("GitHub");
	});

	it("should render with Facebook provider", () => {
		render(<SocialLoginButton provider="facebook" onClick={vi.fn()} />);
		expect(screen.getByRole("button")).toHaveTextContent("Facebook");
	});

	it("should render with Twitter provider", () => {
		render(<SocialLoginButton provider="twitter" onClick={vi.fn()} />);
		expect(screen.getByRole("button")).toHaveTextContent("X");
	});

	it("should render with LinkedIn provider", () => {
		render(<SocialLoginButton provider="linkedin" onClick={vi.fn()} />);
		expect(screen.getByRole("button")).toHaveTextContent("LinkedIn");
	});

	it("should render custom label", () => {
		render(
			<SocialLoginButton
				provider="google"
				label="Sign in with Google"
				onClick={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Sign in with Google");
	});

	it("should show loading state", () => {
		render(
			<SocialLoginButton
				provider="google"
				isLoading={true}
				onClick={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Redirecting...");
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should be disabled when isLoading is true", () => {
		render(
			<SocialLoginButton
				provider="google"
				isLoading={true}
				onClick={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should be disabled when disabled prop is true", () => {
		render(
			<SocialLoginButton provider="google" disabled={true} onClick={vi.fn()} />,
		);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should call onClick when clicked", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(<SocialLoginButton provider="google" onClick={handleClick} />);

		await user.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should not call onClick when disabled", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(
			<SocialLoginButton
				provider="google"
				disabled={true}
				onClick={handleClick}
			/>,
		);

		await user.click(screen.getByRole("button"));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("should apply custom className", () => {
		render(
			<SocialLoginButton
				provider="google"
				className="custom-class"
				onClick={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button")).toHaveClass("custom-class");
	});

	it("should have outline variant", () => {
		render(<SocialLoginButton provider="google" onClick={vi.fn()} />);
		expect(screen.getByRole("button")).toHaveClass("border");
		expect(screen.getByRole("button")).toHaveClass("border-input");
	});
});
