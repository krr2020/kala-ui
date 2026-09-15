/**
 * Accessibility port of the web `__tests__/a11y.test.tsx` contract: every
 * component must expose proper role, label, and state announcements before
 * it ships. A failure here means the component breaks screen readers — fix
 * the component, not the test.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { Alert } from "../alert";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Progress } from "../progress";
import { RadioGroup } from "../radio-group";
import { Separator } from "../separator";
import { Sheet } from "../sheet";
import { Dialog } from "../dialog";
import { AlertDialog } from "../alert-dialog";
import { EmptyState } from "../empty-state";
import { SegmentedControl } from "../segmented-control";
import { Pagination } from "../pagination";
import { Rating } from "../rating";
import { Slider } from "../slider";
import { Tag } from "../tag";
import { Tabs } from "../tabs";
import { Spinner } from "../spinner";
import { Switch } from "../switch";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Toast } from "../toast";

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

	describe("Separator", () => {
		it("decorative default is hidden from the a11y tree", async () => {
			const screen = await render(<Separator />);
			expect(
				// hidden by design — opt into the raw tree to assert the prop
				screen.getByTestId("k-separator", inclHidden).props
					.accessibilityElementsHidden,
			).toBe(true);
		});

		it("non-decorative separator stays discoverable with its label", async () => {
			const screen = await render(
				<Separator decorative={false} accessibilityLabel="section break" />,
			);
			const sep = screen.getByTestId("k-separator");
			expect(sep.props.accessibilityElementsHidden).toBeUndefined();
			expect(sep.props.accessibilityLabel).toBe("section break");
		});
	});

	describe("Spinner", () => {
		it("announces its loading label", async () => {
			const screen = await render(<Spinner size="sm" label="Syncing" />);
			expect(
				screen.getByLabelText("Syncing", inclHidden),
			).toBeTruthy();
		});
	});

	describe("Progress", () => {
		it("announces as a progressbar with min/max/now", async () => {
			const screen = await render(
				<Progress value={30} accessibilityLabel="upload" />,
			);
			const bar = screen.getByRole("progressbar", { name: "upload" });
			expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 30 });
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

	describe("RadioGroup", () => {
		it("exposes a radiogroup container with radio items and checked state", async () => {
			const screen = await render(
				<RadioGroup value="b" accessibilityLabel="plan">
					<RadioGroup.Item value="a" label="Basic" />
					<RadioGroup.Item value="b" label="Pro" />
				</RadioGroup>,
			);
			expect(
				screen.getByRole("radiogroup", { name: "plan" }),
			).toBeTruthy();
			const items = screen.getAllByRole("radio");
			expect(items).toHaveLength(2);
			expect(items[0].props.accessibilityState?.checked).toBe(false);
			expect(items[1].props.accessibilityState?.checked).toBe(true);
			expect(screen.getByRole("radio", { name: "Pro" })).toBeTruthy();
		});

		it("announces disabled items and blocks selection", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<RadioGroup value="a" onValueChange={onValueChange}>
					<RadioGroup.Item value="a" label="Basic" disabled />
				</RadioGroup>,
			);
			await fireEvent.press(screen.getByRole("radio"));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByRole("radio").props.accessibilityState?.disabled,
			).toBe(true);
		});
	});

	describe("Alert", () => {
		it("exposes role=alert with a labelled dismiss control", async () => {
			const screen = await render(
				<Alert dismissable>something happened</Alert>,
			);
			expect(screen.getByRole("alert")).toBeTruthy();
			expect(
				screen.getByRole("button", { name: "Dismiss alert" }),
			).toBeTruthy();
		});
	});

	describe("Toast", () => {
		it("exposes role=alert when open", async () => {
			const screen = await render(
				<Toast open onOpenChange={() => undefined}>
					<Toast.Title>saved</Toast.Title>
				</Toast>,
			);
			expect(screen.getByRole("alert")).toBeTruthy();
		});
	});

	describe("Tabs", () => {
		it("exposes a tablist with tab triggers and selected state", async () => {
			const screen = await render(
				<Tabs
					value="one"
					items={[
						{ value: "one", label: "One" },
						{ value: "two", label: "Two" },
					]}
				>
					one body
				</Tabs>,
			);
			expect(screen.getByRole("tablist")).toBeTruthy();
			expect(
				screen.getByRole("tab", { name: "One" }).props.accessibilityState
					?.selected,
			).toBe(true);
			expect(
				screen.getByRole("tab", { name: "Two" }).props.accessibilityState
					?.selected,
			).toBe(false);
		});

		it("announces disabled tabs and blocks selection", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Tabs
					value="one"
					onValueChange={onValueChange}
					items={[
						{ value: "one", label: "One" },
						{ value: "two", label: "Two", disabled: true },
					]}
				>
					one body
				</Tabs>,
			);
			await fireEvent.press(screen.getByRole("tab", { name: "Two" }));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByRole("tab", { name: "Two" }).props.accessibilityState
					?.disabled,
			).toBe(true);
		});
	});

	describe("SegmentedControl", () => {
		it("exposes a radiogroup with radio segments and checked state", async () => {
			const screen = await render(
				<SegmentedControl
					data={["day", "week"]}
					value="week"
					accessibilityLabel="range"
				/>,
			);
			expect(
				screen.getByRole("radiogroup", { name: "range" }),
			).toBeTruthy();
			expect(
				screen.getByRole("radio", { name: "day" }).props.accessibilityState
					?.checked,
			).toBe(false);
			expect(
				screen.getByRole("radio", { name: "week" }).props.accessibilityState
					?.checked,
			).toBe(true);
		});

		it("announces disabled segments and blocks selection", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<SegmentedControl
					data={[
						{ value: "a", label: "a" },
						{ value: "b", label: "b", disabled: true },
					]}
					value="a"
					onValueChange={onValueChange}
				/>,
			);
			await fireEvent.press(screen.getByRole("radio", { name: "b" }));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByRole("radio", { name: "b" }).props.accessibilityState
					?.disabled,
			).toBe(true);
		});
	});

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
			expect(
				screen.getByTestId("k-empty-state").props.accessibilityLabel,
			).toBe("No projects yet");
			expect(
				screen.getByRole("button", { name: "New project" }),
			).toBeTruthy();
		});
	});

	describe("Rating", () => {
		it("exposes pressable stars with per-star labels and selected state", async () => {
			const screen = await render(<Rating value={3} />);
			expect(
				screen.getByRole("button", { name: "3 stars" }).props
					.accessibilityState?.selected,
			).toBe(true);
			expect(
				screen.getByRole("button", { name: "4 stars" }).props
					.accessibilityState?.selected,
			).toBe(false);
		});

		it("readOnly announces the value summary with decorative stars", async () => {
			const screen = await render(<Rating value={4} readOnly />);
			expect(
				screen.getByRole("image", { name: "Rating: 4 out of 5 stars" }),
			).toBeTruthy();
			for (const star of screen.getAllByTestId("k-rating-star", inclHidden)) {
				expect(star.props.accessibilityElementsHidden).toBe(true);
			}
		});

		it("allowHalf readOnly formats the fraction in the summary", async () => {
			const screen = await render(
				<Rating value={2.5} allowHalf readOnly />,
			);
			expect(
				screen.getByRole("image", { name: "Rating: 2.5 out of 5 stars" }),
			).toBeTruthy();
		});

		it("disabled stars announce disabled and block presses", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Rating disabled onValueChange={onValueChange} />,
			);
			const star = screen.getByRole("button", { name: "2 stars" });
			expect(star.props.accessibilityState?.disabled).toBe(true);
			await fireEvent.press(star);
			expect(onValueChange).not.toHaveBeenCalled();
		});
	});

	describe("Pagination", () => {
		it("labels the navigation and announces the current page", async () => {
			const screen = await render(<Pagination total={5} page={2} />);
			const root = screen.getByTestId("k-pagination");
			expect(root.props.accessibilityLabel).toBe("Pagination");
			const current = screen
				.getAllByTestId("k-pagination-page")
				.find((n) => n.props.accessibilityState?.selected);
			expect(current?.props.accessibilityLabel).toBe("2");
		});

		it("ellipsis is hidden from accessibility", async () => {
			const screen = await render(<Pagination total={20} page={10} />);
			for (const ell of screen.getAllByTestId(
				"k-pagination-ellipsis",
				inclHidden,
			)) {
				expect(ell.props.accessibilityElementsHidden).toBe(true);
			}
		});

		it("prev/next announce labels and disable at bounds", async () => {
			const screen = await render(<Pagination total={3} page={1} />);
			expect(
				screen.getByRole("button", { name: "Go to previous page" }).props
					.accessibilityState?.disabled,
			).toBe(true);
			expect(
				screen.getByRole("button", { name: "Go to next page" }).props
					.accessibilityState?.disabled,
			).toBe(false);
		});
	});

	describe("Slider", () => {
		it("exposes adjustable thumbs with value announcements", async () => {
			const screen = await render(
				<Slider value={[40]} min={0} max={100} accessibilityLabel="volume" />,
			);
			const thumb = screen.getAllByTestId("k-slider-thumb", inclHidden)[0];
			expect(thumb.props.accessibilityRole).toBe("adjustable");
			expect(thumb.props.accessibilityLabel).toBe("volume");
			expect(thumb.props.accessibilityValue).toEqual({
				min: 0,
				max: 100,
				now: 40,
			});
		});

		it("increment/decrement actions adjust by step and clamp at bounds", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					defaultValue={[95]}
					min={0}
					max={100}
					step={10}
					accessibilityLabel="volume"
					onValueChange={onValueChange}
				/>,
			);
			const thumb = screen.getAllByTestId("k-slider-thumb", inclHidden)[0];
			await fireEvent(thumb, "accessibilityAction", {
				nativeEvent: { actionName: "increment" },
			});
			expect(onValueChange).toHaveBeenLastCalledWith([100]);
			await fireEvent(thumb, "accessibilityAction", {
				nativeEvent: { actionName: "increment" },
			});
			// at max: clamped, no further movement
			expect(onValueChange).toHaveBeenLastCalledWith([100]);
			await fireEvent(thumb, "accessibilityAction", {
				nativeEvent: { actionName: "decrement" },
			});
			expect(onValueChange).toHaveBeenLastCalledWith([90]);
		});

		it("disabled thumbs announce disabled and ignore a11y actions", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					value={[50]}
					disabled
					accessibilityLabel="volume"
					onValueChange={onValueChange}
				/>,
			);
			const thumb = screen.getAllByTestId("k-slider-thumb", inclHidden)[0];
			expect(thumb.props.accessibilityState?.disabled).toBe(true);
			await fireEvent(thumb, "accessibilityAction", {
				nativeEvent: { actionName: "increment" },
			});
			expect(onValueChange).not.toHaveBeenCalled();
		});
	});

	describe("Dialog", () => {
		const incl = { includeHiddenElements: true } as const;

		it("content is a modal a11y view; title is a header", async () => {
			const screen = await render(
				<Dialog open onOpenChange={() => undefined}>
					<Dialog.Header>
						<Dialog.Title>confirm</Dialog.Title>
						<Dialog.Description>are you sure</Dialog.Description>
					</Dialog.Header>
				</Dialog>,
			);
			expect(
				screen.getByTestId("k-dialog", incl).props.accessibilityViewIsModal,
			).toBe(true);
			expect(
				screen.getByTestId("k-dialog-title", incl).props.accessibilityRole,
			).toBe("header");
		});
	});

	describe("AlertDialog", () => {
		const incl = { includeHiddenElements: true } as const;

		it("container surfaces as a single alert element", async () => {
			const screen = await render(
				<AlertDialog
					open
					onOpenChange={() => undefined}
					accessibilityLabel="confirm delete"
				>
					<AlertDialog.Header>
						<AlertDialog.Title>delete?</AlertDialog.Title>
					</AlertDialog.Header>
				</AlertDialog>,
			);
			const alert = screen.getByTestId("k-alert-dialog", incl);
			expect(alert.props.accessible).toBe(true);
			expect(alert.props.accessibilityRole).toBe("alert");
			expect(alert.props.accessibilityLabel).toBe("confirm delete");
		});
	});

	describe("Tag", () => {
		it("exposes the remove affordance as a labelled button", async () => {
			const onRemove = jest.fn();
			const screen = await render(<Tag onRemove={onRemove}>beta</Tag>);
			await fireEvent.press(screen.getByRole("button", { name: "Remove" }));
			expect(onRemove).toHaveBeenCalledTimes(1);
		});
	});
});
