/**
 * Accessibility port of the web `__tests__/a11y.test.tsx` contract: every
 * component must expose proper role, label, and state announcements before
 * it ships. A failure here means the component breaks screen readers — fix
 * the component, not the test.
 */
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { Accordion } from "../accordion";
import { Alert } from "../alert";
import { AlertDialog } from "../alert-dialog";
import { Avatar } from "../avatar";
import { AvatarGroup } from "../avatar-group";
import { Banner } from "../banner";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Checkbox } from "../checkbox";
import { Collapsible } from "../collapsible";
import { Combobox } from "../combobox";
import { ContextMenu } from "../context-menu";
import { DatePicker } from "../date-picker";
import { Dialog } from "../dialog";
import { DropdownMenu } from "../dropdown-menu";
import { Field } from "../field";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { InputOtp, InputOtpSlot } from "../input-otp";
import { MultiSelect } from "../multi-select";
import { NumberInput } from "../number-input";
import { Progress } from "../progress";
import { RadioGroup } from "../radio-group";
import { Rating } from "../rating";
import { RingProgress } from "../ring-progress";
import { SegmentedControl } from "../segmented-control";
import { Select } from "../select";
import { Separator } from "../separator";
import { Sheet } from "../sheet";
import { Slider } from "../slider";
import { Spinner } from "../spinner";
import { Switch } from "../switch";
import { Tabs } from "../tabs";
import { Tag } from "../tag";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Textarea } from "../textarea";
import { TimePicker } from "../time-picker";
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
			expect(screen.getByLabelText("Syncing", inclHidden)).toBeTruthy();
		});
	});

	describe("Progress", () => {
		it("announces as a progressbar with min/max/now", async () => {
			const screen = await render(
				<Progress value={30} accessibilityLabel="upload" />,
			);
			const bar = screen.getByRole("progressbar", { name: "upload" });
			expect(bar.props.accessibilityValue).toEqual({
				min: 0,
				max: 100,
				now: 30,
			});
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

	describe("NumberInput", () => {
		it("labels the steppers and passes the field label through", async () => {
			const screen = await render(
				<NumberInput value={1} accessibilityLabel="quantity" />,
			);
			expect(screen.getByRole("button", { name: "Increase" })).toBeTruthy();
			expect(screen.getByRole("button", { name: "Decrease" })).toBeTruthy();
			expect(
				screen.getByTestId("k-number-input-input").props.accessibilityLabel,
			).toBe("quantity");
		});

		it("disabled steppers announce disabled", async () => {
			const screen = await render(<NumberInput value={1} disabled />);
			expect(
				screen.getByRole("button", { name: "Increase" }).props
					.accessibilityState?.disabled,
			).toBe(true);
		});
	});

	describe("Avatar", () => {
		it("announces as an image named after the person", async () => {
			const screen = await render(<Avatar name="Ada Lovelace" />);
			expect(screen.getByRole("image", { name: "Ada Lovelace" })).toBeTruthy();
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
			expect(screen.getByRole("switch", { name: "Auto sync" })).toBeTruthy();
			expect(screen.getByRole("switch").props.accessibilityState?.checked).toBe(
				true,
			);
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
			expect(screen.getByRole("radiogroup", { name: "plan" })).toBeTruthy();
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
			expect(screen.getByRole("radio").props.accessibilityState?.disabled).toBe(
				true,
			);
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
			expect(screen.getByRole("radiogroup", { name: "range" })).toBeTruthy();
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

	describe("Rating", () => {
		it("exposes pressable stars with per-star labels and selected state", async () => {
			const screen = await render(<Rating value={3} />);
			expect(
				screen.getByRole("button", { name: "3 stars" }).props.accessibilityState
					?.selected,
			).toBe(true);
			expect(
				screen.getByRole("button", { name: "4 stars" }).props.accessibilityState
					?.selected,
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
			const screen = await render(<Rating value={2.5} allowHalf readOnly />);
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

	describe("Accordion", () => {
		it("trigger announces expanded state as a button", async () => {
			const screen = await render(
				<Accordion type="single" defaultValue="a">
					<Accordion.Item value="a">
						<Accordion.Trigger>section</Accordion.Trigger>
						<Accordion.Content>body</Accordion.Content>
					</Accordion.Item>
				</Accordion>,
			);
			const trigger = screen.getByTestId("k-accordion-trigger", inclHidden);
			expect(trigger.props.accessibilityRole).toBe("button");
			expect(trigger.props.accessibilityState?.expanded).toBe(true);
		});
	});

	describe("Collapsible", () => {
		it("trigger announces expanded, disabled state and stays closed on press", async () => {
			const onOpenChange = jest.fn();
			const screen = await render(
				<Collapsible defaultOpen disabled onOpenChange={onOpenChange}>
					<Collapsible.Trigger>more</Collapsible.Trigger>
					<Collapsible.Content>detail</Collapsible.Content>
				</Collapsible>,
			);
			const trigger = screen.getByTestId("k-collapsible-trigger", inclHidden);
			expect(trigger.props.accessibilityRole).toBe("button");
			expect(trigger.props.accessibilityState?.expanded).toBe(true);
			expect(trigger.props.accessibilityState?.disabled).toBe(true);
			await fireEvent.press(trigger);
			expect(onOpenChange).not.toHaveBeenCalled();
		});
	});

	describe("Banner", () => {
		it("announces politely by default and assertively with role=alert", async () => {
			const polite = await render(<Banner>sync queued</Banner>);
			expect(polite.getByTestId("k-banner").props.accessibilityLiveRegion).toBe(
				"polite",
			);

			const urgent = await render(<Banner role="alert">outage</Banner>);
			const node = urgent.getByTestId("k-banner");
			expect(node.props.accessibilityRole).toBe("alert");
			expect(node.props.accessibilityLiveRegion).toBe("assertive");
		});

		it("exposes the close control as a labelled button", async () => {
			const screen = await render(<Banner onClose={() => undefined}>m</Banner>);
			expect(screen.getByRole("button", { name: "Close banner" })).toBeTruthy();
		});
	});

	describe("Textarea", () => {
		it("announces disabled state and blocks editing", async () => {
			const screen = await render(
				<Textarea accessibilityLabel="notes" disabled />,
			);
			const input = screen.getByTestId("k-textarea");
			expect(input.props.accessibilityState?.disabled).toBe(true);
			expect(input.props.editable).toBe(false);
		});
	});

	describe("Select", () => {
		it("announces role, label and expanded state on the trigger", async () => {
			const screen = await render(
				<Select
					options={[{ value: "a", label: "Alpha" }]}
					placeholder="pick"
				/>,
			);
			const trigger = screen.getByTestId("k-select");
			expect(trigger.props.accessibilityRole).toBe("button");
			expect(trigger.props.accessibilityLabel).toBe("pick");
			expect(trigger.props.accessibilityState?.expanded).toBe(false);
			await fireEvent.press(trigger);
			expect(
				screen.getByTestId("k-select").props.accessibilityState?.expanded,
			).toBe(true);
		});

		it("disabled trigger announces and blocks opening", async () => {
			const screen = await render(
				<Select options={[{ value: "a", label: "Alpha" }]} disabled />,
			);
			const trigger = screen.getByTestId("k-select");
			expect(trigger.props.accessibilityState?.disabled).toBe(true);
			await fireEvent.press(trigger);
			expect(screen.queryByTestId("k-select-option")).toBeNull();
		});

		it("option rows announce selected/disabled state", async () => {
			const screen = await render(
				<Select
					options={[
						{ value: "a", label: "Alpha" },
						{ value: "z", label: "Zed", disabled: true },
					]}
					defaultValue="a"
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-select"));
			const rows = screen.getAllByTestId("k-select-option");
			expect(rows[0].props.accessibilityState?.selected).toBe(true);
			expect(rows[0].props.accessibilityLabel).toBe("Alpha");
			expect(rows[1].props.accessibilityState?.disabled).toBe(true);
		});
	});

	describe("AvatarGroup", () => {
		it("container label summarizes the member names", async () => {
			const screen = await render(
				<AvatarGroup
					avatars={[{ name: "Ada Lovelace" }, { name: "Grace Hopper" }]}
				/>,
			);
			expect(
				screen.getByTestId("k-avatar-group").props.accessibilityLabel,
			).toBe("Ada Lovelace, Grace Hopper");
		});
	});

	describe("RingProgress", () => {
		it("announces progressbar role with min/max/now", async () => {
			const screen = await render(
				<RingProgress value={30} accessibilityLabel="upload" />,
			);
			const ring = screen.getByTestId("k-ring-progress");
			expect(ring.props.accessibilityRole).toBe("progressbar");
			expect(ring.props.accessibilityValue).toEqual({
				min: 0,
				max: 100,
				now: 30,
			});
		});
	});

	describe("Field", () => {
		it("merges label + error into the control's accessibilityLabel", async () => {
			const screen = await render(
				<Field label="Email" error="invalid">
					<TextInput />
				</Field>,
			);
			expect(screen.getByTestId("k-text-input").props.accessibilityLabel).toBe(
				"Email, invalid",
			);
			expect(screen.getByTestId("k-field-error").props.accessibilityRole).toBe(
				"alert",
			);
		});
	});

	describe("InputOtp", () => {
		it("entry field carries a stable label and disabled state", async () => {
			const screen = await render(
				<InputOtp maxLength={3}>
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
				</InputOtp>,
			);
			const field = screen.getByTestId("k-input-otp-field");
			expect(field.props.accessibilityLabel).toBe("One-time code");

			await screen.rerender(
				<InputOtp maxLength={3} disabled>
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
				</InputOtp>,
			);
			expect(
				screen.getByTestId("k-input-otp-field").props.accessibilityState
					?.disabled,
			).toBe(true);
		});
	});

	describe("DropdownMenu, ContextMenu", () => {
		it("menu triggers announce role, label and expanded state", async () => {
			const screen = await render(
				<DropdownMenu
					items={[{ key: "edit", label: "Edit" }]}
					triggerLabel="actions"
				/>,
			);
			const trigger = screen.getByTestId("k-dropdown-menu");
			expect(trigger.props.accessibilityRole).toBe("button");
			expect(trigger.props.accessibilityLabel).toBe("actions");
			expect(trigger.props.accessibilityState?.expanded).toBe(false);
			await fireEvent.press(trigger);
			expect(
				screen.getByTestId("k-dropdown-menu").props.accessibilityState
					?.expanded,
			).toBe(true);
		});

		it("menu rows announce labels and disabled/checked state", async () => {
			const screen = await render(
				<DropdownMenu
					items={[
						{ key: "edit", label: "Edit" },
						{ key: "lock", label: "Lock", disabled: true },
						{
							type: "checkbox",
							key: "sync",
							label: "Sync",
							checked: true,
							onCheckedChange: () => undefined,
						},
					]}
					triggerLabel="actions"
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-dropdown-menu"));
			expect(screen.getByLabelText("Edit")).toBeTruthy();
			expect(
				screen.getByLabelText("Lock").props.accessibilityState?.disabled,
			).toBe(true);
			expect(
				screen.getByLabelText("Sync").props.accessibilityState?.checked,
			).toBe(true);
		});

		it("ContextMenu long-press surfaces announce labels", async () => {
			const screen = await render(
				<ContextMenu items={[{ key: "copy", label: "Copy" }]}>
					<Text>invoice.pdf</Text>
				</ContextMenu>,
			);
			await fireEvent(screen.getByTestId("k-context-menu"), "longPress");
			expect(screen.getByLabelText("Copy")).toBeTruthy();
		});
	});

	describe("MultiSelect, Combobox", () => {
		it("multi-select trigger announces selection and expanded state", async () => {
			const screen = await render(
				<MultiSelect
					options={[
						{ value: "a", label: "Alpha" },
						{ value: "b", label: "Beta" },
					]}
					defaultValue={["a"]}
				/>,
			);
			const trigger = screen.getByTestId("k-multi-select");
			expect(trigger.props.accessibilityRole).toBe("button");
			expect(trigger.props.accessibilityLabel).toContain("Alpha");
			expect(trigger.props.accessibilityState?.expanded).toBe(false);
			await fireEvent.press(trigger);
			expect(
				screen.getByTestId("k-multi-select").props.accessibilityState?.expanded,
			).toBe(true);
			const row = screen.getByTestId("k-multi-select-option-0");
			expect(row.props.accessibilityState?.checked).toBe(true);
			// checkbox marker stays a11y-transparent: the row carries the state
			expect(
				screen.queryByTestId("k-multi-select-checkbox-0")?.props
					.accessibilityLabel,
			).toBeUndefined();
		});

		it("combobox trigger announces its label and expanded state", async () => {
			const screen = await render(
				<Combobox
					options={[
						{ value: "a", label: "Alpha" },
						{ value: "b", label: "Beta" },
					]}
					accessibilityLabel="pick a greek letter"
				/>,
			);
			const trigger = screen.getByTestId("k-combobox");
			expect(trigger.props.accessibilityRole).toBe("button");
			expect(trigger.props.accessibilityLabel).toBe("pick a greek letter");
			await fireEvent.press(trigger);
			expect(
				screen.getByTestId("k-combobox").props.accessibilityState?.expanded,
			).toBe(true);
			const row = screen.getByTestId("k-combobox-option-1");
			expect(row.props.accessibilityState?.selected).toBe(false);
		});
	});

	describe("date and time family", () => {
		it("calendar day rows announce disabled and selected state", async () => {
			const screen = await render(
				<Calendar
					month={new Date(2026, 1, 1)}
					defaultValue={new Date(2026, 1, 10)}
					disabledDates={(d: Date) => d.getDate() > 20}
				/>,
			);
			const selected = screen.getByTestId("k-calendar-day-2026-02-10");
			expect(selected.props.accessibilityRole).toBe("button");
			expect(selected.props.accessibilityState?.selected).toBe(true);
			expect(
				screen.getByTestId("k-calendar-day-2026-02-25").props.accessibilityState
					?.disabled,
			).toBe(true);
		});

		it("date picker trigger announces placeholder, value and expanded state", async () => {
			const screen = await render(<DatePicker placeholder="pick a date" />);
			const trigger = screen.getByTestId("k-date-picker");
			expect(trigger.props.accessibilityRole).toBe("button");
			expect(trigger.props.accessibilityLabel).toBe("pick a date");
			await fireEvent.press(trigger);
			expect(
				screen.getByTestId("k-date-picker").props.accessibilityState?.expanded,
			).toBe(true);
		});

		it("time picker wheel items announce selected state and period toggle", async () => {
			const screen = await render(
				<TimePicker hourCycle={12} value={{ hours: 13, minutes: 45 }} />,
			);
			expect(
				screen.getByTestId("k-time-picker-hour-item-1").props.accessibilityState
					?.selected,
			).toBe(true);
			expect(
				screen.getByTestId("k-time-picker-am-pm-option-pm").props
					.accessibilityState?.selected,
			).toBe(true);
		});
	});
});
