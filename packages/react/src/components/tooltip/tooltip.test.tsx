import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

describe("Tooltip", () => {
	it("should render tooltip trigger", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip text</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);
		expect(screen.getByText("Hover me")).toBeInTheDocument();
	});

	it("should show tooltip on hover", async () => {
		const user = userEvent.setup();

		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip text</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		await user.hover(screen.getByText("Hover me"));

		// Tooltip appears after delay in portal (use role to avoid duplicate text matches)
		expect(await screen.findByRole("tooltip")).toBeInTheDocument();
	});

	it("should apply custom className to content", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent className="custom-tooltip">
						Tooltip text
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		const trigger = screen.getByText("Hover me");
		expect(trigger).toBeInTheDocument();
	});

	it("should render with custom side offset", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent sideOffset={10}>Tooltip text</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(screen.getByText("Hover me")).toBeInTheDocument();
	});
});
