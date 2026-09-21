import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Eye, EyeOff, Mail, Search } from "lucide-react";
import { inputStyles } from "../../config/input";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { Input } from "./input";

describe("Input", () => {
	describe("Basic Rendering", () => {
		it("renders with placeholder", () => {
			render(<Input placeholder="Enter text" />);
			expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
		});

		it("displays value correctly", () => {
			render(<Input value="test value" onChange={vi.fn()} />);
			expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
		});

		it("accepts custom className", () => {
			render(<Input className="custom-class" />);
			expect(screen.getByRole("textbox")).toHaveClass("custom-class");
		});

		it("uses the input radius token with control-radius fallback", () => {
			render(<Input />);
			expect(screen.getByRole("textbox")).toHaveClass(
				"rounded-[var(--kala-radius-input,var(--kala-radius-control))]",
			);
		});

		it("forwards ref correctly", () => {
			const ref = vi.fn();
			render(<Input ref={ref} />);
			expect(ref).toHaveBeenCalled();
		});
	});

	describe("Input Types", () => {
		it("supports text input (default)", () => {
			render(<Input />);
			expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
		});

		it("supports password input", () => {
			const { container } = render(<Input type="password" />);
			const passwordInput = container.querySelector('input[type="password"]');
			expect(passwordInput).toBeInTheDocument();
		});

		it("supports email input", () => {
			render(<Input type="email" />);
			expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
		});

		it("supports number input", () => {
			render(<Input type="number" />);
			expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
		});
	});

	describe("User Interactions", () => {
		it("handles change events", async () => {
			const handleChange = vi.fn();
			const user = userEvent.setup();
			render(<Input onChange={handleChange} />);

			await user.type(screen.getByRole("textbox"), "hello");
			expect(handleChange).toHaveBeenCalled();
		});

		it("handles focus events", async () => {
			const handleFocus = vi.fn();
			const user = userEvent.setup();
			render(<Input onFocus={handleFocus} />);

			await user.click(screen.getByRole("textbox"));
			expect(handleFocus).toHaveBeenCalled();
		});

		it("handles blur events", async () => {
			const handleBlur = vi.fn();
			const user = userEvent.setup();
			render(<Input onBlur={handleBlur} />);

			const input = screen.getByRole("textbox");
			await user.click(input);
			await user.tab();
			expect(handleBlur).toHaveBeenCalled();
		});
	});

	describe("States", () => {
		it("respects disabled prop", () => {
			render(<Input disabled />);
			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("respects readOnly prop", () => {
			render(<Input readOnly value="read only" onChange={vi.fn()} />);
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("readonly");
		});

		it("applies error state styles", () => {
			render(<Input hasError />);
			expect(screen.getByRole("textbox")).toHaveClass("border-destructive");
		});

		it("applies success state styles", () => {
			render(<Input hasSuccess />);
			expect(screen.getByRole("textbox")).toHaveClass("border-success");
		});
	});

	describe("Password Toggle", () => {
		it("shows password toggle button when enabled", () => {
			render(<Input type="password" showPasswordToggle />);
			expect(screen.getByLabelText("Show password")).toBeInTheDocument();
		});

		it("does not show toggle button when disabled", () => {
			render(<Input type="password" showPasswordToggle={false} />);
			expect(screen.queryByLabelText("Show password")).not.toBeInTheDocument();
		});

		it("does not show toggle for non-password inputs", () => {
			render(<Input type="text" showPasswordToggle />);
			expect(screen.queryByLabelText("Show password")).not.toBeInTheDocument();
		});

		it("toggles password visibility on button click", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Input type="password" showPasswordToggle />,
			);

			const toggleButton = screen.getByLabelText("Show password");
			const passwordInput = container.querySelector("input");

			expect(passwordInput).toHaveAttribute("type", "password");

			await user.click(toggleButton);
			expect(passwordInput).toHaveAttribute("type", "text");
			expect(screen.getByLabelText("Hide password")).toBeInTheDocument();

			await user.click(screen.getByLabelText("Hide password"));
			expect(passwordInput).toHaveAttribute("type", "password");
			expect(screen.getByLabelText("Show password")).toBeInTheDocument();
		});

		it("prevents toggle button from submitting forms", async () => {
			const handleSubmit = vi.fn((e) => e.preventDefault());
			const user = userEvent.setup();

			render(
				<form onSubmit={handleSubmit}>
					<Input type="password" showPasswordToggle />
					<Button type="submit">Submit</Button>
				</form>,
			);

			const toggleButton = screen.getByLabelText("Show password");
			await user.click(toggleButton);

			expect(handleSubmit).not.toHaveBeenCalled();
		});

		it("uses custom aria-labels from toggleAriaLabels", async () => {
			const user = userEvent.setup();
			render(
				<Input
					type="password"
					showPasswordToggle
					toggleAriaLabels={{
						show: "Passwort zeigen",
						hide: "Passwort verbergen",
					}}
				/>,
			);

			expect(screen.getByLabelText("Passwort zeigen")).toBeInTheDocument();

			await user.click(screen.getByLabelText("Passwort zeigen"));
			expect(screen.getByLabelText("Passwort verbergen")).toBeInTheDocument();
		});

		it("falls back per key when only show is customized", async () => {
			const user = userEvent.setup();
			render(
				<Input
					type="password"
					showPasswordToggle
					toggleAriaLabels={{ show: "Passwort zeigen" }}
				/>,
			);

			expect(screen.getByLabelText("Passwort zeigen")).toBeInTheDocument();

			await user.click(screen.getByLabelText("Passwort zeigen"));
			expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
		});

		it("falls back per key when only hide is customized", async () => {
			const user = userEvent.setup();
			render(
				<Input
					type="password"
					showPasswordToggle
					toggleAriaLabels={{ hide: "Passwort verbergen" }}
				/>,
			);

			expect(screen.getByLabelText("Show password")).toBeInTheDocument();

			await user.click(screen.getByLabelText("Show password"));
			expect(screen.getByLabelText("Passwort verbergen")).toBeInTheDocument();
		});

		it("falls back per key when only the hide glyph is customized", async () => {
			const user = userEvent.setup();
			render(
				<Input
					type="password"
					showPasswordToggle
					icons={{ hidePassword: <EyeOff data-testid="custom-hide" /> }}
					toggleAriaLabels={{ show: "show", hide: "hide" }}
				/>,
			);

			const toggle = screen.getByRole("button", { name: "show" });
			expect(toggle.querySelector("svg")).toBeInTheDocument();
			expect(toggle.querySelector("[data-testid='custom-hide']")).toBeNull();

			await user.click(toggle);
			expect(screen.getByTestId("custom-hide")).toBeInTheDocument();
		});

		it("renders custom icons from the icons prop and swaps them on click", async () => {
			const user = userEvent.setup();
			render(
				<Input
					type="password"
					showPasswordToggle
					icons={{
						showPassword: <EyeOff data-testid="custom-show" />,
						hidePassword: <Eye data-testid="custom-hide" />,
					}}
					toggleAriaLabels={{ show: "show", hide: "hide" }}
				/>,
			);

			expect(screen.getByTestId("custom-show")).toBeInTheDocument();

			await user.click(screen.getByLabelText("show"));
			expect(screen.getByTestId("custom-hide")).toBeInTheDocument();
		});
	});

	describe("Icons", () => {
		it("renders prefix icon", () => {
			render(<Input prefixIcon={<Search data-testid="search-icon" />} />);
			expect(screen.getByTestId("search-icon")).toBeInTheDocument();
		});

		it("renders suffix icon", () => {
			render(<Input suffixIcon={<Mail data-testid="mail-icon" />} />);
			expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
		});

		it("renders both prefix and suffix icons", () => {
			render(
				<Input
					prefixIcon={<Search data-testid="search-icon" />}
					suffixIcon={<Mail data-testid="mail-icon" />}
				/>,
			);
			expect(screen.getByTestId("search-icon")).toBeInTheDocument();
			expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
		});

		it("adjusts padding when prefix icon is present", () => {
			render(<Input prefixIcon={<Search />} />);
			expect(screen.getByRole("textbox")).toHaveClass("pl-10");
		});

		it("adjusts padding when suffix icon is present", () => {
			render(<Input suffixIcon={<Mail />} />);
			expect(screen.getByRole("textbox")).toHaveClass("pr-10");
		});

		it("renders suffix icon alongside password toggle", () => {
			render(
				<Input
					type="password"
					showPasswordToggle
					suffixIcon={<Mail data-testid="mail-icon" />}
				/>,
			);
			expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
			expect(screen.getByLabelText("Show password")).toBeInTheDocument();
		});
	});

	describe("Adornment wrapper semantics", () => {
		it("exposes the part addresses in the style table for slot overrides", () => {
			const parts = [
				inputStyles.wrapper,
				inputStyles.prefix,
				inputStyles.suffix,
				inputStyles.toggle,
			];
			for (const part of parts) expect(part, String(part)).toBeTruthy();
		});
		it("always houses a prefix icon in the wrapper", () => {
			const { container } = render(
				<Input prefixIcon={<Search data-testid="search-icon" />} />,
			);

			expect(
				container.querySelector('div[data-kala-component="input"]'),
			).toBeInTheDocument();
			expect(screen.getByTestId("search-icon")).toBeInTheDocument();
		});

		it("always houses a suffix icon in the wrapper", () => {
			const { container } = render(
				<Input suffixIcon={<Mail data-testid="mail-icon" />} />,
			);

			expect(
				container.querySelector('div[data-kala-component="input"]'),
			).toBeInTheDocument();
			expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
		});

		it("always houses the password toggle in the wrapper", () => {
			const { container } = render(
				<Input type="password" showPasswordToggle />,
			);

			expect(
				container.querySelector('div[data-kala-component="input"]'),
			).toBeInTheDocument();
			expect(screen.getByLabelText("Show password")).toBeInTheDocument();
		});

		it("renders the bare input with no adornments and no wrapper", () => {
			const { container } = render(<Input />);

			expect(
				container.querySelector('div[data-kala-component="input"]'),
			).not.toBeInTheDocument();
			expect(screen.getByRole("textbox").tagName).toBe("INPUT");
		});
	});

	describe("HTML Attributes", () => {
		it("accepts standard input attributes", () => {
			render(
				<Input
					name="test"
					id="test-input"
					maxLength={10}
					pattern="[A-Za-z]+"
					required
					autoComplete="off"
				/>,
			);
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("name", "test");
			expect(input).toHaveAttribute("id", "test-input");
			expect(input).toHaveAttribute("maxlength", "10");
			expect(input).toHaveAttribute("pattern", "[A-Za-z]+");
			expect(input).toHaveAttribute("required");
			expect(input).toHaveAttribute("autocomplete", "off");
		});

		it("accepts aria attributes", () => {
			render(<Input aria-label="Test input" aria-describedby="helper-text" />);
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-label", "Test input");
			expect(input).toHaveAttribute("aria-describedby", "helper-text");
		});
	});

	describe("Accessibility", () => {
		it("has proper role for text input", () => {
			render(<Input />);
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it("password toggle has accessible label", () => {
			render(<Input type="password" showPasswordToggle />);
			expect(screen.getByLabelText("Show password")).toBeInTheDocument();
		});

		it("password toggle is keyboard reachable", () => {
			render(<Input type="password" showPasswordToggle />);
			const toggleButton = screen.getByLabelText("Show password");
			expect(toggleButton).not.toHaveAttribute("tabindex", "-1");
		});
	});
});
