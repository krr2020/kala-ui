/**
 * Accessibility contract for the relocated composite family: role,
 * label, and state announcements carry over unchanged from the core
 * package's suite.
 */
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import {
	CopyButton,
	EmptyState,
	ErrorFallback,
	List,
	ListItem,
	LoadingOverlay,
	PasswordStrengthIndicator,
	Steps,
	Timeline,
} from "@kala-ui/react-native-app";

describe("composite a11y contract", () => {
	describe("EmptyState", () => {
		it("announces the title and exposes the action as a button", async () => {
			const onPress = jest.fn();
			const screen = await render(
				<EmptyState
					title="No projects yet"
					description="Create your first project"
					action={{ label: "New project", onPress }}
				/>,
			);
			expect(screen.getByTestId("k-empty-state").props.accessibilityLabel).toBe(
				"No projects yet",
			);
			expect(screen.getByRole("button", { name: "New project" })).toBeTruthy();
		});
	});

	describe("ErrorFallback", () => {
		it("announces as an alert", async () => {
			const screen = await render(<ErrorFallback />);
			expect(
				screen.getByTestId("k-error-fallback").props.accessibilityRole,
			).toBe("alert");
		});
	});

	describe("PasswordStrengthIndicator", () => {
		it("announces the strength tier with meter semantics", async () => {
			const screen = await render(
				<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />,
			);
			const root = screen.getByTestId("k-password-strength-indicator");
			expect(root.props.accessibilityLabel).toContain("Strong");
			expect(root.props.accessibilityValue).toEqual({ min: 0, max: 4, now: 4 });
		});
	});

	describe("Steps", () => {
		it("each step announces its position and state", async () => {
			const screen = await render(
				<Steps
					items={[{ title: "Account" }, { title: "Profile" }]}
					value={2}
					onStepChange={() => undefined}
				/>,
			);
			expect(
				screen.getByLabelText("Step 1 of 2: Account (completed)"),
			).toBeTruthy();
			expect(
				screen.getByLabelText("Step 2 of 2: Profile (current step)"),
			).toBeTruthy();
		});
	});

	describe("CopyButton", () => {
		it("announces the copied flash on a polite live region", async () => {
			const screen = await render(
				<CopyButton
					value="invite link"
					writeClipboard={async () => undefined}
				/>,
			);
			const button = screen.getByTestId("k-copy-button");
			expect(button.props.accessibilityRole).toBe("button");
			expect(button.props.accessibilityLabel).toBe("Copy to clipboard");
			expect(button.props.accessibilityLiveRegion).toBe("polite");

			await fireEvent.press(button);
			await waitFor(() =>
				expect(button.props.accessibilityLabel).toBe("Copied!"),
			);
		});
	});

	describe("Timeline", () => {
		it("Timeline items announce title, timestamp and description", async () => {
			const screen = await render(
				<Timeline
					items={[
						{
							title: "Shipped",
							description: "in transit",
							timestamp: "12:30",
						},
					]}
				/>,
			);
			const item = screen.getByTestId("k-timeline-item");
			expect(item.props.accessibilityLabel).toContain("Shipped");
			expect(item.props.accessibilityLabel).toContain("12:30");
			expect(item.props.accessibilityLabel).toContain("in transit");
		});
	});

	describe("List", () => {
		it("interactive rows announce button role; disabled announces state", async () => {
			const screen = await render(
				<ListItem interactive onPress={() => undefined}>
					row
				</ListItem>,
			);
			expect(screen.getByRole("button", { name: "row" })).toBeTruthy();

			const off = await render(
				<ListItem interactive disabled onPress={() => undefined}>
					row
				</ListItem>,
			);
			expect(
				off.getByTestId("k-list-item").props.accessibilityState?.disabled,
			).toBe(true);
		});

		it("href rows announce link role and the container is a list", async () => {
			const screen = await render(
				<List>
					<ListItem href="https://example.com">docs</ListItem>
				</List>,
			);
			expect(screen.getByTestId("k-list").props.accessibilityRole).toBe("list");
			expect(screen.getByRole("link", { name: "docs" })).toBeTruthy();
		});
	});

	describe("LoadingOverlay", () => {
		it("announces itself while visible and stays absent when hidden", async () => {
			const shown = await render(<LoadingOverlay visible />);
			expect(
				shown.getByTestId("k-loading-overlay").props.accessibilityLabel,
			).toBe("Loading");
			const hidden = await render(<LoadingOverlay visible={false} />);
			expect(hidden.queryByTestId("k-loading-overlay")).toBeNull();
		});
	});
});
