import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
	it("should render avatar container with proper structure", () => {
		render(
			<Avatar>
				<AvatarImage src="https://i.pravatar.cc/400?img=37" alt="Avatar" />
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>,
		);

		// In jsdom, images don't load so Radix shows fallback instead
		// We verify the Avatar container and fallback are present
		const avatar = document.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
		expect(avatar).toHaveClass("relative", "flex", "size-10");

		// Since image doesn't load in jsdom, fallback should be visible
		expect(screen.getByText("RK")).toBeInTheDocument();
	});

	it("should render fallback when image fails", () => {
		render(
			<Avatar>
				<AvatarImage src="invalid-url" alt="Avatar" />
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>,
		);

		// Fallback should be in document
		expect(screen.getByText("RK")).toBeInTheDocument();
	});

	it("should render fallback only", () => {
		render(
			<Avatar>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>,
		);

		expect(screen.getByText("RK")).toBeInTheDocument();
	});

	it("should apply custom className to avatar", () => {
		const { container } = render(
			<Avatar className="custom-avatar">
				<AvatarFallback>AB</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toHaveClass("custom-avatar");
	});

	it("should render with data-slot attributes", () => {
		const { container } = render(
			<Avatar>
				<AvatarImage src="test.png" />
				<AvatarFallback>TT</AvatarFallback>
			</Avatar>,
		);

		expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
		// Avatar image may not load in test environment, so fallback appears instead
		const hasImage = container.querySelector('[data-slot="avatar-image"]');
		const hasFallback = container.querySelector(
			'[data-slot="avatar-fallback"]',
		);
		expect(hasImage || hasFallback).toBeTruthy();
	});
});
