import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bold } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./toggle";

describe("Toggle", () => {
	it("should render toggle button", () => {
		render(
			<Toggle aria-label="Toggle bold">
				<Bold />
			</Toggle>,
		);
		expect(
			screen.getByRole("button", { name: "Toggle bold" }),
		).toBeInTheDocument();
	});

	it("should toggle state when clicked", async () => {
		const user = userEvent.setup();
		render(
			<Toggle aria-label="Toggle bold">
				<Bold />
			</Toggle>,
		);
		const button = screen.getByRole("button", { name: "Toggle bold" });
		expect(button).toHaveAttribute("data-state", "off");
		await user.click(button);
		expect(button).toHaveAttribute("data-state", "on");
		await user.click(button);
		expect(button).toHaveAttribute("data-state", "off");
	});

	it("should call onPressedChange when toggled", async () => {
		const user = userEvent.setup();
		const handlePressedChange = vi.fn();
		render(
			<Toggle aria-label="Toggle bold" onPressedChange={handlePressedChange}>
				<Bold />
			</Toggle>,
		);
		await user.click(screen.getByRole("button", { name: "Toggle bold" }));
		expect(handlePressedChange).toHaveBeenCalledWith(true);
	});

	it("should be disabled when disabled prop is true", () => {
		render(
			<Toggle aria-label="Toggle bold" disabled>
				<Bold />
			</Toggle>,
		);
		expect(screen.getByRole("button", { name: "Toggle bold" })).toBeDisabled();
	});

	it("should apply outline variant styles", () => {
		render(
			<Toggle aria-label="Toggle bold" variant="outline">
				<Bold />
			</Toggle>,
		);
		const button = screen.getByRole("button", { name: "Toggle bold" });
		expect(button).toHaveClass("border");
	});

	it("should apply size variants", () => {
		const { rerender } = render(
			<Toggle aria-label="Toggle bold" size="sm">
				<Bold />
			</Toggle>,
		);
		expect(screen.getByRole("button", { name: "Toggle bold" })).toHaveClass(
			"h-8",
		);

		rerender(
			<Toggle aria-label="Toggle bold" size="lg">
				<Bold />
			</Toggle>,
		);
		expect(screen.getByRole("button", { name: "Toggle bold" })).toHaveClass(
			"h-10",
		);
	});

	it("should support default pressed state", () => {
		render(
			<Toggle aria-label="Toggle bold" defaultPressed>
				<Bold />
			</Toggle>,
		);
		expect(screen.getByRole("button", { name: "Toggle bold" })).toHaveAttribute(
			"data-state",
			"on",
		);
	});

	it("should support controlled pressed state", async () => {
		const user = userEvent.setup();
		const handlePressedChange = vi.fn();
		const { rerender } = render(
			<Toggle
				aria-label="Toggle bold"
				pressed={false}
				onPressedChange={handlePressedChange}
			>
				<Bold />
			</Toggle>,
		);
		const button = screen.getByRole("button", { name: "Toggle bold" });
		expect(button).toHaveAttribute("data-state", "off");

		await user.click(button);
		expect(handlePressedChange).toHaveBeenCalledWith(true);

		rerender(
			<Toggle
				aria-label="Toggle bold"
				pressed={true}
				onPressedChange={handlePressedChange}
			>
				<Bold />
			</Toggle>,
		);
		expect(button).toHaveAttribute("data-state", "on");
	});
});
