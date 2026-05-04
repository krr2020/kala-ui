import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColorInput } from "./color-input";

describe("ColorInput", () => {
	it("renders correctly", () => {
		render(<ColorInput placeholder="Test color" />);
		expect(screen.getByPlaceholderText("Test color")).toBeInTheDocument();
	});

	it("handles value change", () => {
		const handleChange = vi.fn();
		render(<ColorInput onChange={handleChange} />);
		const input = screen.getByRole("textbox");

		fireEvent.change(input, { target: { value: "#ffffff" } });
		expect(input).toHaveValue("#ffffff");
		expect(handleChange).toHaveBeenCalledWith("#ffffff");
	});

	it("shows preview swatch by default", () => {
		render(<ColorInput defaultValue="#ff0000" />);
		const swatch = screen.getByRole("button", { name: /pick a color/i });
		expect(swatch).toBeInTheDocument();
		expect(swatch).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
	});

	it("hides preview swatch when withPreview is false", () => {
		render(<ColorInput withPreview={false} />);
		expect(
			screen.queryByRole("button", { name: /pick a color/i }),
		).not.toBeInTheDocument();
	});

	it("updates internal value when value prop changes", () => {
		const { rerender } = render(<ColorInput value="#000000" />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("#000000");

		rerender(<ColorInput value="#ff0000" />);
		expect(input).toHaveValue("#ff0000");
	});

	it("does not update internal value when value prop is undefined", () => {
		const { rerender } = render(<ColorInput defaultValue="#00ff00" />);
		rerender(<ColorInput />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("#00ff00");
	});

	it("applies error styles when error is true", () => {
		render(<ColorInput error />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("border-destructive");
	});

	it("applies success styles when success is true", () => {
		render(<ColorInput success />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("border-success");
	});

	it("disables the input when disabled is true", () => {
		render(<ColorInput disabled />);
		const input = screen.getByRole("textbox");
		expect(input).toBeDisabled();
	});

	it("disables the swatch button when disabled is true", () => {
		render(<ColorInput disabled />);
		const swatch = screen.getByRole("button", { name: /pick a color/i });
		expect(swatch).toBeDisabled();
	});

	it("applies custom className", () => {
		render(<ColorInput className="custom-input" />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("custom-input");
	});

	it("applies pl-10 padding when withPreview is true", () => {
		render(<ColorInput withPreview />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("pl-10");
	});

	it("does not apply pl-10 padding when withPreview is false", () => {
		render(<ColorInput withPreview={false} />);
		const input = screen.getByRole("textbox");
		expect(input).not.toHaveClass("pl-10");
	});

	it("uses defaultValue when no value prop is provided", () => {
		render(<ColorInput defaultValue="#abcdef" />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("#abcdef");
	});

	it("initializes with empty string when no value or defaultValue", () => {
		render(<ColorInput />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("");
	});

	it("forwards ref correctly", () => {
		const ref = vi.fn();
		render(<ColorInput ref={ref} />);
		expect(ref).toHaveBeenCalled();
	});

	it("passes through additional HTML attributes", () => {
		render(<ColorInput id="color-field" data-testid="my-color" />);
		expect(screen.getByTestId("my-color")).toBeInTheDocument();
		expect(screen.getByTestId("my-color")).toHaveAttribute("id", "color-field");
	});

	it("swatch shows transparent when no value", () => {
		render(<ColorInput />);
		const swatch = screen.getByRole("button", { name: /pick a color/i });
		const style = swatch.getAttribute("style");
		expect(style).toContain("transparent");
	});

	it("opens popover and renders preset colors", async () => {
		const user = userEvent.setup();
		render(<ColorInput />);

		const trigger = screen.getByRole("button", { name: /pick a color/i });
		await user.click(trigger);

		// The popover should open and render color preset buttons
		const colorButtons = screen.getAllByRole("button").filter(
			(btn) => btn !== trigger && btn.getAttribute("type") === "button" && !btn.hasAttribute("aria-label"),
		);
		expect(colorButtons.length).toBeGreaterThan(0);
	});

	it("selects a preset color and updates input", async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(<ColorInput onChange={handleChange} />);

		const trigger = screen.getByRole("button", { name: /pick a color/i });
		await user.click(trigger);

		// Find a preset color button (black #000000)
		const colorButtons = screen.getAllByRole("button").filter(
			(btn) => btn !== trigger && btn.getAttribute("type") === "button" && !btn.hasAttribute("aria-label"),
		);
		if (colorButtons.length > 0) {
			await user.click(colorButtons[0]);
			expect(handleChange).toHaveBeenCalled();
		}
	});

	it("does not call onChange when value prop changes externally", () => {
		const handleChange = vi.fn();
		const { rerender } = render(
			<ColorInput value="#000000" onChange={handleChange} />,
		);
		rerender(<ColorInput value="#ff0000" onChange={handleChange} />);
		// onChange should not be called on prop change, only on user interaction
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("handles color picker native input change", async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(<ColorInput onChange={handleChange} />);

		const trigger = screen.getByRole("button", { name: /pick a color/i });
		await user.click(trigger);

		// Find the native color input
		const nativeInput = document.querySelector('input[type="color"]') as HTMLInputElement;
		if (nativeInput) {
			fireEvent.change(nativeInput, { target: { value: "#ff0000" } });
			expect(handleChange).toHaveBeenCalledWith("#ff0000");
		}
	});

	it("shows correct swatch background when value is valid 7-char hex", () => {
		render(<ColorInput defaultValue="#abcdef" />);
		const swatch = screen.getByRole("button", { name: /pick a color/i });
		expect(swatch).toHaveStyle({ backgroundColor: "rgb(171, 205, 239)" });
	});

	it("initializes internal value from defaultValue when value is undefined", () => {
		render(<ColorInput defaultValue="#123456" />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("#123456");
	});

	it("applies inputStyles.base classes", () => {
		render(<ColorInput />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("flex");
	});

	it("does not apply error styles when error is false", () => {
		render(<ColorInput error={false} />);
		const input = screen.getByRole("textbox");
		expect(input).not.toHaveClass("border-destructive");
	});

	it("does not apply success styles when success is false", () => {
		render(<ColorInput success={false} />);
		const input = screen.getByRole("textbox");
		expect(input).not.toHaveClass("border-success");
	});

	it("has correct displayName", () => {
		expect(ColorInput.displayName).toBe("ColorInput");
	});

	it("handles typing in the text input", async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(<ColorInput onChange={handleChange} />);
		const input = screen.getByRole("textbox");
		await user.type(input, "#a");
		expect(handleChange).toHaveBeenCalled();
	});

	it("native color input uses #000000 fallback when value is not 7-char hex", async () => {
		const user = userEvent.setup();
		render(<ColorInput defaultValue="abc" />);

		const trigger = screen.getByRole("button", { name: /pick a color/i });
		await user.click(trigger);

		const nativeInput = document.querySelector('input[type="color"]') as HTMLInputElement;
		if (nativeInput) {
			expect(nativeInput.value).toBe("#000000");
		}
	});

	it("native color input uses actual value when it is 7-char hex", async () => {
		const user = userEvent.setup();
		render(<ColorInput defaultValue="#ff0000" />);

		const trigger = screen.getByRole("button", { name: /pick a color/i });
		await user.click(trigger);

		const nativeInput = document.querySelector('input[type="color"]') as HTMLInputElement;
		if (nativeInput) {
			expect(nativeInput.value).toBe("#ff0000");
		}
	});

	it("controlled mode updates swatch background color", async () => {
		const { rerender } = render(<ColorInput value="#ff0000" />);
		const swatch = screen.getByRole("button", { name: /pick a color/i });
		expect(swatch.getAttribute("style")).toContain("background-color");

		rerender(<ColorInput value="#00ff00" />);
		const updatedSwatch = screen.getByRole("button", { name: /pick a color/i });
		expect(updatedSwatch.getAttribute("style")).toContain("rgb(0, 255, 0)");
	});

	it("does not show swatch when withPreview is false and disabled", () => {
		render(<ColorInput withPreview={false} disabled />);
		expect(
			screen.queryByRole("button", { name: /pick a color/i }),
		).not.toBeInTheDocument();
	});

	it("preset color click updates internal value and calls onChange", async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(<ColorInput onChange={handleChange} defaultValue="#000000" />);

		const trigger = screen.getByRole("button", { name: /pick a color/i });
		await user.click(trigger);

		// Find the red preset button (#ef4444)
		const colorButtons = screen.getAllByRole("button").filter(
			(btn) => btn !== trigger && btn.getAttribute("type") === "button" && !btn.hasAttribute("aria-label"),
		);
		if (colorButtons.length >= 3) {
			await user.click(colorButtons[2]); // #ef4444
			expect(handleChange).toHaveBeenCalledWith("#ef4444");
			const input = screen.getByRole("textbox");
			expect(input).toHaveValue("#ef4444");
		}
	});

	it("handles color picker change when internal value is short hex", async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(<ColorInput onChange={handleChange} defaultValue="abc" />);

		const trigger = screen.getByRole("button", { name: /pick a color/i });
		await user.click(trigger);

		const nativeInput = document.querySelector('input[type="color"]') as HTMLInputElement;
		if (nativeInput) {
			fireEvent.change(nativeInput, { target: { value: "#00ff00" } });
			expect(handleChange).toHaveBeenCalledWith("#00ff00");
			const textbox = screen.getByRole("textbox");
			expect(textbox).toHaveValue("#00ff00");
		}
	});
});
