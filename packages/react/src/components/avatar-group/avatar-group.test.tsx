import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarGroup } from "./avatar-group";

const avatars = [
	{ fallback: "AB", alt: "Alice Brown" },
	{ fallback: "CD", alt: "Carol Davis" },
	{ fallback: "EF", alt: "Eve Fisher" },
	{ fallback: "GH", alt: "Grace Hall" },
	{ fallback: "IJ", alt: "Iris Jones" },
];

describe("AvatarGroup", () => {
	it("should render visible avatars", () => {
		render(<AvatarGroup avatars={avatars.slice(0, 3)} />);

		expect(screen.getByText("AB")).toBeInTheDocument();
		expect(screen.getByText("CD")).toBeInTheDocument();
		expect(screen.getByText("EF")).toBeInTheDocument();
	});

	it("should show overflow count when avatars exceed max", () => {
		render(<AvatarGroup avatars={avatars} max={3} />);

		expect(screen.getByText("AB")).toBeInTheDocument();
		expect(screen.getByText("CD")).toBeInTheDocument();
		expect(screen.getByText("EF")).toBeInTheDocument();
		expect(screen.getByText("+2")).toBeInTheDocument();
	});

	it("should not show overflow when avatars fit within max", () => {
		render(<AvatarGroup avatars={avatars.slice(0, 3)} max={4} />);

		expect(screen.queryByText(/^\+/)).toBeNull();
	});

	it("should default max to 4", () => {
		render(<AvatarGroup avatars={avatars} />);

		// 5 avatars with max 4 → +1 overflow
		expect(screen.getByText("+1")).toBeInTheDocument();
	});

	it("should render all when max exceeds count", () => {
		render(<AvatarGroup avatars={avatars.slice(0, 2)} max={10} />);

		expect(screen.getByText("AB")).toBeInTheDocument();
		expect(screen.getByText("CD")).toBeInTheDocument();
		expect(screen.queryByText(/^\+/)).toBeNull();
	});

	it("should set data-slot", () => {
		const { container } = render(<AvatarGroup avatars={avatars.slice(0, 2)} />);

		expect(
			container.querySelector('[data-slot="avatar-group"]'),
		).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<AvatarGroup avatars={avatars.slice(0, 2)} className="custom-group" />,
		);

		expect(container.querySelector('[data-slot="avatar-group"]')).toHaveClass(
			"custom-group",
		);
	});

	it("should render with src images (fallback shown until loaded)", () => {
		const withImages = [
			{ src: "https://example.com/a.jpg", alt: "Alice", fallback: "AL" },
			{ src: "https://example.com/b.jpg", alt: "Bob", fallback: "BO" },
		];

		// In jsdom, images don't load so fallback text is shown
		render(<AvatarGroup avatars={withImages} />);
		expect(screen.getByText("AL")).toBeInTheDocument();
		expect(screen.getByText("BO")).toBeInTheDocument();
	});
});
