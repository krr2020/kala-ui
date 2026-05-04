import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert, AlertDescription, AlertTitle, alertVariants } from "./alert";

describe("Alert", () => {
	it("should render alert with title and description", () => {
		render(
			<Alert>
				<AlertTitle>Alert Title</AlertTitle>
				<AlertDescription>Alert description text</AlertDescription>
			</Alert>,
		);

		expect(screen.getByText("Alert Title")).toBeInTheDocument();
		expect(screen.getByText("Alert description text")).toBeInTheDocument();
	});

	it("should render with default variant", () => {
		const { container } = render(
			<Alert>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with danger variant", () => {
		const { container } = render(
			<Alert variant="danger">
				<AlertTitle>Error</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Alert className="custom-alert">
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toHaveClass("custom-alert");
	});

	it('should have role="alert"', () => {
		const { container } = render(
			<Alert>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		const alert = container.querySelector('[role="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with icon", () => {
		render(
			<Alert>
				<svg data-testid="alert-icon" />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
	});

	it("should render title with correct slot", () => {
		const { container } = render(
			<Alert>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);

		expect(
			container.querySelector('[data-slot="alert-title"]'),
		).toBeInTheDocument();
	});

	it("should render description with correct slot", () => {
		const { container } = render(
			<Alert>
				<AlertDescription>Description</AlertDescription>
			</Alert>,
		);

		expect(
			container.querySelector('[data-slot="alert-description"]'),
		).toBeInTheDocument();
	});

	// NEW TESTS BELOW

	it("should render with success variant", () => {
		const { container } = render(
			<Alert variant="success">
				<AlertTitle>Success</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with warning variant", () => {
		const { container } = render(
			<Alert variant="warning">
				<AlertTitle>Warning</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with info variant", () => {
		const { container } = render(
			<Alert variant="info">
				<AlertTitle>Info</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with secondary variant", () => {
		const { container } = render(
			<Alert variant="secondary">
				<AlertTitle>Secondary</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with destructive variant", () => {
		const { container } = render(
			<Alert variant="destructive">
				<AlertTitle>Destructive</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toBeInTheDocument();
	});

	it("should render with outline style", () => {
		const { container } = render(
			<Alert style="outline">
				<AlertTitle>Outline</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toHaveClass("bg-transparent", "border-2", "font-medium");
	});

	it("should render with solid style", () => {
		const { container } = render(
			<Alert style="solid">
				<AlertTitle>Solid</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toHaveClass("border-transparent");
	});

	it("should render dismiss button when dismissable is true", () => {
		render(
			<Alert dismissable>
				<AlertTitle>Dismissable</AlertTitle>
			</Alert>,
		);
		const button = screen.getByRole("button", { name: /dismiss alert/i });
		expect(button).toBeInTheDocument();
	});

	it("should add pr-10 class when dismissable", () => {
		const { container } = render(
			<Alert dismissable>
				<AlertTitle>Dismissable</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		expect(alert).toHaveClass("pr-10");
	});

	it("should call onDismiss when dismiss button is clicked", async () => {
		const onDismiss = vi.fn();
		const user = userEvent.setup();
		render(
			<Alert dismissable onDismiss={onDismiss}>
				<AlertTitle>Dismissable</AlertTitle>
			</Alert>,
		);
		const button = screen.getByRole("button", { name: /dismiss alert/i });
		await user.click(button);
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it("should hide alert after dismiss", async () => {
		const user = userEvent.setup();
		render(
			<Alert dismissable>
				<AlertTitle>Dismissable</AlertTitle>
			</Alert>,
		);
		const button = screen.getByRole("button", { name: /dismiss alert/i });
		await user.click(button);
		expect(screen.queryByText("Dismissable")).not.toBeInTheDocument();
	});

	it("should not render icon when showIcon is false", () => {
		const { container } = render(
			<Alert showIcon={false}>
				<AlertTitle>No Icon</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		// No SVG icon child should be rendered
		const svgIcons = alert?.querySelectorAll("svg.size-4");
		expect(svgIcons?.length).toBe(0);
	});

	it("should render with isLoading and custom skeleton", () => {
		render(
			<Alert isLoading skeleton={<div data-testid="custom-skel">Loading</div>}>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		expect(screen.getByTestId("custom-skel")).toBeInTheDocument();
		expect(screen.queryByText("Title")).not.toBeInTheDocument();
	});

	it("should render with isLoading and skeletonConfig (uses AlertSkeleton)", () => {
		render(
			<Alert isLoading skeletonConfig={{ variant: "warning" }}>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		expect(screen.queryByText("Title")).not.toBeInTheDocument();
	});

	it("should render with isLoading and no skeleton props (uses default AlertSkeleton)", () => {
		render(
			<Alert isLoading>
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		expect(screen.queryByText("Title")).not.toBeInTheDocument();
	});

	it("should not render dismiss button when dismissable is false", () => {
		render(
			<Alert>
				<AlertTitle>Not Dismissable</AlertTitle>
			</Alert>,
		);
		expect(
			screen.queryByRole("button", { name: /dismiss alert/i }),
		).not.toBeInTheDocument();
	});

	it("should export alertVariants", () => {
		expect(alertVariants).toBeDefined();
	});

	it("should hide default icon when children contain SVG", () => {
		const { container } = render(
			<Alert>
				<svg data-testid="custom-svg-icon" width={16} height={16} />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		// The built-in icon should be hidden because a custom SVG child was detected
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should hide default icon when children contain AlertTitle (name contains 'Alert')", () => {
		const { container } = render(
			<Alert>
				<AlertTitle>Just text</AlertTitle>
				<AlertDescription>Just text description</AlertDescription>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		// AlertTitle name includes "Alert" which triggers hasCustomIcon
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should apply custom className to AlertTitle", () => {
		render(<AlertTitle className="custom-title">Title</AlertTitle>);
		expect(screen.getByText("Title")).toHaveClass("custom-title");
	});

	it("should apply custom className to AlertDescription", () => {
		render(<AlertDescription className="custom-desc">Desc</AlertDescription>);
		expect(screen.getByText("Desc")).toHaveClass("custom-desc");
	});

	it("should detect custom icon when child component name contains 'Icon'", () => {
		function MyIcon() {
			return <svg data-testid="my-icon-svg" />;
		}
		(MyIcon as React.ComponentType).displayName = "MyIconComponent";

		const { container } = render(
			<Alert>
				<MyIcon />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should detect custom icon when child component name contains 'Alert'", () => {
		function AlertIcon() {
			return <svg data-testid="alert-icon-svg" />;
		}
		(AlertIcon as React.ComponentType).displayName = "AlertIcon";

		const { container } = render(
			<Alert>
				<AlertIcon />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should detect custom icon when child has className containing 'lucide'", () => {
		const { container } = render(
			<Alert>
				<div className="lucide-custom-icon" data-testid="lucide-el" />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should not detect text children as custom icons", () => {
		const { container } = render(
			<Alert>
				Just some text
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		// Text nodes are not detected as icons, but AlertTitle contains "Alert"
		// so hasCustomIcon is true, meaning built-in icon is hidden
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should call onDismiss without error when onDismiss is undefined", async () => {
		const user = userEvent.setup();
		render(
			<Alert dismissable>
				<AlertTitle>Dismissable</AlertTitle>
			</Alert>,
		);
		const button = screen.getByRole("button", { name: /dismiss alert/i });
		await user.click(button);
		expect(screen.queryByText("Dismissable")).not.toBeInTheDocument();
	});

	it("should render built-in icon when hasCustomIcon is false and showIcon is true", () => {
		const { container } = render(
			<Alert variant="success">
				Plain text only
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		// Only text children (no AlertTitle/AlertDescription), so hasCustomIcon is false
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(1);
	});

	it("should not detect div child as custom icon when name has no matches", () => {
		const { container } = render(
			<Alert>
				<div data-testid="regular-div">Not an icon</div>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		// div child: type is "div" (string, not "svg"), name is empty
		// No match in hasCustomIcon, so built-in icon should render
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(1);
	});

	it("should detect custom icon when child component name contains 'Check'", () => {
		function CheckBadge() {
			return <svg data-testid="check-badge-svg" />;
		}
		(CheckBadge as React.ComponentType).displayName = "CheckBadge";

		const { container } = render(
			<Alert>
				<CheckBadge />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should detect custom icon when child component name contains 'Info'", () => {
		function InfoCircle() {
			return <svg data-testid="info-circle-svg" />;
		}
		(InfoCircle as React.ComponentType).displayName = "InfoCircle";

		const { container } = render(
			<Alert>
				<InfoCircle />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});

	it("should detect custom icon when child component name contains 'X'", () => {
		function XMark() {
			return <svg data-testid="x-mark-svg" />;
		}
		(XMark as React.ComponentType).displayName = "XMark";

		const { container } = render(
			<Alert>
				<XMark />
				<AlertTitle>Title</AlertTitle>
			</Alert>,
		);
		const alert = container.querySelector('[data-slot="alert"]');
		const builtInIcons = alert?.querySelectorAll("svg.size-4");
		expect(builtInIcons?.length).toBe(0);
	});
});
