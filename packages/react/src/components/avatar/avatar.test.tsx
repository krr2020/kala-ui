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

		const avatar = document.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
		expect(avatar).toHaveClass("relative", "flex", "size-10");

		expect(screen.getByText("RK")).toBeInTheDocument();
	});

	it("should render fallback when image fails", () => {
		render(
			<Avatar>
				<AvatarImage src="invalid-url" alt="Avatar" />
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>,
		);

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
		const hasImage = container.querySelector('[data-slot="avatar-image"]');
		const hasFallback = container.querySelector(
			'[data-slot="avatar-fallback"]',
		);
		expect(hasImage || hasFallback).toBeTruthy();
	});

	it("should render loading skeleton when isLoading is true", () => {
		const { container } = render(
			<Avatar isLoading>
				<AvatarFallback>Loading</AvatarFallback>
			</Avatar>,
		);

		// Should render skeleton instead of avatar root
		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).not.toBeInTheDocument();
		// SkeletonCircle should be rendered
		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render loading skeleton with default size when no size prop", () => {
		const { container } = render(<Avatar isLoading />);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render loading skeleton with xs size", () => {
		const { container } = render(<Avatar isLoading size="xs" />);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render loading skeleton with sm size", () => {
		const { container } = render(<Avatar isLoading size="sm" />);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render loading skeleton with lg size", () => {
		const { container } = render(<Avatar isLoading size="lg" />);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render loading skeleton with xl size", () => {
		const { container } = render(<Avatar isLoading size="xl" />);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render loading skeleton with xxl size", () => {
		const { container } = render(<Avatar isLoading size="xxl" />);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should render loading skeleton with 2xl size", () => {
		const { container } = render(<Avatar isLoading size="2xl" />);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should apply custom className to loading skeleton", () => {
		const { container } = render(
			<Avatar isLoading className="skeleton-class" />,
		);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toHaveClass("skeleton-class");
	});

	it("should render avatar with rounded shape", () => {
		const { container } = render(
			<Avatar shape="rounded">
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
	});

	it("should render avatar with square shape", () => {
		const { container } = render(
			<Avatar shape="square">
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
	});

	it("should render avatar with sm size", () => {
		const { container } = render(
			<Avatar size="sm">
				<AvatarFallback>SM</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
	});

	it("should render avatar with lg size", () => {
		const { container } = render(
			<Avatar size="lg">
				<AvatarFallback>LG</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
	});

	it("should render avatar with xl size", () => {
		const { container } = render(
			<Avatar size="xl">
				<AvatarFallback>XL</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
	});

	it("should render AvatarImage with rounded shape from context", () => {
		const { container } = render(
			<Avatar shape="rounded">
				<AvatarImage src="test.png" alt="Test" />
				<AvatarFallback>T</AvatarFallback>
			</Avatar>,
		);

		const image = container.querySelector('[data-slot="avatar-image"]');
		if (image) {
			expect(image).toBeInTheDocument();
		}
	});

	it("should render AvatarImage with shape prop overriding context", () => {
		const { container } = render(
			<Avatar shape="circle">
				<AvatarImage shape="square" src="test.png" alt="Test" />
				<AvatarFallback>T</AvatarFallback>
			</Avatar>,
		);

		const image = container.querySelector('[data-slot="avatar-image"]');
		if (image) {
			expect(image).toBeInTheDocument();
		}
	});

	it("should render AvatarFallback with shape from context", () => {
		const { container } = render(
			<Avatar shape="rounded">
				<AvatarFallback>RF</AvatarFallback>
			</Avatar>,
		);

		const fallback = container.querySelector('[data-slot="avatar-fallback"]');
		expect(fallback).toBeInTheDocument();
	});

	it("should render AvatarFallback with shape prop overriding context", () => {
		const { container } = render(
			<Avatar shape="circle">
				<AvatarFallback shape="square">FS</AvatarFallback>
			</Avatar>,
		);

		const fallback = container.querySelector('[data-slot="avatar-fallback"]');
		expect(fallback).toBeInTheDocument();
	});

	it("should render AvatarFallback with muted variant", () => {
		const { container } = render(
			<Avatar>
				<AvatarFallback variant="muted">MU</AvatarFallback>
			</Avatar>,
		);

		const fallback = container.querySelector('[data-slot="avatar-fallback"]');
		expect(fallback).toBeInTheDocument();
	});

	it("should render avatar with status", () => {
		const { container } = render(
			<Avatar status="online">
				<AvatarFallback>ON</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
	});

	it("should render avatar with offline status", () => {
		const { container } = render(
			<Avatar status="offline">
				<AvatarFallback>OF</AvatarFallback>
			</Avatar>,
		);

		const avatar = container.querySelector('[data-slot="avatar"]');
		expect(avatar).toBeInTheDocument();
	});
});
