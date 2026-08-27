/**
 * SocialLoginButtons Tests
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SocialLoginButtons } from "./social-login-buttons";

describe("SocialLoginButtons", () => {
	it("should render all 5 providers by default", () => {
		render(<SocialLoginButtons onProviderClick={vi.fn()} />);
		expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /facebook/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /linkedin/i }),
		).toBeInTheDocument();
	});

	it("should render divider by default", () => {
		render(<SocialLoginButtons onProviderClick={vi.fn()} />);
		expect(screen.getByText("Or sign in with")).toBeInTheDocument();
	});

	it("should hide divider when showDivider is false", () => {
		render(
			<SocialLoginButtons onProviderClick={vi.fn()} showDivider={false} />,
		);
		expect(screen.queryByText("Or continue with")).not.toBeInTheDocument();
	});

	it("should render only specified providers", () => {
		render(
			<SocialLoginButtons
				onProviderClick={vi.fn()}
				providers={["google", "github"]}
			/>,
		);
		expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /facebook/i }),
		).not.toBeInTheDocument();
	});

	it("should call onProviderClick with correct provider", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(<SocialLoginButtons onProviderClick={handleClick} />);

		await user.click(screen.getByRole("button", { name: /google/i }));
		expect(handleClick).toHaveBeenCalledWith("google");
	});

	it("should show loading state for specific provider", () => {
		render(
			<SocialLoginButtons onProviderClick={vi.fn()} loadingProvider="google" />,
		);
		expect(screen.getByText("Redirecting...")).toBeInTheDocument();
	});

	it("should disable other providers when one is loading", () => {
		render(
			<SocialLoginButtons onProviderClick={vi.fn()} loadingProvider="google" />,
		);

		// Google button should have "Redirecting..." text and be disabled (isLoading=true)
		const googleButton = screen.getByText("Redirecting...").closest("button");
		expect(googleButton).toBeInTheDocument();

		// GitHub button should be disabled (different provider is loading)
		const githubButton = screen.getByRole("button", { name: /github/i });
		expect(githubButton).toBeDisabled();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<SocialLoginButtons onProviderClick={vi.fn()} className="custom-class" />,
		);
		expect(container.firstChild).toHaveClass("custom-class");
	});

	it("should render in grid layout", () => {
		const { container } = render(
			<SocialLoginButtons onProviderClick={vi.fn()} />,
		);
		const flexContainer = container.querySelector(".flex.flex-wrap");
		expect(flexContainer).toBeInTheDocument();
	});
});
