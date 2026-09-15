/**
 * Tier-3 slot-styles contract (REACT-NATIVE-STRATEGY.md customization
 * ladder): every component takes styles={{ root, ...parts }} and each
 * entry merges AFTER that part's library defaults. Render-only on
 * purpose — no fireEvent.press, which leaves responder grant locks in
 * this jest environment.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { Accordion } from "../accordion";
import { Alert } from "../alert";
import { AlertDialog } from "../alert-dialog";
import { Avatar } from "../avatar";
import { AvatarGroup } from "../avatar-group";
import { Badge } from "../badge";
import { Banner } from "../banner";
import { Button } from "../button";
import { Card } from "../card";
import { Checkbox } from "../checkbox";
import { Collapsible } from "../collapsible";
import { Dialog } from "../dialog";
import { EmptyState } from "../empty-state";
import { ErrorFallback } from "../error-boundary";
import { Field } from "../field";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Indicator } from "../indicator";
import { Label } from "../label";
import { List } from "../list";
import { LoadingOverlay } from "../loading-overlay";
import { Pagination } from "../pagination";
import { Progress } from "../progress";
import { RadioGroup } from "../radio-group";
import { Rating } from "../rating";
import { RingProgress } from "../ring-progress";
import { SegmentedControl } from "../segmented-control";
import { Select } from "../select";
import { Separator } from "../separator";
import { Sheet } from "../sheet";
import { Skeleton } from "../skeleton";
import { Slider } from "../slider";
import { applySlot } from "../slot-styles";
import { Spinner } from "../spinner";
import { Switch } from "../switch";
import { Tabs } from "../tabs";
import { Tag } from "../tag";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Textarea } from "../textarea";
import { Toast } from "../toast";
import { Toggle } from "../toggle";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

type Screen = Awaited<ReturnType<typeof render>>;

describe("applySlot helper", () => {
	it("returns [base, slot] so the slot wins on conflict", () => {
		const merged = applySlot({ height: 10, borderWidth: 1 }, { height: 20 });
		const flat = require("react-native").StyleSheet.flatten(merged);
		expect(flat.height).toBe(20);
		expect(flat.borderWidth).toBe(1);
	});

	it("passes the base through untouched when no slot is given", () => {
		const flat = require("react-native").StyleSheet.flatten(
			applySlot({ height: 10 }, undefined),
		);
		expect(flat.height).toBe(10);
	});

	it("spreads array bases before the slot", () => {
		const flat = require("react-native").StyleSheet.flatten(
			applySlot([{ height: 10 }, { height: 15 }], { height: 20 }),
		);
		expect(flat.height).toBe(20);
	});
});

describe("root slot sweep — every component accepts styles.root", () => {
	interface Fixture {
		name: string;
		render: () => Promise<Screen>;
		marker: string;
		/** text roots cannot take borderWidth — assert fontSize instead */
		textRoot?: boolean;
	}

	const fixtures: Fixture[] = [
		{
			name: "Alert",
			marker: "k-alert",
			render: () => render(<Alert styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "AlertDialog",
			marker: "k-alert-dialog",
			render: () =>
				render(
					<AlertDialog
						open
						onOpenChange={() => undefined}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Accordion",
			marker: "k-accordion",
			render: () =>
				render(
					<Accordion
						type="single"
						defaultValue="a"
						styles={{ root: { borderWidth: 7 } }}
					>
						<Accordion.Item value="a">
							<Accordion.Trigger>t</Accordion.Trigger>
						</Accordion.Item>
					</Accordion>,
				),
		},
		{
			name: "AvatarGroup",
			marker: "k-avatar-group",
			render: () =>
				render(
					<AvatarGroup
						avatars={[{ name: "Ada" }]}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Avatar",
			marker: "k-avatar",
			render: () =>
				render(<Avatar name="Ada" styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Banner",
			marker: "k-banner",
			render: () =>
				render(
					<Banner position="static" styles={{ root: { borderWidth: 7 } }}>
						m
					</Banner>,
				),
		},
		{
			name: "Badge",
			marker: "k-badge",
			render: () => render(<Badge styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Button",
			marker: "k-button-root",
			render: () =>
				render(<Button styles={{ root: { borderWidth: 7 } }}>go</Button>),
		},
		{
			name: "Card",
			marker: "k-card",
			render: () =>
				render(<Card styles={{ root: { borderWidth: 7 } }}>card</Card>),
		},
		{
			name: "Checkbox",
			marker: "k-checkbox",
			render: () =>
				render(
					<Checkbox
						accessibilityLabel="c"
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Collapsible",
			marker: "k-collapsible",
			render: () =>
				render(
					<Collapsible defaultOpen styles={{ root: { borderWidth: 7 } }}>
						<Collapsible.Trigger>t</Collapsible.Trigger>
					</Collapsible>,
				),
		},
		{
			name: "Dialog",
			marker: "k-dialog",
			render: () =>
				render(
					<Dialog
						open
						onOpenChange={() => undefined}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "EmptyState",
			marker: "k-empty-state",
			render: () =>
				render(
					<EmptyState
						title="empty"
						description="nothing"
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "ErrorFallback",
			marker: "k-error-fallback",
			render: () =>
				render(<ErrorFallback styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Field",
			marker: "k-field",
			render: () =>
				render(
					<Field label="x" styles={{ root: { borderWidth: 7 } }}>
						<TextInput />
					</Field>,
				),
		},
		{
			name: "Heading",
			marker: "k-heading",
			textRoot: true,
			render: () =>
				render(<Heading styles={{ root: { fontSize: 33 } }}>h</Heading>),
		},
		{
			name: "Icon",
			marker: "k-icon",
			render: () =>
				render(<Icon icon={Sun} styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Indicator",
			marker: "k-indicator",
			render: () => render(<Indicator styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Label",
			marker: "k-label",
			textRoot: true,
			render: () =>
				render(<Label styles={{ root: { fontSize: 33 } }}>l</Label>),
		},
		{
			name: "LoadingOverlay",
			marker: "k-loading-overlay",
			render: () =>
				render(
					<LoadingOverlay visible styles={{ root: { borderWidth: 7 } }} />,
				),
		},
		{
			name: "Pagination",
			marker: "k-pagination",
			render: () =>
				render(<Pagination total={3} styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Progress",
			marker: "k-progress",
			render: () =>
				render(<Progress value={50} styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "RadioGroup",
			marker: "k-radio-group",
			render: () =>
				render(
					<RadioGroup
						accessibilityLabel="r"
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Rating",
			marker: "k-rating",
			render: () => render(<Rating styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "RingProgress",
			marker: "k-ring-progress",
			render: () =>
				render(
					<RingProgress value={10} styles={{ root: { borderWidth: 7 } }} />,
				),
		},
		{
			name: "SegmentedControl",
			marker: "k-segmented",
			render: () =>
				render(
					<SegmentedControl
						data={["a", "b"]}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Select",
			marker: "k-select",
			render: () =>
				render(
					<Select
						options={[{ value: "a", label: "A" }]}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Separator",
			marker: "k-separator",
			render: () => render(<Separator styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Sheet",
			marker: "k-sheet-root",
			render: () =>
				render(
					<Sheet
						open
						onClose={() => undefined}
						styles={{ root: { borderWidth: 7 } }}
					>
						<Sheet.Body>x</Sheet.Body>
					</Sheet>,
				),
		},
		{
			name: "Skeleton",
			marker: "k-skeleton",
			render: () =>
				render(
					<Skeleton
						animated={false}
						style={{ width: 40, height: 8 }}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Slider",
			marker: "k-slider",
			render: () =>
				render(
					<Slider defaultValue={[40]} styles={{ root: { borderWidth: 7 } }} />,
				),
		},
		{
			name: "Spinner",
			marker: "k-spinner",
			render: () => render(<Spinner styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Switch",
			marker: "k-switch",
			render: () =>
				render(
					<Switch
						accessibilityLabel="s"
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Tabs",
			marker: "k-tabs",
			render: () =>
				render(
					<Tabs
						items={[{ value: "a", label: "A" }]}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Tag",
			marker: "k-tag",
			render: () => render(<Tag styles={{ root: { borderWidth: 7 } }}>t</Tag>),
		},
		{
			name: "Text",
			marker: "k-text",
			textRoot: true,
			render: () => render(<Text styles={{ root: { fontSize: 33 } }}>x</Text>),
		},
		{
			name: "TextInput",
			marker: "k-text-input",
			render: () => render(<TextInput styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Textarea",
			marker: "k-textarea",
			render: () => render(<Textarea styles={{ root: { borderWidth: 7 } }} />),
		},
		{
			name: "Toast",
			marker: "k-toast",
			render: () =>
				render(
					<Toast
						open
						onOpenChange={() => undefined}
						styles={{ root: { borderWidth: 7 } }}
					/>,
				),
		},
		{
			name: "Toggle",
			marker: "k-toggle",
			render: () =>
				render(
					<Toggle accessibilityLabel="b" styles={{ root: { borderWidth: 7 } }}>
						b
					</Toggle>,
				),
		},
		{
			name: "ToggleGroup",
			marker: "k-toggle-group",
			render: () =>
				render(
					<ToggleGroup type="single" styles={{ root: { borderWidth: 7 } }} />,
				),
		},
		{
			name: "List",
			marker: "k-list",
			render: () => render(<List styles={{ root: { borderWidth: 7 } }} />),
		},
	];

	for (const fixture of fixtures) {
		it(`${fixture.name}: styles.root reaches ${fixture.marker}`, async () => {
			const screen = await fixture.render();
			const root = screen.getByTestId(fixture.marker, incl);
			const s = flatStyle(root);
			if (fixture.textRoot) {
				expect(Number(s.fontSize)).toBe(33);
			} else {
				expect(Number(s.borderWidth)).toBe(7);
			}
		});
	}

	it("the sweep covers all 36 components", () => {
		expect(fixtures.length).toBe(42);
	});
});

describe("multi-part slots", () => {
	it("checkbox.box overrides the box surface", async () => {
		const screen = await render(
			<Checkbox accessibilityLabel="c" styles={{ box: { borderWidth: 3 } }} />,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-checkbox-box", incl)).borderWidth),
		).toBe(3);
	});

	it("switch.track and switch.thumb carry distinct overrides", async () => {
		const screen = await render(
			<Switch
				accessibilityLabel="s"
				styles={{ track: { borderWidth: 3 }, thumb: { borderWidth: 5 } }}
			/>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-switch-track")).borderWidth),
		).toBe(3);
		expect(
			Number(flatStyle(screen.getByTestId("k-switch-thumb")).borderWidth),
		).toBe(5);
	});

	it("slider.track / range / thumb carry distinct overrides", async () => {
		const screen = await render(
			<Slider
				defaultValue={[40]}
				styles={{
					track: { borderWidth: 2 },
					range: { borderWidth: 3 },
					thumb: { borderWidth: 4 },
				}}
			/>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-slider-track")).borderWidth),
		).toBe(2);
		// the range view is accessibilityElementsHidden — query with incl
		expect(
			Number(flatStyle(screen.getByTestId("k-slider-range", incl)).borderWidth),
		).toBe(3);
		expect(
			Number(flatStyle(screen.getByTestId("k-slider-thumb")).borderWidth),
		).toBe(4);
	});

	it("progress.indicator overrides the fill", async () => {
		const screen = await render(
			<Progress value={50} styles={{ indicator: { borderWidth: 3 } }} />,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-progress-indicator")).borderWidth),
		).toBe(3);
	});

	it("indicator.dot overrides the dot", async () => {
		const screen = await render(
			<Indicator size={10} styles={{ dot: { borderWidth: 3 } }} />,
		);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-indicator-dot", incl)).borderWidth,
			),
		).toBe(3);
	});

	it("sheet overlay / content / grabber / body carry distinct overrides", async () => {
		const screen = await render(
			<Sheet
				open
				onClose={() => undefined}
				styles={{
					root: { borderWidth: 1 },
					overlay: { borderWidth: 2 },
					content: { borderWidth: 3 },
					grabber: { borderWidth: 4 },
				}}
			>
				<Sheet.Body styles={{ root: { borderWidth: 5 } }}>x</Sheet.Body>
			</Sheet>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-sheet-root")).borderWidth),
		).toBe(1);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-sheet-overlay", inclHiddenForModal()))
					.borderWidth,
			),
		).toBe(2);
		expect(
			Number(flatStyle(screen.getByTestId("k-sheet-content")).borderWidth),
		).toBe(3);
		expect(
			Number(flatStyle(screen.getByTestId("k-sheet-grabber")).borderWidth),
		).toBe(4);
		expect(
			Number(flatStyle(screen.getByTestId("k-sheet-body")).borderWidth),
		).toBe(5);
	});

	it("dialog.overlay and dialog.close carry distinct overrides", async () => {
		const screen = await render(
			<Dialog
				open
				onOpenChange={() => undefined}
				styles={{ overlay: { borderWidth: 2 }, close: { borderWidth: 3 } }}
			/>,
		);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-dialog-overlay", incl)).borderWidth,
			),
		).toBe(2);
		expect(
			Number(flatStyle(screen.getByTestId("k-dialog-close", incl)).borderWidth),
		).toBe(3);
	});

	it("segmented-control.segment and .indicator carry distinct overrides", async () => {
		const screen = await render(
			<SegmentedControl
				data={["a", "b"]}
				styles={{ segment: { borderWidth: 3 }, indicator: { borderWidth: 5 } }}
			/>,
		);
		const segments = screen.getAllByTestId("k-segment", incl);
		expect(segments.length).toBeGreaterThan(1);
		for (const node of segments) {
			expect(Number(flatStyle(node).borderWidth)).toBe(3);
		}
		expect(
			Number(
				flatStyle(screen.getByTestId("k-segment-indicator", incl)).borderWidth,
			),
		).toBe(5);
	});

	it("pagination page/previous/next/ellipsis carry distinct overrides", async () => {
		const screen = await render(
			<Pagination
				total={9}
				siblings={1}
				boundaries={1}
				styles={{
					page: { borderWidth: 2 },
					previous: { borderWidth: 3 },
					next: { borderWidth: 4 },
					ellipsis: { borderWidth: 5 },
				}}
			/>,
		);
		const pages = screen.getAllByTestId("k-pagination-page", incl);
		expect(pages.length).toBeGreaterThan(1);
		for (const node of pages) {
			expect(Number(flatStyle(node).borderWidth)).toBe(2);
		}
		expect(
			Number(
				flatStyle(screen.getByTestId("k-pagination-previous", incl))
					.borderWidth,
			),
		).toBe(3);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-pagination-next", incl)).borderWidth,
			),
		).toBe(4);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-pagination-ellipsis", incl))
					.borderWidth,
			),
		).toBe(5);
	});

	it("rating.star overrides each star pressable", async () => {
		const screen = await render(
			<Rating value={3} styles={{ star: { borderWidth: 3 } }} />,
		);
		const stars = screen.getAllByTestId("k-rating-star", incl);
		expect(stars.length).toBeGreaterThan(1);
		for (const node of stars) {
			expect(Number(flatStyle(node).borderWidth)).toBe(3);
		}
	});

	it("tabs.tab and tabs.list carry distinct overrides", async () => {
		const screen = await render(
			<Tabs
				items={[{ value: "a", label: "A" }]}
				styles={{ tab: { borderWidth: 3 }, list: { borderWidth: 5 } }}
			/>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-tab", incl)).borderWidth),
		).toBe(3);
		expect(
			Number(flatStyle(screen.getByTestId("k-tab-list", incl)).borderWidth),
		).toBe(5);
	});

	it("tag.remove overrides the remove pressable", async () => {
		const screen = await render(
			<Tag onRemove={() => undefined} styles={{ remove: { borderWidth: 3 } }}>
				t
			</Tag>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-tag-remove", incl)).borderWidth),
		).toBe(3);
	});

	it("avatar.image / fallback / status carry distinct overrides", async () => {
		const withImage = await render(
			<Avatar
				name="Ada"
				source={{ uri: "x" }}
				status="online"
				styles={{
					image: { borderWidth: 2 },
					status: { borderWidth: 4 },
				}}
			/>,
		);
		expect(
			Number(flatStyle(withImage.getByTestId("k-avatar-image")).borderWidth),
		).toBe(2);
		expect(
			Number(flatStyle(withImage.getByTestId("k-avatar-status")).borderWidth),
		).toBe(4);

		const fallback = await render(
			<Avatar name="Ada" styles={{ fallback: { borderWidth: 3 } }} />,
		);
		expect(
			Number(flatStyle(fallback.getByTestId("k-avatar-fallback")).borderWidth),
		).toBe(3);
	});

	it("avatar image onError flips to fallback carrying styles.fallback", async () => {
		const screen = await render(
			<Avatar
				name="Ada"
				source={{ uri: "x" }}
				styles={{ fallback: { borderWidth: 6 } }}
			/>,
		);
		await fireEvent(screen.getByTestId("k-avatar-image"), "error");
		expect(
			Number(flatStyle(screen.getByTestId("k-avatar-fallback")).borderWidth),
		).toBe(6);
	});

	it("empty-state icon/title/description/action carry distinct overrides", async () => {
		const screen = await render(
			<EmptyState
				title="t"
				description="d"
				action={{ label: "go", onPress: () => undefined }}
				styles={{
					icon: { borderWidth: 2 },
					title: { fontSize: 40 },
					description: { fontSize: 41 },
					action: { borderWidth: 3 },
				}}
			/>,
		);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-empty-state-icon", incl)).borderWidth,
			),
		).toBe(2);
		expect(
			Number(flatStyle(screen.getByTestId("k-empty-state-title")).fontSize),
		).toBe(40);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-empty-state-description")).fontSize,
			),
		).toBe(41);
		expect(
			Number(flatStyle(screen.getByTestId("k-empty-state-action")).borderWidth),
		).toBe(3);
	});

	it("alert.dismiss overrides the dismiss pressable", async () => {
		const screen = await render(
			<Alert dismissable styles={{ dismiss: { borderWidth: 3 } }} />,
		);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-alert-dismiss", incl)).borderWidth,
			),
		).toBe(3);
	});

	it("toast.viewport overrides the viewport wrapper", async () => {
		const screen = await render(
			<Toast
				open
				onOpenChange={() => undefined}
				styles={{ viewport: { borderWidth: 3 } }}
			/>,
		);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-toast-viewport", incl)).borderWidth,
			),
		).toBe(3);
	});

	it("toggle-group.item overrides every item", async () => {
		const screen = await render(
			<ToggleGroup type="single" styles={{ item: { borderWidth: 3 } }}>
				<ToggleGroupItem value="a">a</ToggleGroupItem>
				<ToggleGroupItem value="b">b</ToggleGroupItem>
			</ToggleGroup>,
		);
		for (const item of screen.getAllByTestId("k-toggle-group-item", incl)) {
			expect(Number(flatStyle(item).borderWidth)).toBe(3);
		}
	});

	it("text-input root slot reaches the TextInput host", async () => {
		const screen = await render(
			<TextInput styles={{ root: { borderWidth: 7 } }} />,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-text-input")).borderWidth),
		).toBe(7);
	});
});

describe("precedence and back-compat", () => {
	it("styles.root beats the legacy style prop on button", async () => {
		const screen = await render(
			<Button style={{ height: 99 }} styles={{ root: { height: 120 } }}>
				go
			</Button>,
		);
		expect(Number(flatStyle(screen.getByTestId("k-button-root")).height)).toBe(
			120,
		);
	});

	it("styles.root beats the legacy style prop on checkbox and slider", async () => {
		const cb = await render(
			<Checkbox
				accessibilityLabel="c"
				style={{ minHeight: 99 }}
				styles={{ root: { minHeight: 120 } }}
			/>,
		);
		expect(Number(flatStyle(cb.getByTestId("k-checkbox")).minHeight)).toBe(120);

		const sl = await render(
			<Slider
				defaultValue={[10]}
				style={{ opacity: 0.2 }}
				styles={{ root: { opacity: 0.9 } }}
			/>,
		);
		expect(Number(flatStyle(sl.getByTestId("k-slider")).opacity)).toBe(0.9);
	});

	it("styles.root beats the legacy style prop on pagination, rating, radio-group", async () => {
		const pg = await render(
			<Pagination
				total={9}
				style={{ opacity: 0.2 }}
				styles={{ root: { opacity: 0.9 } }}
			/>,
		);
		expect(Number(flatStyle(pg.getByTestId("k-pagination")).opacity)).toBe(0.9);

		const rt = await render(
			<Rating
				value={3}
				style={{ opacity: 0.2 }}
				styles={{ root: { opacity: 0.9 } }}
			/>,
		);
		expect(Number(flatStyle(rt.getByTestId("k-rating")).opacity)).toBe(0.9);

		const rg = await render(
			<RadioGroup style={{ opacity: 0.2 }} styles={{ root: { opacity: 0.9 } }}>
				<RadioGroup.Item value="a" label="a" />
			</RadioGroup>,
		);
		expect(Number(flatStyle(rg.getByTestId("k-radio-group")).opacity)).toBe(
			0.9,
		);
	});

	it("toggle ladder: look → style → styles.root", async () => {
		const tg = await render(
			<Toggle style={{ opacity: 0.2 }} styles={{ root: { opacity: 0.9 } }}>
				t
			</Toggle>,
		);
		expect(Number(flatStyle(tg.getByTestId("k-toggle")).opacity)).toBe(0.9);
	});

	it("toggle-group item ladder: look → style → group itemStyles → styles.root", async () => {
		// (a) item styles.root beats the item's legacy style
		const a = await render(
			<ToggleGroup type="single">
				<ToggleGroupItem
					value="a"
					style={{ opacity: 0.2 }}
					styles={{ root: { opacity: 0.9 } }}
				>
					a
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(
			Number(flatStyle(a.getByTestId("k-toggle-group-item")).opacity),
		).toBe(0.9);

		// (b) group itemStyles beats the item's legacy style (no styles.root)
		const b = await render(
			<ToggleGroup type="single" styles={{ item: { opacity: 0.7 } }}>
				<ToggleGroupItem value="a" style={{ opacity: 0.2 }}>
					a
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(
			Number(flatStyle(b.getByTestId("k-toggle-group-item")).opacity),
		).toBe(0.7);

		// (c) item styles.root beats group itemStyles
		const c = await render(
			<ToggleGroup type="single" styles={{ item: { opacity: 0.7 } }}>
				<ToggleGroupItem value="a" styles={{ root: { opacity: 0.9 } }}>
					a
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(
			Number(flatStyle(c.getByTestId("k-toggle-group-item")).opacity),
		).toBe(0.9);
	});

	it("legacy style prop alone still applies (button, sheet, toggle)", async () => {
		const btn = await render(<Button style={{ height: 99 }}>go</Button>);
		expect(Number(flatStyle(btn.getByTestId("k-button-root")).height)).toBe(99);

		const sheet = await render(
			<Sheet
				open
				onClose={() => undefined}
				style={{ borderWidth: 2 }}
				styles={{ root: { borderWidth: 2 } }}
			>
				<Sheet.Body>x</Sheet.Body>
			</Sheet>,
		);
		expect(
			Number(flatStyle(sheet.getByTestId("k-sheet-root")).borderWidth),
		).toBe(2);

		const tg = await render(
			<Toggle accessibilityLabel="b" style={{ borderWidth: 2 }}>
				b
			</Toggle>,
		);
		expect(Number(flatStyle(tg.getByTestId("k-toggle")).borderWidth)).toBe(2);
	});
});

describe("text parts and untouched defaults", () => {
	it("alert.title, toast.title TextStyle slots reach their Text nodes", async () => {
		const alert = await render(
			<Alert>
				<Alert.Title styles={{ root: { fontSize: 44 } }}>t</Alert.Title>
			</Alert>,
		);
		expect(Number(flatStyle(alert.getByTestId("k-alert-title")).fontSize)).toBe(
			44,
		);

		const toast = await render(
			<Toast open onOpenChange={() => undefined}>
				<Toast.Title styles={{ root: { fontSize: 45 } }}>t</Toast.Title>
			</Toast>,
		);
		expect(
			Number(flatStyle(toast.getByTestId("k-toast-title", incl)).fontSize),
		).toBe(45);
	});

	it("dialog.title TextStyle slot reaches the title node", async () => {
		const screen = await render(
			<Dialog open onOpenChange={() => undefined}>
				<Dialog.Title styles={{ root: { fontSize: 46 } }}>t</Dialog.Title>
			</Dialog>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-dialog-title", incl)).fontSize),
		).toBe(46);
	});

	it("omitted slots leave library styles untouched", async () => {
		const btn = await render(<Button>go</Button>);
		expect(flatStyle(btn.getByTestId("k-button-root")).borderWidth).toBe(0);

		const cb = await render(<Checkbox accessibilityLabel="c" />);
		expect(flatStyle(cb.getByTestId("k-checkbox-box", incl)).borderWidth).toBe(
			1,
		);

		const sep = await render(<Separator />);
		expect(Number(flatStyle(sep.getByTestId("k-separator", incl)).height)).toBe(
			1,
		);
	});
});

function inclHiddenForModal() {
	return incl;
}

describe("accordion and collapsible slots", () => {
	it("accordion.item / trigger / content carry distinct overrides", async () => {
		const screen = await render(
			<Accordion
				type="single"
				defaultValue="a"
				styles={{
					item: { borderWidth: 3 },
					trigger: { borderWidth: 4 },
					content: { borderWidth: 5 },
				}}
			>
				<Accordion.Item value="a">
					<Accordion.Trigger>t</Accordion.Trigger>
					<Accordion.Content>c</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(
			Number(flatStyle(screen.getByTestId("k-accordion-item")).borderWidth),
		).toBe(3);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-accordion-trigger", incl)).borderWidth,
			),
		).toBe(4);
		expect(
			Number(flatStyle(screen.getByTestId("k-accordion-content")).borderWidth),
		).toBe(5);
	});

	it("per-part slots win over the group-flowed slot", async () => {
		const screen = await render(
			<Accordion
				type="single"
				defaultValue="a"
				styles={{ trigger: { borderWidth: 4 } }}
			>
				<Accordion.Item value="a">
					<Accordion.Trigger styles={{ root: { borderWidth: 6 } }}>
						t
					</Accordion.Trigger>
					<Accordion.Content>c</Accordion.Content>
				</Accordion.Item>
			</Accordion>,
		);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-accordion-trigger", incl)).borderWidth,
			),
		).toBe(6);
	});

	it("collapsible.trigger / content carry distinct overrides", async () => {
		const screen = await render(
			<Collapsible
				defaultOpen
				styles={{ trigger: { borderWidth: 4 }, content: { borderWidth: 5 } }}
			>
				<Collapsible.Trigger>t</Collapsible.Trigger>
				<Collapsible.Content>c</Collapsible.Content>
			</Collapsible>,
		);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-collapsible-trigger", incl))
					.borderWidth,
			),
		).toBe(4);
		expect(
			Number(
				flatStyle(screen.getByTestId("k-collapsible-content")).borderWidth,
			),
		).toBe(5);
	});
});
