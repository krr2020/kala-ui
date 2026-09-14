/**
 * Accessibility port of the web `__tests__/a11y.test.tsx` contract: every
 * component must expose proper role, label, and state announcements before
 * it ships. A failure here means the component breaks screen readers — fix
 * the component, not the test.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";
import { Sheet } from "../sheet/sheet";

// TLB v14 queries are a11y-aware: deliberately-hidden elements (Icon without
// a label) and siblings of an accessibilityViewIsModal container (the Sheet
// overlay) are excluded by default — opt back in where the contract needs
// the raw tree.
const inclHidden = { includeHiddenElements: true } as const;

describe("a11y contract", () => {
	describe("Button", () => {
		it("exposes role=button and passes the label through", async () => {
			const screen = await render(
				<Button accessibilityLabel="Save document">Save</Button>,
			);
			expect(
				screen.getByRole("button", { name: "Save document" }),
			).toBeTruthy();
			expect(screen.getByText("Save")).toBeTruthy();
		});

		it("announces disabled state", async () => {
			const screen = await render(<Button disabled>Save</Button>);
			const btn = screen.getByRole("button");
			expect(btn.props.accessibilityState?.disabled).toBe(true);
		});

		it("announces busy state while loading and disables presses", async () => {
			const onPress = jest.fn();
			const screen = await render(
				<Button isLoading onPress={onPress}>
					Save
				</Button>,
			);
			const btn = screen.getByRole("button");
			expect(btn.props.accessibilityState?.busy).toBe(true);
			await fireEvent.press(btn);
			expect(onPress).not.toHaveBeenCalled();
		});

		it("does not fire onPress when disabled", async () => {
			const onPress = jest.fn();
			const screen = await render(
				<Button disabled onPress={onPress}>
					Save
				</Button>,
			);
			await fireEvent.press(screen.getByRole("button"));
			expect(onPress).not.toHaveBeenCalled();
		});
	});

	describe("Icon", () => {
		it("is hidden from the accessibility tree by default", async () => {
			const screen = await render(<Icon icon={Sun} />);
			const icon = screen.getByTestId("k-icon", inclHidden);
			expect(icon.props.accessibilityElementsHidden).toBe(true);
		});

		it("becomes an image with a label when given one", async () => {
			const screen = await render(<Icon icon={Sun} label="Sun" />);
			expect(screen.getByRole("image", { name: "Sun" })).toBeTruthy();
		});
	});

	describe("Sheet", () => {
		it("overlay is a labelled dismiss control", async () => {
			const screen = await render(
				<Sheet open onClose={() => {}}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>,
			);
			expect(
				screen.getByRole("button", { name: /close/i, ...inclHidden }),
			).toBeTruthy();
		});

		it("overlay press calls onClose when dismissable", async () => {
			const onClose = jest.fn();
			const screen = await render(
				<Sheet open onClose={onClose}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>,
			);
			await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it("dismissable=false blocks overlay dismissal", async () => {
			const onClose = jest.fn();
			const screen = await render(
				<Sheet open onClose={onClose} dismissable={false}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>,
			);
			await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
			expect(onClose).not.toHaveBeenCalled();
		});
	});
});
