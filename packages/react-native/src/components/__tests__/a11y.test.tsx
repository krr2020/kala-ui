/**
 * Accessibility port of the web `__tests__/a11y.test.tsx` contract: every
 * component must expose proper role, label, and state announcements before
 * it ships. A failure here means the component breaks screen readers — fix
 * the component, not the test.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Sheet } from "../sheet";
import { Switch } from "../switch";
import { Text } from "../text";
import { TextInput } from "../text-input";

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

	describe("Text", () => {
		it("is findable by its text content", async () => {
			const screen = await render(<Text>Hello kala</Text>);
			expect(screen.getByText("Hello kala")).toBeTruthy();
		});
	});

	describe("Heading", () => {
		it("announces as a header", async () => {
			const screen = await render(<Heading>Section title</Heading>);
			expect(
				screen.getByRole("header", { name: "Section title" }),
			).toBeTruthy();
		});
	});

	describe("TextInput", () => {
		// RN's AccessibilityRole vocab has no "textbox" (the native control
		// announces itself); the assertable contract is label wiring + state.
		it("passes the accessibility label through", async () => {
			const screen = await render(
				<TextInput accessibilityLabel="Email address" />,
			);
			expect(screen.getByTestId("k-text-input").props.accessibilityLabel).toBe(
				"Email address",
			);
		});

		it("announces disabled state and blocks editing", async () => {
			const screen = await render(
				<TextInput accessibilityLabel="e" disabled />,
			);
			const input = screen.getByTestId("k-text-input");
			expect(input.props.accessibilityState?.disabled).toBe(true);
			expect(input.props.editable).toBe(false);
		});
	});

	describe("Avatar", () => {
		it("announces as an image named after the person", async () => {
			const screen = await render(<Avatar name="Ada Lovelace" />);
			expect(
				screen.getByRole("image", { name: "Ada Lovelace" }),
			).toBeTruthy();
		});
	});

	describe("Checkbox", () => {
		it("exposes role=checkbox with checked and indeterminate states", async () => {
			const screen = await render(
				<Checkbox accessibilityLabel="Accept terms" value />,
			);
			expect(
				screen.getByRole("checkbox", { name: "Accept terms" }),
			).toBeTruthy();
			expect(
				screen.getByRole("checkbox").props.accessibilityState?.checked,
			).toBe(true);

			await screen.rerender(
				<Checkbox accessibilityLabel="Accept terms" value="indeterminate" />,
			);
			expect(
				screen.getByRole("checkbox").props.accessibilityState?.checked,
			).toBe("mixed");
		});

		it("announces disabled state and blocks toggling", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Checkbox
					accessibilityLabel="a"
					disabled
					value={false}
					onValueChange={onValueChange}
				/>,
			);
			await fireEvent.press(screen.getByRole("checkbox"));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByRole("checkbox").props.accessibilityState?.disabled,
			).toBe(true);
		});
	});

	describe("Switch", () => {
		it("exposes role=switch with the checked state", async () => {
			const screen = await render(
				<Switch accessibilityLabel="Auto sync" value />,
			);
			expect(
				screen.getByRole("switch", { name: "Auto sync" }),
			).toBeTruthy();
			expect(
				screen.getByRole("switch").props.accessibilityState?.checked,
			).toBe(true);
		});

		it("announces disabled state and blocks toggling", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Switch
					accessibilityLabel="s"
					disabled
					value={false}
					onValueChange={onValueChange}
			/>,
			);
			await fireEvent.press(screen.getByRole("switch"));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByRole("switch").props.accessibilityState?.disabled,
			).toBe(true);
		});
	});
});
