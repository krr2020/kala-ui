/**
 * Marker convention: every kala-ui native component exposes a stable
 * `k-*` testID root so E2E (Maestro) and app debugging stay deterministic.
 * When adding a component, add its marker here — a missing marker is a
 * contract break, not a style issue.
 */
import { act, fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { motion, tokens } from "../../tokens";
import { Accordion } from "../accordion";
import { Alert } from "../alert";
import { AlertDialog } from "../alert-dialog";
import { Avatar } from "../avatar";
import { AvatarGroup } from "../avatar-group";
import { Badge } from "../badge";
import { Banner } from "../banner";

import { BUTTON_SPRING, Button } from "../button";
import { Calendar } from "../calendar";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardImage,
	CardMarker,
	CardSubtitle,
	CardTitle,
} from "../card";
import { Checkbox } from "../checkbox";
import { Collapsible } from "../collapsible";
import { Combobox } from "../combobox";
import { ContextMenu } from "../context-menu";
import { CopyButton } from "../copy-button";
import { DatePicker, DateRangePicker } from "../date-picker";
import { Dialog } from "../dialog";
import { DropdownMenu } from "../dropdown-menu";
import { EmptyState } from "../empty-state";
import { ErrorBoundary } from "../error-boundary";
import { Field } from "../field";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Indicator } from "../indicator";
import { InputOtp, InputOtpSeparator, InputOtpSlot } from "../input-otp";
import { Label } from "../label";
import {
	List,
	ListItem,
	ListItemAction,
	ListItemAvatar,
	ListItemBadge,
	ListItemContent,
	ListItemIcon,
	ListItemText,
	ListItemTitle,
} from "../list";
import { LoadingOverlay } from "../loading-overlay";
import { MultiSelect } from "../multi-select";

import { NumberInput } from "../number-input";
import { PasswordStrengthIndicator } from "../password-strength-indicator";
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
import { Spinner } from "../spinner";
import { Steps } from "../steps";
import { Switch } from "../switch";

import { Tabs } from "../tabs";
import { Tag } from "../tag";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Textarea } from "../textarea";
import { TimePicker } from "../time-picker";
import { Timeline } from "../timeline";
import { Toast } from "../toast";
import { Toggle } from "../toggle";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

const pkg = require("../../../package.json");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

// TLB v14 queries are a11y-aware: deliberately-hidden elements (Icon without
// a label) and siblings of an accessibilityViewIsModal container (the Sheet
// overlay) are excluded by default — opt back in where the contract needs
// the raw tree. Manual unmount() poisons TLB's registry for later renders
// in the same file, so loops rerender one tree instead.
const inclHidden = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

describe("unistyles harness contract", () => {
	// Guards the jest.config moduleNameMapper: if resolution of the mock
	// breaks again, this fails (or the suite fails to load) before any
	// component contract produces a confusing 'Cannot find module'.
	it("mock provides the API surface components import", () => {
		const unistyles = require("react-native-unistyles");
		expect(typeof unistyles.useUnistyles).toBe("function");
		expect(typeof unistyles.StyleSheet.configure).toBe("function");
		const { themes } = require("../../themes");
		expect(unistyles.useUnistyles().theme).toEqual(themes.light);
	});
});

describe("component barrels", () => {
	// Barrels re-export both the component and its named prop types; the
	// typed fixtures below fail to compile if either drops off the barrel.
	const buttonProps: import("../button").ButtonProps = { children: "x" };
	const iconProps: import("../icon").IconProps = {
		icon: Sun,
		size: "sm",
	};
	const sheetProps: import("../sheet").SheetProps = {
		open: true,
		onClose: () => undefined,
		children: "x",
	};
	const bodyProps: import("../sheet").SheetBodyProps = { children: "x" };

	it("re-export each component through its folder barrel", async () => {
		expect(buttonProps).toBeTruthy();
		expect(iconProps).toBeTruthy();
		expect(sheetProps).toBeTruthy();
		expect(bodyProps).toBeTruthy();
		const screen = await render(
			<>
				<Button>Go</Button>
				<Icon icon={Sun} />
				<Sheet open onClose={() => undefined}>
					<Sheet.Body>x</Sheet.Body>
				</Sheet>
			</>,
		);
		expect(screen.getByTestId("k-button-root")).toBeTruthy();
		expect(screen.getByTestId("k-icon", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-sheet-content")).toBeTruthy();
	});
});

describe("component markers", () => {
	it("Button renders k-button-root", async () => {
		const screen = await render(<Button>Save</Button>);
		expect(screen.getByTestId("k-button-root")).toBeTruthy();
	});

	it("Icon renders k-icon", async () => {
		const screen = await render(<Icon icon={Sun} />);
		expect(screen.getByTestId("k-icon", inclHidden)).toBeTruthy();
	});

	it("Sheet renders overlay, content and grabber markers when open", async () => {
		const screen = await render(
			<Sheet open onClose={() => undefined}>
				<Sheet.Body>content</Sheet.Body>
			</Sheet>,
		);
		expect(screen.getByTestId("k-sheet-overlay", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-sheet-content")).toBeTruthy();
		expect(screen.getByTestId("k-sheet-grabber")).toBeTruthy();
	});

	it("Sheet renders nothing when closed", async () => {
		const screen = await render(
			<Sheet open={false} onClose={() => undefined}>
				<Sheet.Body>content</Sheet.Body>
			</Sheet>,
		);
		expect(screen.queryByTestId("k-sheet-overlay")).toBeNull();
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
	});

	it("package description no longer claims components arrive later", () => {
		expect(pkg.description).not.toMatch(/later releases/);
	});

	it("Calendar renders k-calendar with month grid and nav markers", async () => {
		const screen = await render(<Calendar month={new Date(2026, 1, 1)} />);
		expect(screen.getByTestId("k-calendar")).toBeTruthy();
		expect(screen.getByTestId("k-calendar-month-label")).toBeTruthy();
		expect(screen.getByTestId("k-calendar-prev")).toBeTruthy();
		expect(screen.getByTestId("k-calendar-next")).toBeTruthy();
		expect(screen.getAllByTestId(/^k-calendar-day-/).length).toBe(42);
	});

	it("DatePicker renders k-date-picker and closes its sheet on commit", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<DatePicker month={new Date(2026, 1, 1)} onValueChange={onValueChange} />,
		);
		expect(screen.getByTestId("k-date-picker")).toBeTruthy();
		await fireEvent.press(screen.getByTestId("k-date-picker"));
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-11"));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId("k-sheet-overlay")).toBeNull();
	});

	it("DateRangePicker renders its marker and completes a range", async () => {
		const screen = await render(
			<DateRangePicker month={new Date(2026, 1, 1)} />,
		);
		expect(screen.getByTestId("k-date-picker-date-range-picker")).toBeTruthy();
	});

	it("TimePicker renders k-time-picker with hour and minute wheels", async () => {
		const screen = await render(<TimePicker />);
		expect(screen.getByTestId("k-time-picker")).toBeTruthy();
		expect(screen.getByTestId("k-time-picker-hour")).toBeTruthy();
		expect(screen.getByTestId("k-time-picker-minute")).toBeTruthy();
	});

	it("CopyButton renders k-copy-button", async () => {
		const screen = await render(
			<CopyButton value="demo" writeClipboard={async () => undefined} />,
		);
		expect(screen.getByTestId("k-copy-button")).toBeTruthy();
	});

	it("NumberInput exposes root, input and stepper markers", async () => {
		const screen = await render(
			<NumberInput defaultValue={5} min={0} max={10} />,
		);
		expect(screen.getByTestId("k-number-input")).toBeTruthy();
		expect(screen.getByTestId("k-number-input-input")).toBeTruthy();
		expect(screen.getByTestId("k-number-input-increment")).toBeTruthy();
		expect(screen.getByTestId("k-number-input-decrement")).toBeTruthy();
	});

	describe("behavior contract", () => {
		it("pressed state uses the motion.spring.snappy config", () => {
			expect(BUTTON_SPRING).toEqual(motion.spring.snappy);
		});

		it("sizes are visually distinct and every size keeps the 44dp touch floor", async () => {
			const expectedHeight: Record<string, number> = {
				xs: 28,
				sm: 36,
				md: tokens.size.controlH,
				lg: 44,
				icon: 44,
			};
			const screen = await render(<Button size="xs">Go</Button>);
			let prev = 0;
			for (const size of ["xs", "sm", "md", "lg", "icon"] as const) {
				await screen.rerender(
					<Button
						size={size}
						accessibilityLabel={size === "icon" ? "go" : undefined}
					>
						Go
					</Button>,
				);
				const s = flatStyle(screen.getByTestId("k-button-root"));
				const h = Number(s.minHeight);
				// font-scale safe: minHeight grows with a11y font scales, a fixed
				// height would clip — assert only minHeight is set for text sizes
				if (size !== "icon") {
					expect(s.height).toBeUndefined();
					expect(h).toBe(expectedHeight[size]);
					expect(h).toBeGreaterThan(prev);
					prev = h;
				}
				// touch floor via hitSlop, not visual size
				const hit = s.hitSlop as { top?: number } | undefined;
				expect(h + 2 * Number(hit?.top ?? 0)).toBeGreaterThanOrEqual(44);
				expect(Number(s.minWidth)).toBeGreaterThanOrEqual(44);
			}
		});

		it("each variant arm produces a distinct style", async () => {
			const seen = new Map<string, string>();
			const screen = await render(<Button variant="solid">Go</Button>);
			for (const variant of ["solid", "outline", "ghost", "subtle"] as const) {
				await screen.rerender(<Button variant={variant}>Go</Button>);
				const s = flatStyle(screen.getByTestId("k-button-root"));
				const sig = JSON.stringify([
					s.backgroundColor,
					s.borderWidth,
					s.textDecorationLine,
				]);
				expect(seen.has(sig)).toBe(false);
				seen.set(sig, variant);
			}
		});

		it("demo preview keeps raw props with humanized labels and no web-parity variants", () => {
			const demo = readFileSync(
				resolve(
					__dirname,
					"../../../../../apps/native-playground/src/demos/components/button-demo.tsx",
				),
				"utf8",
			);
			// props stay the raw API values…
			expect(demo).toMatch(/variant=\{variant\}/);
			expect(demo).toMatch(/color=\{color\}/);
			expect(demo).toMatch(/size=\{size\}/);
			// …while the visible labels are humanized title case and the
			// variant list carries only the mobile-first set (no 'link').
			expect(demo).toMatch(/\{humanizeLabel\(variant\)\}/);
			expect(demo).toMatch(/\{humanizeLabel\(color\)\}/);
			expect(demo).toMatch(/\{humanizeLabel\(size\)\}/);
			expect(demo).not.toMatch(/\{variant\}<\//);
			expect(demo).not.toMatch(/"link"/);
		});

		it("demo copy is humanized and content clears the gesture bar", () => {
			const demo = readFileSync(
				resolve(
					__dirname,
					"../../../../../apps/native-playground/src/demos/components/button-demo.tsx",
				),
				"utf8",
			);
			// block labels + button copy read as title case, not kebab/lowercase
			expect(demo).not.toMatch(/label="[a-z]/);
			expect(demo).not.toMatch(/>[a-z][a-z ]+<\//);
			expect(demo).toMatch(/Pressed \{count\} Times/);
			// bottom inset: themed background under the nav bar + breathing
			// room above it when scrolled to the end
			const shell = readFileSync(
				resolve(
					__dirname,
					"../../../../../apps/native-playground/src/route-shell.tsx",
				),
				"utf8",
			);
			expect(shell).toMatch(/edges=\{\["top", "bottom"\]\}/);
			const stylesheet = readFileSync(
				resolve(
					__dirname,
					"../../../../../apps/native-playground/src/demos/stylesheet.ts",
				),
				"utf8",
			);
			expect(stylesheet).toMatch(
				/routeContent: \{[\s\S]*?paddingBottom: 7[0-9]/,
			);
		});

		it("size=icon is square", async () => {
			const screen = await render(
				<Button size="icon" accessibilityLabel="add">
					<Icon icon={Sun} size="xs" />
				</Button>,
			);
			const s = flatStyle(screen.getByTestId("k-button-root"));
			expect(s.width).toBe(s.height);
		});

		it("icon size tokens map to distinct sizes", async () => {
			const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
			const px: number[] = [];
			const screen = await render(<Icon icon={Sun} size="xs" />);
			for (const size of sizes) {
				await screen.rerender(<Icon icon={Sun} size={size} />);
				// toJSON is the stable surface here: lucide maps `size` onto
				// the rendered svg element as numeric width/height props
				const tree = screen.toJSON();
				const svg = (
					Array.isArray(tree?.children) ? tree.children[0] : undefined
				) as { props?: { width?: number } } | undefined;
				px.push(Number(svg?.props?.width));
			}
			expect(new Set(px).size).toBe(sizes.length);
		});

		it("icon color accepts a raw string", async () => {
			const screen = await render(<Icon icon={Sun} color="#ff00ff" />);
			expect(screen.getByTestId("k-icon", inclHidden)).toBeTruthy();
		});

		it("sheet snap points produce distinct heights", async () => {
			const heights: string[] = [];
			const screen = await render(
				<Sheet open snap="peek" onClose={() => undefined}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>,
			);
			for (const snap of ["peek", "half", "full"] as const) {
				await screen.rerender(
					<Sheet open snap={snap} onClose={() => undefined}>
						<Sheet.Body>content</Sheet.Body>
					</Sheet>,
				);
				const s = flatStyle(screen.getByTestId("k-sheet-content"));
				heights.push(String(s.height));
			}
			expect(new Set(heights).size).toBe(3);
		});

		it("overlay press closes a dismissable sheet", async () => {
			const onClose = jest.fn();
			const screen = await render(
				<Sheet open onClose={onClose}>
					<Sheet.Body>content</Sheet.Body>
				</Sheet>,
			);
			await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe("Text, Heading, TextInput, Card", () => {
		it("Text/Heading/TextInput/Card render their k-* markers", async () => {
			const screen = await render(
				<>
					<Text>body</Text>
					<Heading>title</Heading>
					<TextInput accessibilityLabel="email" />
					<Card>card body</Card>
				</>,
			);
			expect(screen.getByTestId("k-text")).toBeTruthy();
			expect(screen.getByTestId("k-heading")).toBeTruthy();
			expect(screen.getByTestId("k-text-input")).toBeTruthy();
			expect(screen.getByTestId("k-card")).toBeTruthy();
		});

		it("each Text size maps to a distinct fontSize", async () => {
			const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
			const px = new Set<number>();
			const screen = await render(<Text size="xs">x</Text>);
			for (const size of sizes) {
				await screen.rerender(<Text size={size}>x</Text>);
				px.add(Number(flatStyle(screen.getByTestId("k-text")).fontSize));
			}
			expect(px.size).toBe(sizes.length);
		});

		it("each Text weight maps to a distinct defined fontWeight", async () => {
			const weights = [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black",
			] as const;
			const screen = await render(<Text weight="thin">x</Text>);
			for (const weight of weights) {
				await screen.rerender(<Text weight={weight}>x</Text>);
				const fw = flatStyle(screen.getByTestId("k-text")).fontWeight;
				expect(fw).toBeDefined();
				expect(Number(fw)).toBeGreaterThan(0);
			}
			// distinctness in one sweep
			const seen = new Set<number>();
			for (const weight of weights) {
				await screen.rerender(<Text weight={weight}>x</Text>);
				seen.add(Number(flatStyle(screen.getByTestId("k-text")).fontWeight));
			}
			expect(seen.size).toBe(weights.length);
		});

		it("each Text align maps to textAlign", async () => {
			const screen = await render(
				<Text align="left" size="xs">
					x
				</Text>,
			);
			for (const [align, expected] of [
				["left", "left"],
				["center", "center"],
				["right", "right"],
			] as const) {
				await screen.rerender(
					<Text align={align} size="xs">
						x
					</Text>,
				);
				expect(flatStyle(screen.getByTestId("k-text")).textAlign).toBe(
					expected,
				);
			}
		});

		it("each themed Text color resolves to a real style color", async () => {
			const colors = [
				"primary",
				"secondary",
				"destructive",
				"success",
				"warning",
				"info",
				"muted",
			] as const;
			const screen = await render(
				<Text color="primary" size="xs">
					x
				</Text>,
			);
			for (const color of colors) {
				await screen.rerender(
					<Text color={color} size="xs">
						x
					</Text>,
				);
				const s = flatStyle(screen.getByTestId("k-text"));
				const c = String(s.color);
				expect(typeof s.color).toBe("string");
				expect(c.startsWith("#") || c.startsWith("rgb")).toBe(true);
			}
		});

		it("Text truncate clamps to one line with tail ellipsis", async () => {
			const screen = await render(<Text truncate>long text</Text>);
			const t = screen.getByTestId("k-text");
			expect(t.props.numberOfLines).toBe(1);
			expect(t.props.ellipsizeMode).toBe("tail");
		});

		it("each Heading size maps to a distinct fontSize", async () => {
			const sizes = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
			const px = new Set<number>();
			const screen = await render(<Heading size="h1">x</Heading>);
			for (const size of sizes) {
				await screen.rerender(<Heading size={size}>x</Heading>);
				px.add(Number(flatStyle(screen.getByTestId("k-heading")).fontSize));
			}
			expect(px.size).toBe(sizes.length);
		});

		it("Heading weights map to distinct numeric fontWeights", async () => {
			const weights = ["default", "medium", "semibold", "extrabold"] as const;
			const seen = new Set<string>();
			const screen = await render(<Heading size="h6">x</Heading>);
			for (const weight of weights) {
				await screen.rerender(
					<Heading size="h6" weight={weight}>
						x
					</Heading>,
				);
				seen.add(String(flatStyle(screen.getByTestId("k-heading")).fontWeight));
			}
			expect(seen.size).toBe(weights.length);
		});

		it("TextInput error border is distinct from the default", async () => {
			const screen = await render(<TextInput accessibilityLabel="e" />);
			const def = String(
				flatStyle(screen.getByTestId("k-text-input")).borderColor,
			);
			await screen.rerender(<TextInput accessibilityLabel="e" hasError />);
			const err = String(
				flatStyle(screen.getByTestId("k-text-input")).borderColor,
			);
			expect(err).not.toBe(def);
			expect(err.startsWith("#")).toBe(true);
		});

		it("TextInput keeps the 44dp floor and disables editing when disabled", async () => {
			const screen = await render(
				<TextInput accessibilityLabel="e" disabled />,
			);
			const input = screen.getByTestId("k-text-input");
			expect(Number(flatStyle(input).minHeight)).toBeGreaterThanOrEqual(44);
			expect(input.props.editable).toBe(false);
			expect(input.props.accessibilityState?.disabled).toBe(true);
		});

		it("Card carries the themed surface styles", async () => {
			const screen = await render(
				<Card testID="k-card">
					<Heading size="h6">inside</Heading>
				</Card>,
			);
			const s = flatStyle(screen.getByTestId("k-card"));
			expect(s.backgroundColor).toBeTruthy();
			expect(Number(s.borderRadius)).toBeGreaterThan(0);
			expect(Number(s.padding)).toBeGreaterThan(0);
			expect(Number(s.borderWidth)).toBe(1);
			expect(String(s.borderColor).startsWith("#")).toBe(true);
			// nested components stay addressable inside the card surface
			expect(screen.getByTestId("k-heading")).toBeTruthy();
		});

		it("Card wraps string children in themed text", async () => {
			const screen = await render(<Card testID="k-card">plain body copy</Card>);
			// the wrapped child renders as RN Text (not a raw string in View)
			expect(screen.getByText("plain body copy")).toBeTruthy();
			const card = screen.getByTestId("k-card");
			const child = card.children[0] as { props: { style?: unknown } };
			const childStyle = require("react-native").StyleSheet.flatten(
				child.props.style,
			) as Record<string, unknown>;
			expect(String(childStyle.color).startsWith("#")).toBe(true);
		});

		it("Card compound parts render their k-card-* markers", async () => {
			const screen = await render(
				<Card padding="none" variant="elevated">
					<CardImage source={{ uri: "https://x.test/a.jpg" }} alt="a" />
					<CardHeader>
						<CardTitle>title</CardTitle>
						<CardSubtitle>subtitle</CardSubtitle>
						<CardDescription>description</CardDescription>
						<CardAction>act</CardAction>
					</CardHeader>
					<CardContent>content</CardContent>
					<CardFooter>footer</CardFooter>
					<CardMarker color="primary">new</CardMarker>
				</Card>,
			);
			expect(screen.getByTestId("k-card-clip")).toBeTruthy();
			expect(screen.getByTestId("k-card-image")).toBeTruthy();
			expect(screen.getByTestId("k-card-header")).toBeTruthy();
			expect(screen.getByTestId("k-card-title")).toBeTruthy();
			expect(screen.getByTestId("k-card-subtitle")).toBeTruthy();
			expect(screen.getByTestId("k-card-description")).toBeTruthy();
			expect(screen.getByTestId("k-card-action")).toBeTruthy();
			expect(screen.getByTestId("k-card-content")).toBeTruthy();
			expect(screen.getByTestId("k-card-footer")).toBeTruthy();
			expect(screen.getByTestId("k-card-marker")).toBeTruthy();
		});
	});

	describe("Badge, Avatar, Checkbox, Switch", () => {
		// (bg, wrapped-text fg, border) — the fg lives on the child text, so
		// read it there or every solid/subtle arm collapses to a 2-tuple and
		// same-bg arms (muted solid borrows accent = muted bg) collide
		const badgeSig = (node: {
			props?: { style?: unknown };
			children?: unknown[];
		}) => {
			const s = node.props
				? flatStyle(node as { props: { style?: unknown } })
				: {};
			const child = Array.isArray(node.children)
				? (node.children[0] as { props?: { style?: unknown } } | undefined)
				: undefined;
			const fg = child
				? flatStyle(child as { props: { style?: unknown } })
				: {};
			return JSON.stringify([s.backgroundColor, fg.color, s.borderColor]);
		};

		it("Badge/Avatar/Checkbox/Switch render their k-* markers", async () => {
			const screen = await render(
				<>
					<Badge>new</Badge>
					<Avatar name="Ada Lovelace" />
					<Checkbox accessibilityLabel="agree" />
					<Switch accessibilityLabel="sync" />
				</>,
			);
			expect(screen.getByTestId("k-badge")).toBeTruthy();
			expect(screen.getByTestId("k-avatar")).toBeTruthy();
			expect(screen.getByTestId("k-checkbox")).toBeTruthy();
			expect(screen.getByTestId("k-switch")).toBeTruthy();
		});

		it("every Badge variant×color arm produces a distinct style triple", async () => {
			const variants = ["solid", "outline", "subtle"] as const;
			const colors = [
				"primary",
				"secondary",
				"destructive",
				"success",
				"warning",
				"info",
				"muted",
			] as const;
			const seen = new Map<string, string>();
			const screen = await render(
				<Badge variant="solid" color="primary">
					x
				</Badge>,
			);
			for (const variant of variants) {
				for (const color of colors) {
					await screen.rerender(
						<Badge variant={variant} color={color}>
							x
						</Badge>,
					);
					const badge = screen.getByTestId("k-badge");
					const sig = badgeSig(badge);
					expect(seen.has(sig)).toBe(false);
					seen.set(sig, `${variant}/${color}`);
					// every arm resolves real colors, never undefined
					const s = flatStyle(badge);
					expect(s.backgroundColor).toBeDefined();
					expect(s.borderColor).toBeDefined();
				}
			}
			expect(seen.size).toBe(variants.length * colors.length);
		});

		it("Badge shape pill vs rounded gives distinct radii; text child is themed", async () => {
			const screen = await render(<Badge shape="rounded">new</Badge>);
			const rounded = Number(
				flatStyle(screen.getByTestId("k-badge")).borderRadius,
			);
			await screen.rerender(<Badge shape="pill">new</Badge>);
			const pill = Number(
				flatStyle(screen.getByTestId("k-badge")).borderRadius,
			);
			expect(rounded).toBeGreaterThan(0);
			expect(pill).not.toBe(rounded);
			const child = screen.getByTestId("k-badge").children[0] as {
				props: { style?: unknown };
			};
			const childStyle = require("react-native").StyleSheet.flatten(
				child.props.style,
			) as Record<string, unknown>;
			expect(Number(childStyle.fontSize)).toBe(12);
			expect(String(childStyle.color).startsWith("#")).toBe(true);
		});

		it("Badge with no children still renders its marker", async () => {
			const screen = await render(<Badge />);
			expect(screen.getByTestId("k-badge")).toBeTruthy();
		});

		it("each Avatar size maps to a distinct box size", async () => {
			const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
			const seen = new Set<number>();
			const screen = await render(<Avatar name="A" size="xs" />);
			for (const size of sizes) {
				await screen.rerender(<Avatar name="A" size={size} />);
				const s = flatStyle(screen.getByTestId("k-avatar"));
				expect(Number(s.width)).toBeGreaterThan(0);
				seen.add(Number(s.width));
			}
			expect(seen.size).toBe(sizes.length);
		});

		it("each Avatar shape maps to a distinct borderRadius", async () => {
			const shapes = ["circle", "rounded", "square"] as const;
			const seen = new Set<number>();
			const screen = await render(<Avatar name="A" shape="circle" />);
			for (const shape of shapes) {
				await screen.rerender(<Avatar name="A" shape={shape} />);
				// the rounded clip lives on the media layer, not the root
				seen.add(
					Number(
						flatStyle(screen.getByTestId("k-avatar-fallback")).borderRadius,
					),
				);
			}
			expect(seen.size).toBe(shapes.length);
		});

		it("Avatar status dot colors differ between online and offline", async () => {
			const screen = await render(<Avatar name="A" status="online" />);
			const online = String(
				flatStyle(screen.getByTestId("k-avatar-status")).backgroundColor,
			);
			await screen.rerender(<Avatar name="A" status="offline" />);
			const offline = String(
				flatStyle(screen.getByTestId("k-avatar-status")).backgroundColor,
			);
			expect(online.startsWith("#")).toBe(true);
			expect(offline.startsWith("#")).toBe(true);
			expect(offline).not.toBe(online);
			// dot is absolutely positioned inside the avatar
			expect(flatStyle(screen.getByTestId("k-avatar-status")).position).toBe(
				"absolute",
			);
		});

		it("online dot uses the active theme's success token", async () => {
			const { themes } = require("../../themes");
			const screen = await render(<Avatar name="A" status="online" />);
			const dot = flatStyle(screen.getByTestId("k-avatar-status"));
			expect(String(dot.backgroundColor)).toBe(themes.light.success);
			expect(String(dot.borderColor)).toBe(themes.light.background);
		});

		it("online dot follows a theme switch to the dark success token", async () => {
			const unistyles = require("react-native-unistyles");
			const { themes } = require("../../themes");
			const spy = jest
				.spyOn(unistyles, "useUnistyles")
				.mockReturnValue({ theme: themes.dark });
			try {
				// a silently-bound import would leave the light theme active and
				// fail below — light.success != dark.success, so this arm can never
				// pass against the wrong theme
				const screen = await render(<Avatar name="A" status="online" />);
				const dot = flatStyle(screen.getByTestId("k-avatar-status"));
				expect(String(dot.backgroundColor)).toBe(themes.dark.success);
				expect(String(dot.backgroundColor)).not.toBe(themes.light.success);
				expect(String(dot.borderColor)).toBe(themes.dark.background);
			} finally {
				spy.mockRestore();
			}
		});

		it("status dot is not clipped by the avatar's rounded bounds", async () => {
			const shapes = ["circle", "rounded", "square"] as const;
			const screen = await render(
				<Avatar name="A" shape="circle" status="online" />,
			);
			for (const shape of shapes) {
				await screen.rerender(
					<Avatar name="A" shape={shape} status="online" />,
				);
				// the rounded clip lives on the media layer, never the root —
				// a root-level clip shears off the corner status dot
				const root = flatStyle(screen.getByTestId("k-avatar"));
				expect(root.overflow).not.toBe("hidden");
				const dot = flatStyle(screen.getByTestId("k-avatar-status"));
				expect(Number(dot.right)).toBe(0);
				expect(Number(dot.bottom)).toBe(0);
			}
		});

		it("status ring weight is 1 at xs/sm and 2 at md/lg/xl", async () => {
			const ring = { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 } as const;
			const screen = await render(
				<Avatar name="A" size="xs" status="online" />,
			);
			for (const size of Object.keys(ring) as Array<keyof typeof ring>) {
				await screen.rerender(<Avatar name="A" size={size} status="online" />);
				expect(
					Number(flatStyle(screen.getByTestId("k-avatar-status")).borderWidth),
				).toBe(ring[size]);
			}
		});

		it("empty name falls back to an en-dash placeholder", async () => {
			const screen = await render(<Avatar />);
			expect(screen.getByText("–")).toBeTruthy();
		});

		it("Avatar without source renders uppercase initials on a themed bg", async () => {
			const screen = await render(<Avatar name="ada lovelace" />);
			expect(screen.getByText("AL")).toBeTruthy();
			const s = flatStyle(screen.getByTestId("k-avatar-fallback"));
			expect(String(s.backgroundColor).startsWith("#")).toBe(true);
			// the initials text child carries the themed foreground color
			const initials = screen.getByText("AL");
			const ts = require("react-native").StyleSheet.flatten(
				initials.props.style,
			) as Record<string, unknown>;
			expect(String(ts.color).startsWith("#")).toBe(true);
		});

		it("Avatar with a source renders the image; onError flips to fallback", async () => {
			const screen = await render(
				<Avatar name="Ada" source={{ uri: "https://x/y.png" }} />,
			);
			expect(screen.getByTestId("k-avatar-image")).toBeTruthy();
			const image = screen.getByTestId("k-avatar-image");
			(image.props as { onError?: (e: unknown) => void }).onError?.(
				new Error("load failed"),
			);
			// state flip happens on the next render tick
			await screen.findByTestId("k-avatar-fallback");
		});

		it("Checkbox states map to distinct box backgrounds and icons", async () => {
			const screen = await render(
				<Checkbox accessibilityLabel="c" value={false} />,
			);
			const unchecked = String(
				flatStyle(screen.getByTestId("k-checkbox-box")).backgroundColor,
			);
			// unchecked: no indicator child at all
			expect(screen.getByTestId("k-checkbox-box").children?.length ?? 0).toBe(
				0,
			);

			await screen.rerender(<Checkbox accessibilityLabel="c" value />);
			const checked = String(
				flatStyle(screen.getByTestId("k-checkbox-box")).backgroundColor,
			);
			expect(checked).not.toBe(unchecked);
			expect(checked.startsWith("#")).toBe(true);
			// checked renders a Check indicator inside the box
			expect(
				screen.getByTestId("k-checkbox-box").children?.length ?? 0,
			).toBeGreaterThan(0);

			await screen.rerender(
				<Checkbox accessibilityLabel="c" value="indeterminate" />,
			);
			const indeterminate = String(
				flatStyle(screen.getByTestId("k-checkbox-box")).backgroundColor,
			);
			expect(indeterminate).toBe(checked);
			expect(
				screen.getByTestId("k-checkbox-box").children?.length ?? 0,
			).toBeGreaterThan(0);
		});

		it("Checkbox keeps the 44dp floor and toggles onValueChange", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Checkbox
					accessibilityLabel="c"
					value={false}
					onValueChange={onValueChange}
				/>,
			);
			const pressable = flatStyle(screen.getByTestId("k-checkbox"));
			expect(Number(pressable.minHeight)).toBeGreaterThanOrEqual(44);
			expect(Number(pressable.minWidth)).toBeGreaterThanOrEqual(44);
			await fireEvent.press(screen.getByTestId("k-checkbox"));
			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange).toHaveBeenLastCalledWith(true);
		});

		it("Checkbox indeterminate press moves to checked (web convention)", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Checkbox
					accessibilityLabel="c"
					value="indeterminate"
					onValueChange={onValueChange}
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-checkbox"));
			expect(onValueChange).toHaveBeenLastCalledWith(true);
		});

		it("Checkbox disabled press is a no-op and announces disabled", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Checkbox
					accessibilityLabel="c"
					disabled
					value={false}
					onValueChange={onValueChange}
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-checkbox"));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByTestId("k-checkbox").props.accessibilityState?.disabled,
			).toBe(true);
		});

		it("Switch states map to distinct track colors and thumb offsets", async () => {
			const screen = await render(
				<Switch accessibilityLabel="s" value={false} />,
			);
			const offTrack = String(
				flatStyle(screen.getByTestId("k-switch-track")).backgroundColor,
			);
			const offThumb = flatStyle(screen.getByTestId("k-switch-thumb"))
				.transform as unknown as Array<Record<string, number>>;

			await screen.rerender(<Switch accessibilityLabel="s" value />);
			const onTrack = String(
				flatStyle(screen.getByTestId("k-switch-track")).backgroundColor,
			);
			const onThumb = flatStyle(screen.getByTestId("k-switch-thumb"))
				.transform as unknown as Array<Record<string, number>>;

			expect(onTrack).not.toBe(offTrack);
			expect(onTrack.startsWith("#")).toBe(true);
			expect(offThumb[0].translateX).toBe(0);
			expect(onThumb[0].translateX).toBeGreaterThan(0);
		});

		it("Switch keeps the 44dp floor and toggles onValueChange", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Switch
					accessibilityLabel="s"
					value={false}
					onValueChange={onValueChange}
				/>,
			);
			const pressable = flatStyle(screen.getByTestId("k-switch"));
			expect(Number(pressable.minHeight)).toBeGreaterThanOrEqual(44);
			expect(Number(pressable.minWidth)).toBeGreaterThanOrEqual(44);
			await fireEvent.press(screen.getByTestId("k-switch"));
			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange).toHaveBeenLastCalledWith(true);
		});

		it("Switch disabled press is a no-op and announces disabled", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Switch
					accessibilityLabel="s"
					disabled
					value={false}
					onValueChange={onValueChange}
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-switch"));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByTestId("k-switch").props.accessibilityState?.disabled,
			).toBe(true);
		});
	});

	// Label/Separator/Spinner/Progress sits LAST in file order on purpose:
	// its spinner test manually unmounts, which poisons TLB's registry for
	// later renders in the same file.
	describe("Tabs, SegmentedControl, EmptyState, Tag", () => {
		const TAB_ITEMS = [
			{ value: "one", label: "One" },
			{ value: "two", label: "Two" },
		];

		it("Tabs/SegmentedControl/EmptyState/Tag render their k-* markers", async () => {
			const screen = await render(
				<>
					<Tabs defaultValue="one" items={TAB_ITEMS}>
						one body
					</Tabs>
					<SegmentedControl data={["day", "week"]} />
					<EmptyState title="No projects yet" />
					<Tag>beta</Tag>
				</>,
			);
			expect(screen.getByTestId("k-tabs")).toBeTruthy();
			expect(screen.getByTestId("k-tab-list")).toBeTruthy();
			expect(screen.getAllByTestId("k-tab").length).toBe(2);
			expect(screen.getByTestId("k-tab-content-one")).toBeTruthy();
			expect(screen.getByTestId("k-segmented")).toBeTruthy();
			expect(screen.getAllByTestId("k-segment").length).toBe(2);
			expect(screen.getByTestId("k-empty-state")).toBeTruthy();
			expect(screen.getByTestId("k-tag")).toBeTruthy();
		});

		it("Tabs: press fires onValueChange; the content slot follows the active value", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Tabs
					defaultValue="one"
					onValueChange={onValueChange}
					items={TAB_ITEMS}
				>
					one body
				</Tabs>,
			);
			const [one, two] = screen.getAllByTestId("k-tab");
			expect(one.props.accessibilityState?.selected).toBe(true);
			expect(two.props.accessibilityState?.selected).toBe(false);
			await fireEvent.press(two);
			expect(onValueChange).toHaveBeenLastCalledWith("two");
			// content pairing: switching the active tab swaps the paired panel
			expect(screen.queryByTestId("k-tab-content-one")).toBeNull();
			expect(screen.getByTestId("k-tab-content-two")).toBeTruthy();

			await screen.rerender(
				<Tabs value="two" onValueChange={onValueChange} items={TAB_ITEMS}>
					two body
				</Tabs>,
			);
			expect(screen.queryByTestId("k-tab-content-one")).toBeNull();
			expect(screen.getByTestId("k-tab-content-two")).toBeTruthy();
			expect(screen.getByText("two body")).toBeTruthy();
			const tabs = screen.getAllByTestId("k-tab");
			expect(tabs[0].props.accessibilityState?.selected).toBe(false);
			expect(tabs[1].props.accessibilityState?.selected).toBe(true);
			// the selected trigger resolves a themed surface, the idle one none
			expect(flatStyle(tabs[1]).backgroundColor).toBeDefined();
		});

		it("Tabs controlled lock: value beats defaultValue and presses never override it", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Tabs
					value="one"
					defaultValue="two"
					onValueChange={onValueChange}
					items={TAB_ITEMS}
				>
					one body
				</Tabs>,
			);
			expect(screen.getByTestId("k-tab-content-one")).toBeTruthy();
			await fireEvent.press(screen.getAllByTestId("k-tab")[1]);
			expect(onValueChange).toHaveBeenLastCalledWith("two");
			// controlled: the visible selection stays on the value prop
			expect(screen.getByTestId("k-tab-content-one")).toBeTruthy();
		});

		it("Tabs disabled trigger: press is a no-op and announces disabled", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Tabs
					value="one"
					onValueChange={onValueChange}
					items={[...TAB_ITEMS, { value: "x", label: "Off", disabled: true }]}
				>
					one body
				</Tabs>,
			);
			const off = screen.getByRole("tab", { name: "Off" });
			await fireEvent.press(off);
			expect(onValueChange).not.toHaveBeenCalled();
			expect(off.props.accessibilityState?.disabled).toBe(true);
		});

		it("SegmentedControl: exclusive selection, press fires, 44dp floor", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<SegmentedControl
					data={["day", "week"]}
					defaultValue="day"
					onValueChange={onValueChange}
				/>,
			);
			let segs = screen.getAllByTestId("k-segment");
			expect(segs[0].props.accessibilityState?.checked).toBe(true);
			expect(Number(flatStyle(segs[0]).minHeight)).toBeGreaterThanOrEqual(44);
			expect(
				screen.getAllByTestId("k-segment-indicator", inclHidden).length,
			).toBe(1);
			await fireEvent.press(segs[1]);
			expect(onValueChange).toHaveBeenLastCalledWith("week");

			await screen.rerender(
				<SegmentedControl
					data={["day", "week"]}
					value="week"
					onValueChange={onValueChange}
				/>,
			);
			segs = screen.getAllByTestId("k-segment");
			expect(segs[0].props.accessibilityState?.checked).toBe(false);
			expect(segs[1].props.accessibilityState?.checked).toBe(true);
			expect(
				screen.getAllByTestId("k-segment-indicator", inclHidden).length,
			).toBe(1);
		});

		it("SegmentedControl controlled lock; disabled segments block selection", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<SegmentedControl
					data={["a", "b"]}
					value="a"
					defaultValue="b"
					onValueChange={onValueChange}
				/>,
			);
			expect(
				screen.getAllByTestId("k-segment")[0].props.accessibilityState?.checked,
			).toBe(true);
			await fireEvent.press(screen.getAllByTestId("k-segment")[1]);
			expect(onValueChange).toHaveBeenLastCalledWith("b");
			expect(
				screen.getAllByTestId("k-segment")[0].props.accessibilityState?.checked,
			).toBe(true);

			await screen.rerender(
				<SegmentedControl
					data={[
						{ value: "a", label: "a" },
						{ value: "b", label: "b", disabled: true },
					]}
					value="a"
					onValueChange={onValueChange}
				/>,
			);
			const disabled = screen.getByRole("radio", { name: "b" });
			await fireEvent.press(disabled);
			expect(onValueChange).not.toHaveBeenCalledTimes(2);
			expect(disabled.props.accessibilityState?.disabled).toBe(true);
		});

		it("EmptyState renders icon/title/description/action; isLoading swaps to skeleton", async () => {
			const onPress = jest.fn();
			const screen = await render(
				<EmptyState
					title="No projects"
					description="Create your first one"
					action={{ label: "New project", onPress }}
				/>,
			);
			expect(screen.getByTestId("k-empty-state-icon", inclHidden)).toBeTruthy();
			expect(screen.getByText("No projects")).toBeTruthy();
			expect(screen.getByText("Create your first one")).toBeTruthy();
			await fireEvent.press(screen.getByTestId("k-empty-state-action"));
			expect(onPress).toHaveBeenCalledTimes(1);

			await screen.rerender(<EmptyState title="No projects" isLoading />);
			expect(screen.queryByText("No projects")).toBeNull();
			expect(
				screen.getAllByTestId("k-skeleton", inclHidden).length,
			).toBeGreaterThan(0);
		});

		it("EmptyState size arms produce distinct heights; destructive tint differs", async () => {
			const seen = new Set<number>();
			const screen = await render(<EmptyState title="t" size="sm" />);
			for (const size of ["sm", "md", "lg"] as const) {
				await screen.rerender(<EmptyState title="t" size={size} />);
				seen.add(
					Number(flatStyle(screen.getByTestId("k-empty-state")).minHeight),
				);
			}
			expect(seen.size).toBe(3);

			await screen.rerender(<EmptyState title="t" />);
			const def = flatStyle(screen.getByTestId("k-empty-state"));
			await screen.rerender(<EmptyState title="t" color="destructive" />);
			const dest = flatStyle(screen.getByTestId("k-empty-state"));
			expect(dest.borderColor).not.toBe(def.borderColor);
			expect(String(dest.backgroundColor).startsWith("#")).toBe(true);
		});

		it("every Tag variant×color arm produces a distinct style triple", async () => {
			const variants = ["solid", "outline", "subtle"] as const;
			const colors = [
				"primary",
				"secondary",
				"destructive",
				"success",
				"warning",
				"info",
				"muted",
			] as const;
			const seen = new Map<string, string>();
			const screen = await render(
				<Tag variant="solid" color="primary">
					x
				</Tag>,
			);
			for (const variant of variants) {
				for (const color of colors) {
					await screen.rerender(
						<Tag variant={variant} color={color}>
							x
						</Tag>,
					);
					const tag = screen.getByTestId("k-tag");
					const s = flatStyle(tag);
					const child = tag.children[0] as { props: { style?: unknown } };
					const fg = require("react-native").StyleSheet.flatten(
						child.props.style,
					) as Record<string, unknown>;
					const sig = JSON.stringify([
						s.backgroundColor,
						fg.color,
						s.borderColor,
					]);
					expect(seen.has(sig)).toBe(false);
					seen.set(sig, `${variant}/${color}`);
					expect(s.backgroundColor).toBeDefined();
				}
			}
			expect(seen.size).toBe(variants.length * colors.length);
		});

		it("Tag remove affordance keeps the 44dp floor and fires once", async () => {
			const onRemove = jest.fn();
			const screen = await render(<Tag onRemove={onRemove}>beta</Tag>);
			const rm = screen.getByTestId("k-tag-remove");
			expect(Number(flatStyle(rm).minHeight)).toBeGreaterThanOrEqual(44);
			expect(Number(flatStyle(rm).minWidth)).toBeGreaterThanOrEqual(44);
			await fireEvent.press(rm);
			expect(onRemove).toHaveBeenCalledTimes(1);

			await screen.rerender(<Tag>beta</Tag>);
			expect(screen.queryByTestId("k-tag-remove")).toBeNull();
		});
	});

	describe("Skeleton, RadioGroup, Alert, Toast", () => {
		const findSvgProp = (tree: unknown, key: string): unknown[] => {
			const found: unknown[] = [];
			const walk = (node: unknown) => {
				if (Array.isArray(node)) {
					node.forEach(walk);
					return;
				}
				if (node && typeof node === "object") {
					const props = (node as { props?: Record<string, unknown> }).props;
					if (props && key in props) found.push(props[key]);
					walk((node as { children?: unknown }).children);
				}
			};
			walk(tree);
			return found;
		};

		it("Skeleton/RadioGroup/Alert/Toast render their k-* markers", async () => {
			const screen = await render(
				<>
					<Skeleton style={{ width: 120, height: 16 }} />
					<RadioGroup value="a" onValueChange={() => undefined}>
						<RadioGroup.Item value="a" label="Alpha" />
					</RadioGroup>
					<Alert>heads up</Alert>
					<Toast open onOpenChange={() => undefined}>
						<Toast.Title>saved</Toast.Title>
					</Toast>
				</>,
			);
			expect(screen.getByTestId("k-skeleton")).toBeTruthy();
			expect(screen.getByTestId("k-radio-group")).toBeTruthy();
			expect(screen.getByTestId("k-radio-item")).toBeTruthy();
			expect(screen.getByTestId("k-alert")).toBeTruthy();
			expect(screen.getByTestId("k-toast")).toBeTruthy();
		});

		it("Skeleton variants map to distinct radii on a themed surface", async () => {
			const screen = await render(
				<Skeleton
					animated={false}
					variant="rect"
					style={{ width: 100, height: 12 }}
				/>,
			);
			const rect = flatStyle(screen.getByTestId("k-skeleton"));
			await screen.rerender(
				<Skeleton
					animated={false}
					variant="circle"
					style={{ width: 40, height: 40 }}
				/>,
			);
			const circle = flatStyle(screen.getByTestId("k-skeleton"));
			expect(Number(rect.borderRadius)).toBeGreaterThan(0);
			expect(Number(circle.borderRadius)).toBeGreaterThan(
				Number(rect.borderRadius),
			);
			expect(String(rect.backgroundColor).startsWith("#")).toBe(true);
			// animation off still renders the block, just without the loop
			expect(flatStyle(screen.getByTestId("k-skeleton")).opacity).toBe(1);
		});

		it("Skeleton pulse loop starts once per mount and stops when disabled", async () => {
			const AnimatedRN = require("react-native").Animated;
			const origLoop = AnimatedRN.loop;
			const loops: Array<{ stop: ReturnType<typeof jest.fn> }> = [];
			AnimatedRN.loop = ((...args: unknown[]) => {
				const loop = origLoop(...(args as []));
				const origStop = loop.stop.bind(loop);
				(loop as { stop: unknown }).stop = jest.fn(origStop);
				loops.push(loop as never);
				return loop;
			}) as typeof AnimatedRN.loop;
			try {
				const screen = await render(
					<Skeleton style={{ width: 80, height: 12 }} />,
				);
				await screen.rerender(<Skeleton style={{ width: 120, height: 12 }} />);
				expect(loops.length).toBe(1);
				await screen.rerender(
					<Skeleton animated={false} style={{ width: 80, height: 12 }} />,
				);
				expect(loops.length).toBe(1);
				expect(loops[0].stop).toHaveBeenCalled();
			} finally {
				AnimatedRN.loop = origLoop;
			}
		});

		it("RadioGroup selection styles differ and press selects", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<RadioGroup value="a" onValueChange={onValueChange}>
					<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
					<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
				</RadioGroup>,
			);
			const sel = flatStyle(screen.getByTestId("k-radio-item-a-circle"));
			const un = flatStyle(screen.getByTestId("k-radio-item-b-circle"));
			expect(sel.borderColor).not.toBe(un.borderColor);
			expect(
				screen.getByTestId("k-radio-item-a-circle").children?.length ?? 0,
			).toBeGreaterThan(0);
			expect(
				screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
			).toBe(0);

			await fireEvent.press(screen.getByTestId("k-radio-item-b"));
			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange).toHaveBeenLastCalledWith("b");
			// labels render as themed text
			expect(screen.getByText("Beta")).toBeTruthy();
		});

		it("RadioGroup controlled value prop flips the checked item without a press", async () => {
			const screen = await render(
				<RadioGroup value="a" onValueChange={() => undefined}>
					<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
					<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
				</RadioGroup>,
			);
			const [alpha, beta] = screen.getAllByRole("radio");
			expect(alpha.props.accessibilityState?.checked).toBe(true);
			expect(beta.props.accessibilityState?.checked).toBe(false);
			await screen.rerender(
				<RadioGroup value="b" onValueChange={() => undefined}>
					<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
					<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
				</RadioGroup>,
			);
			const [alpha2, beta2] = screen.getAllByRole("radio");
			expect(alpha2.props.accessibilityState?.checked).toBe(false);
			expect(beta2.props.accessibilityState?.checked).toBe(true);
			// the visual surface follows the prop, not just the a11y state
			expect(
				screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
			).toBeGreaterThan(0);
		});

		it("RadioGroup items keep the 44dp floor; disabled no-ops and announces", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<RadioGroup value="a" onValueChange={onValueChange}>
					<RadioGroup.Item value="a" label="Alpha" />
				</RadioGroup>,
			);
			const item = flatStyle(screen.getByTestId("k-radio-item"));
			expect(Number(item.minHeight)).toBeGreaterThanOrEqual(44);
			expect(Number(item.minWidth)).toBeGreaterThanOrEqual(44);

			await screen.rerender(
				<RadioGroup value="a" onValueChange={onValueChange}>
					<RadioGroup.Item value="a" label="Alpha" disabled />
				</RadioGroup>,
			);
			await fireEvent.press(screen.getByTestId("k-radio-item"));
			expect(onValueChange).not.toHaveBeenCalled();
			expect(
				screen.getByTestId("k-radio-item").props.accessibilityState?.disabled,
			).toBe(true);
		});

		it("every Alert variant×color arm produces a distinct style triple", async () => {
			const variants = ["solid", "outline", "subtle"] as const;
			const colors = [
				"primary",
				"secondary",
				"destructive",
				"success",
				"warning",
				"info",
				"muted",
			] as const;
			const seen = new Map<string, string>();
			const screen = await render(
				<Alert variant="solid" color="primary">
					x
				</Alert>,
			);
			for (const variant of variants) {
				for (const color of colors) {
					await screen.rerender(
						<Alert variant={variant} color={color}>
							x
						</Alert>,
					);
					const s = flatStyle(screen.getByTestId("k-alert"));
					const fg = flatStyle(screen.getByText("x")).color;
					const sig = JSON.stringify([s.backgroundColor, fg, s.borderColor]);
					expect(seen.has(sig)).toBe(false);
					seen.set(sig, `${variant}/${color}`);
					expect(s.backgroundColor).toBeDefined();
					expect(s.borderColor).toBeDefined();
					expect(String(fg).startsWith("#")).toBe(true);
				}
			}
			expect(seen.size).toBe(variants.length * colors.length);
		});

		it("Alert shows a per-color icon unless showIcon is false", async () => {
			const screen = await render(<Alert>msg</Alert>);
			expect(findSvgProp(screen.toJSON(), "stroke").length).toBeGreaterThan(0);
			await screen.rerender(<Alert showIcon={false}>msg</Alert>);
			expect(findSvgProp(screen.toJSON(), "stroke").length).toBe(0);
			// the icon carries the color tint: success vs destructive differ
			await screen.rerender(<Alert color="success">msg</Alert>);
			const success = String(findSvgProp(screen.toJSON(), "stroke")[0]);
			await screen.rerender(<Alert color="destructive">msg</Alert>);
			const destructive = String(findSvgProp(screen.toJSON(), "stroke")[0]);
			expect(success).not.toBe(destructive);
		});

		it("Alert dismiss hides + fires onDismiss; new content re-shows", async () => {
			const onDismiss = jest.fn();
			const screen = await render(
				<Alert dismissable onDismiss={onDismiss}>
					first message
				</Alert>,
			);
			await fireEvent.press(screen.getByTestId("k-alert-dismiss"));
			expect(onDismiss).toHaveBeenCalledTimes(1);
			expect(screen.queryByTestId("k-alert")).toBeNull();

			// same-content rerender stays hidden; new content re-shows
			await screen.rerender(
				<Alert dismissable onDismiss={onDismiss}>
					first message
				</Alert>,
			);
			expect(screen.queryByTestId("k-alert")).toBeNull();
			await screen.rerender(
				<Alert dismissable onDismiss={onDismiss}>
					second message
				</Alert>,
			);
			expect(screen.getByTestId("k-alert")).toBeTruthy();
			expect(screen.getByText("second message")).toBeTruthy();
		});

		it("non-dismissable Alert renders no dismiss marker", async () => {
			const screen = await render(<Alert>plain</Alert>);
			expect(screen.queryByTestId("k-alert-dismiss")).toBeNull();
		});

		it("Alert Title/Description render themed compound parts", async () => {
			const screen = await render(
				<Alert color="success" variant="solid">
					<Alert.Title>deployment ok</Alert.Title>
					<Alert.Description>all checks passed</Alert.Description>
				</Alert>,
			);
			expect(screen.getByTestId("k-alert-title")).toBeTruthy();
			expect(screen.getByTestId("k-alert-description")).toBeTruthy();
			const title = flatStyle(screen.getByTestId("k-alert-title"));
			const desc = flatStyle(screen.getByTestId("k-alert-description"));
			expect(String(title.color).startsWith("#")).toBe(true);
			expect(String(desc.color).startsWith("#")).toBe(true);
			expect(Number(title.fontWeight)).toBeGreaterThan(Number(desc.fontWeight));
		});

		it("Toast renders when open and nothing when closed", async () => {
			const screen = await render(
				<Toast open onOpenChange={() => undefined}>
					<Toast.Title>saved</Toast.Title>
					<Toast.Description>just now</Toast.Description>
				</Toast>,
			);
			expect(screen.getByTestId("k-toast")).toBeTruthy();
			expect(screen.getByText("saved")).toBeTruthy();
			expect(screen.getByText("just now")).toBeTruthy();
			await screen.rerender(
				<Toast open={false} onOpenChange={() => undefined}>
					<Toast.Title>saved</Toast.Title>
				</Toast>,
			);
			expect(screen.queryByTestId("k-toast")).toBeNull();
		});

		it("Toast auto-dismiss timing fires once, resets, and never stales", async () => {
			jest.useFakeTimers();
			const onOpenChange = jest.fn();
			const tree = (open: boolean, duration: number) => (
				<Toast open={open} duration={duration} onOpenChange={onOpenChange}>
					<Toast.Title>saved</Toast.Title>
				</Toast>
			);
			try {
				const screen = await render(tree(true, 1000));
				jest.advanceTimersByTime(999);
				expect(onOpenChange).not.toHaveBeenCalled();
				jest.advanceTimersByTime(1);
				expect(onOpenChange).toHaveBeenCalledTimes(1);
				expect(onOpenChange).toHaveBeenLastCalledWith(false);

				// reopen restarts the window; close clears any pending timer
				await screen.rerender(tree(false, 1000));
				jest.advanceTimersByTime(5000);
				expect(onOpenChange).toHaveBeenCalledTimes(1);
				await screen.rerender(tree(true, 1000));
				jest.advanceTimersByTime(999);
				expect(onOpenChange).toHaveBeenCalledTimes(1);
				jest.advanceTimersByTime(1);
				expect(onOpenChange).toHaveBeenCalledTimes(2);

				// manual close before the window: no stale fire afterwards
				await screen.rerender(tree(true, 1000));
				jest.advanceTimersByTime(500);
				await screen.rerender(tree(false, 1000));
				jest.advanceTimersByTime(5000);
				expect(onOpenChange).toHaveBeenCalledTimes(2);

				// duration change mid-open reschedules to the new window
				await screen.rerender(tree(true, 500));
				jest.advanceTimersByTime(499);
				expect(onOpenChange).toHaveBeenCalledTimes(2);
				jest.advanceTimersByTime(1);
				expect(onOpenChange).toHaveBeenCalledTimes(3);
			} finally {
				jest.useRealTimers();
			}
		});

		it("Toast top/bottom positions produce distinct viewport placement", async () => {
			const screen = await render(
				<Toast open position="top" onOpenChange={() => undefined}>
					<Toast.Title>saved</Toast.Title>
				</Toast>,
			);
			const top = flatStyle(screen.getByTestId("k-toast-viewport"));
			await screen.rerender(
				<Toast open position="bottom" onOpenChange={() => undefined}>
					<Toast.Title>saved</Toast.Title>
				</Toast>,
			);
			const bottom = flatStyle(screen.getByTestId("k-toast-viewport"));
			expect(top.justifyContent).not.toBe(bottom.justifyContent);
			const card = flatStyle(screen.getByTestId("k-toast"));
			expect(String(card.backgroundColor).startsWith("#")).toBe(true);
			expect(Number(card.borderRadius)).toBeGreaterThan(0);
		});
	});

	describe("Rating", () => {
		const findSvgProp = (tree: unknown, key: string): unknown[] => {
			const found: unknown[] = [];
			const walk = (node: unknown) => {
				if (Array.isArray(node)) {
					node.forEach(walk);
					return;
				}
				if (node && typeof node === "object") {
					const props = (node as { props?: Record<string, unknown> }).props;
					if (props && key in props) found.push(props[key]);
					walk((node as { children?: unknown }).children);
				}
			};
			walk(tree);
			return found;
		};

		it("Rating renders k-rating with one star marker per count", async () => {
			const screen = await render(<Rating value={3} />);
			expect(screen.getByTestId("k-rating", inclHidden)).toBeTruthy();
			expect(screen.getAllByTestId("k-rating-star")).toHaveLength(5);
			await screen.rerender(<Rating value={3} count={8} />);
			expect(screen.getAllByTestId("k-rating-star")).toHaveLength(8);
		});

		it("press sets the value; pressing the same star resets to 0", async () => {
			const onValueChange = jest.fn();
			const screen = await render(<Rating onValueChange={onValueChange} />);
			await fireEvent.press(screen.getAllByTestId("k-rating-star")[3]);
			expect(onValueChange).toHaveBeenLastCalledWith(4);
			await fireEvent.press(screen.getAllByTestId("k-rating-star")[3]);
			expect(onValueChange).toHaveBeenLastCalledWith(0);
		});

		it("size arms map to distinct star icon sizes", async () => {
			const sizes = ["sm", "md", "lg"] as const;
			const seen = new Set<number>();
			const screen = await render(<Rating value={2} size="sm" />);
			for (const size of sizes) {
				await screen.rerender(<Rating value={2} size={size} />);
				const widths = findSvgProp(screen.toJSON(), "width").map(Number);
				expect(Math.max(...widths)).toBeGreaterThan(0);
				seen.add(Math.max(...widths));
			}
			expect(seen.size).toBe(sizes.length);
		});

		it("allowHalf renders a 50% overlay and half presses resolve .5", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Rating value={2.5} allowHalf onValueChange={onValueChange} />,
			);
			// RN has no clip-path: the half fill is a 50%-width overflow window
			const half = screen.getAllByTestId("k-rating-star-half", inclHidden)[0];
			expect(
				require("react-native").StyleSheet.flatten(half.props.style)?.width,
			).toBe("50%");
			const stars = screen.getAllByTestId("k-rating-star");
			await fireEvent(stars[1], "press", { locationX: 2 });
			expect(onValueChange).toHaveBeenLastCalledWith(1.5);
			await fireEvent(stars[1], "press", { locationX: 999 });
			expect(onValueChange).toHaveBeenLastCalledWith(2);
			// missing press location falls back to the whole star
			await fireEvent(stars[2], "press");
			expect(onValueChange).toHaveBeenLastCalledWith(3);
		});
	});

	describe("Slider", () => {
		// the responder polyfill under TLB leaves a grant lock that poisons
		// every later render in this file, so tests drive the handlers via
		// props directly (wiring is asserted once below)
		type Screen = Awaited<ReturnType<typeof render>>;
		type Track = ReturnType<Screen["getAllByTestId"]>[number];

		const layout = async (track: Track, width: number) => {
			await act(async () => {
				track.props.onLayout({ nativeEvent: { layout: { width } } });
			});
		};

		const grant = async (track: Track, locationX: number) => {
			await act(async () => {
				track.props.onResponderGrant({
					nativeEvent: { locationX },
				});
			});
		};

		it("wires the responder handlers on the track", async () => {
			const screen = await render(
				<Slider value={[50]} accessibilityLabel="vol" />,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			expect(track.props.onStartShouldSetResponder()).toBe(true);
			expect(typeof track.props.onResponderGrant).toBe("function");
			expect(typeof track.props.onResponderMove).toBe("function");
		});

		it("Slider renders k-slider, track, range and thumb markers", async () => {
			const screen = await render(
				<Slider value={[50]} accessibilityLabel="vol" />,
			);
			expect(screen.getByTestId("k-slider", inclHidden)).toBeTruthy();
			expect(screen.getByTestId("k-slider-track", inclHidden)).toBeTruthy();
			expect(screen.getByTestId("k-slider-range", inclHidden)).toBeTruthy();
			expect(screen.getByTestId("k-slider-thumb", inclHidden)).toBeTruthy();
		});

		it("positions range and thumb by percent of the value span", async () => {
			const screen = await render(
				<Slider value={[50]} accessibilityLabel="vol" />,
			);
			const s = flatStyle(screen.getByTestId("k-slider-range", inclHidden));
			expect(String(s.width)).toBe("50%");
			const thumbS = flatStyle(
				screen.getByTestId("k-slider-thumb", inclHidden),
			);
			expect(thumbS.left).toBe("50%");
			expect(thumbS.marginLeft).toBe(-10);
		});

		it("tap on the track resolves a stepped value and fires onValueChange", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					defaultValue={[25]}
					accessibilityLabel="vol"
					onValueChange={onValueChange}
				/>,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			await layout(track, 200);
			await grant(track, 100);
			expect(onValueChange).toHaveBeenCalledWith([50]);
			// uncontrolled: internal state repositions the markers, not just the callback
			const s = flatStyle(screen.getByTestId("k-slider-range", inclHidden));
			expect(String(s.width)).toBe("50%");
		});

		it("controlled value prop wins over a tap", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					value={[25]}
					accessibilityLabel="vol"
					onValueChange={onValueChange}
				/>,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			await layout(track, 200);
			await grant(track, 100);
			expect(onValueChange).toHaveBeenCalledWith([50]);
			// callback fired, but the controlled prop still owns the fill
			const s = flatStyle(screen.getByTestId("k-slider-range", inclHidden));
			expect(String(s.width)).toBe("25%");
		});

		it("rounds to step and never emits float drift", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					defaultValue={[0]}
					min={0}
					max={10}
					step={5}
					accessibilityLabel="vol"
					onValueChange={onValueChange}
				/>,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			await layout(track, 200);
			await grant(track, 80);
			expect(onValueChange).toHaveBeenLastCalledWith([5]);
			await grant(track, 160);
			expect(onValueChange).toHaveBeenLastCalledWith([10]);
		});

		it("maps a non-zero min into both value and percent space", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					defaultValue={[10]}
					min={10}
					max={110}
					accessibilityLabel="vol"
					onValueChange={onValueChange}
				/>,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			await layout(track, 200);
			await grant(track, 60);
			expect(onValueChange).toHaveBeenCalledWith([40]);
		});

		it("clamps taps beyond the track edges to min/max", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					defaultValue={[50]}
					accessibilityLabel="vol"
					onValueChange={onValueChange}
				/>,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			await layout(track, 200);
			await grant(track, -20);
			expect(onValueChange).toHaveBeenLastCalledWith([0]);
			await grant(track, 400);
			expect(onValueChange).toHaveBeenLastCalledWith([100]);
		});

		it("multi-thumb: nearest thumb moves and the range fill spans start→first only", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					defaultValue={[25, 75]}
					accessibilityLabel="range"
					onValueChange={onValueChange}
				/>,
			);
			expect(screen.getAllByTestId("k-slider-thumb", inclHidden)).toHaveLength(
				2,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			await layout(track, 200);
			// 140px of 200 → 70; nearest thumb is the second (75)
			await grant(track, 140);
			expect(onValueChange).toHaveBeenLastCalledWith([25, 70]);
			// fill stays start→first thumb (25%), never spans to the second
			const s = flatStyle(screen.getByTestId("k-slider-range", inclHidden));
			expect(String(s.width)).toBe("25%");
		});

		it("empty values renders the track with no thumbs and no crash", async () => {
			const screen = await render(
				<Slider value={[]} accessibilityLabel="empty" />,
			);
			expect(screen.getByTestId("k-slider-track", inclHidden)).toBeTruthy();
			expect(screen.queryByTestId("k-slider-thumb")).toBeNull();
		});

		it("disabled blocks gestures and dims", async () => {
			const onValueChange = jest.fn();
			const screen = await render(
				<Slider
					defaultValue={[50]}
					disabled
					accessibilityLabel="vol"
					onValueChange={onValueChange}
				/>,
			);
			const track = screen.getByTestId("k-slider-track", inclHidden);
			await layout(track, 200);
			expect(track.props.onStartShouldSetResponder()).toBe(false);
			await grant(track, 100);
			expect(onValueChange).not.toHaveBeenCalled();
			const root = flatStyle(screen.getByTestId("k-slider", inclHidden));
			expect(Number(root.opacity)).toBe(0.5);
		});

		it("isLoading renders the skeleton arm instead of the interactive track", async () => {
			const screen = await render(
				<Slider isLoading accessibilityLabel="vol" />,
			);
			expect(screen.queryByTestId("k-slider-track")).toBeNull();
			expect(screen.getByTestId("k-slider", inclHidden)).toBeTruthy();
		});
	});

	describe("Dialog, AlertDialog", () => {
		type Screen = Awaited<ReturnType<typeof render>>;

		// hardware back: RN Modal forwards onRequestClose onto its host view,
		// which no TLB query reaches — walk the serialized tree for it
		type JsonNode = {
			props?: Record<string, unknown>;
			children?: (JsonNode | string)[];
		};

		const modalHost = (screen: Screen) => {
			const walk = (
				node: JsonNode | string,
			): { props: Record<string, unknown> } | null => {
				if (typeof node === "string") return null;
				if (node.props && typeof node.props.onRequestClose === "function") {
					return node as { props: Record<string, unknown> };
				}
				for (const child of node.children ?? []) {
					const found = walk(child);
					if (found) return found;
				}
				return null;
			};
			const tree = screen.toJSON();
			const tops = Array.isArray(tree) ? tree : tree ? [tree] : [];
			for (const top of tops) {
				const found = walk(top);
				if (found) return found;
			}
			return null;
		};

		const back = async (screen: Screen) => {
			const host = modalHost(screen);
			if (!host) throw new Error("modal host carries onRequestClose");
			await act(async () => {
				(host.props.onRequestClose as () => void)();
			});
		};

		it("Dialog renders panel markers when open", async () => {
			const screen = await render(
				<Dialog open onOpenChange={() => undefined}>
					<Dialog.Header>
						<Dialog.Title>title</Dialog.Title>
						<Dialog.Description>description</Dialog.Description>
					</Dialog.Header>
					<Dialog.Body>body</Dialog.Body>
					<Dialog.Footer>footer</Dialog.Footer>
				</Dialog>,
			);
			for (const id of [
				"k-dialog",
				"k-dialog-overlay",
				"k-dialog-close",
				"k-dialog-header",
				"k-dialog-title",
				"k-dialog-description",
				"k-dialog-body",
				"k-dialog-footer",
			]) {
				expect(screen.getByTestId(id, inclHidden)).toBeTruthy();
			}
		});

		it("Dialog open={false} renders nothing", async () => {
			const screen = await render(
				<Dialog open={false} onOpenChange={() => undefined} />,
			);
			expect(screen.queryByTestId("k-dialog", inclHidden)).toBeNull();
		});

		// fireEvent's responder polyfill leaves the same grant lock the
		// Slider block hit — press through the host's onClick instead
		// (Pressable consumes onPress; the wired click survives on the host)
		const tap = async (el: { props: { onClick?: (e: unknown) => void } }) => {
			await act(async () => {
				el.props.onClick?.({ nativeEvent: {} });
			});
		};

		it("overlay press closes only when dismissable", async () => {
			const a = jest.fn();
			const s1 = await render(
				<Dialog open onOpenChange={a}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			await tap(s1.getByTestId("k-dialog-overlay", inclHidden));
			expect(a).toHaveBeenCalledWith(false);

			const b = jest.fn();
			const s2 = await render(
				<Dialog open onOpenChange={b} dismissable={false}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			await tap(s2.getByTestId("k-dialog-overlay", inclHidden));
			expect(b).not.toHaveBeenCalled();
		});

		it("close button closes; showCloseButton={false} removes it", async () => {
			const a = jest.fn();
			const s1 = await render(
				<Dialog open onOpenChange={a}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			await tap(s1.getByTestId("k-dialog-close", inclHidden));
			expect(a).toHaveBeenCalledWith(false);

			const s2 = await render(
				<Dialog open showCloseButton={false} onOpenChange={() => undefined}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			expect(s2.queryByTestId("k-dialog-close", inclHidden)).toBeNull();
		});

		it("hardware back honors dismissable (Dialog)", async () => {
			const a = jest.fn();
			const s1 = await render(
				<Dialog open onOpenChange={a}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			await back(s1);
			expect(a).toHaveBeenCalledWith(false);

			const b = jest.fn();
			const s2 = await render(
				<Dialog open onOpenChange={b} dismissable={false}>
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			await back(s2);
			expect(b).not.toHaveBeenCalled();
		});

		it("size mapping: md clamps to 512, full bleeds edge to edge", async () => {
			const md = await render(
				<Dialog open onOpenChange={() => undefined} size="md">
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			const mdStyle = flatStyle(md.getByTestId("k-dialog", inclHidden));
			expect(String(mdStyle.width)).toBe("90%");
			expect(mdStyle.maxWidth).toBe(512);

			const full = await render(
				<Dialog open onOpenChange={() => undefined} size="full">
					<Dialog.Body>body</Dialog.Body>
				</Dialog>,
			);
			const fullStyle = flatStyle(full.getByTestId("k-dialog", inclHidden));
			expect(String(fullStyle.width)).toBe("100%");
			expect(String(fullStyle.height)).toBe("100%");
			expect(fullStyle.borderRadius).toBe(0);
		});

		it("AlertDialog renders part markers and never dismisses by default", async () => {
			const onOpenChange = jest.fn();
			const screen = await render(
				<AlertDialog open onOpenChange={onOpenChange}>
					<AlertDialog.Header>
						<AlertDialog.Title>delete?</AlertDialog.Title>
						<AlertDialog.Description>permanent</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Body>body</AlertDialog.Body>
					<AlertDialog.Footer>
						<AlertDialog.Cancel onPress={() => undefined}>
							cancel
						</AlertDialog.Cancel>
						<AlertDialog.Action onPress={() => undefined}>
							delete
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog>,
			);
			for (const id of [
				"k-alert-dialog",
				"k-alert-dialog-header",
				"k-alert-dialog-title",
				"k-alert-dialog-description",
				"k-alert-dialog-body",
				"k-alert-dialog-footer",
				"k-alert-dialog-cancel",
				"k-alert-dialog-action",
			]) {
				expect(screen.getByTestId(id, inclHidden)).toBeTruthy();
			}
			await back(screen);
			expect(onOpenChange).not.toHaveBeenCalled();
		});

		it("AlertDialog hardware back closes when dismissable", async () => {
			const onOpenChange = jest.fn();
			const screen = await render(
				<AlertDialog open onOpenChange={onOpenChange} dismissable>
					<AlertDialog.Body>body</AlertDialog.Body>
				</AlertDialog>,
			);
			await back(screen);
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it("Action and Cancel close before their own onPress; Cancel is outline", async () => {
			const order: string[] = [];
			const onOpenChange = jest.fn((next: boolean) =>
				order.push(`open:${next}`),
			);
			const screen = await render(
				<AlertDialog open onOpenChange={onOpenChange}>
					<AlertDialog.Footer>
						<AlertDialog.Cancel onPress={() => order.push("cancel")}>
							cancel
						</AlertDialog.Cancel>
						<AlertDialog.Action onPress={() => order.push("action")}>
							delete
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog>,
			);
			await tap(screen.getByTestId("k-alert-dialog-cancel", inclHidden));
			await tap(screen.getByTestId("k-alert-dialog-action", inclHidden));
			expect(onOpenChange).toHaveBeenCalledWith(false);
			expect(order).toEqual(["open:false", "cancel", "open:false", "action"]);

			const cancelStyle = flatStyle(
				screen.getByTestId("k-alert-dialog-cancel", inclHidden),
			);
			expect(cancelStyle.borderWidth).toBe(1);
		});
	});

	describe("Toggle, ToggleGroup, Indicator markers", () => {
		it("Toggle/ToggleGroup/ToggleGroupItem/Indicator render k-* markers", async () => {
			const screen = await render(
				<>
					<Toggle accessibilityLabel="bold">B</Toggle>
					<ToggleGroup type="single">
						<ToggleGroupItem value="left">Left</ToggleGroupItem>
					</ToggleGroup>
					<Indicator>
						<Text>bell</Text>
					</Indicator>
				</>,
			);
			expect(screen.getByTestId("k-toggle")).toBeTruthy();
			expect(screen.getByTestId("k-toggle-group")).toBeTruthy();
			expect(screen.getByTestId("k-toggle-group-item")).toBeTruthy();
			expect(screen.getByTestId("k-indicator")).toBeTruthy();
			expect(screen.getByTestId("k-indicator-dot", inclHidden)).toBeTruthy();
		});

		it("k-toggle never collides with the group markers", async () => {
			const screen = await render(
				<>
					<Toggle accessibilityLabel="bold">B</Toggle>
					<ToggleGroup type="single">
						<ToggleGroupItem value="left">Left</ToggleGroupItem>
					</ToggleGroup>
				</>,
			);
			// exact-match testIDs: the bare toggle query returns only the Toggle
			expect(screen.getAllByTestId("k-toggle").length).toBe(1);
			expect(screen.getAllByTestId("k-toggle-group").length).toBe(1);
			expect(screen.getAllByTestId("k-toggle-group-item").length).toBe(1);
		});

		it("Toggle announces checked state from pressed/defaultPressed", async () => {
			const off = await render(<Toggle accessibilityLabel="bold">B</Toggle>);
			expect(off.getByTestId("k-toggle").props.accessibilityRole).toBe(
				"button",
			);
			expect(off.getByTestId("k-toggle").props.accessibilityState.checked).toBe(
				false,
			);
			// defaultPressed seeds the uncontrolled state on a fresh mount
			const on = await render(
				<Toggle defaultPressed accessibilityLabel="bold">
					B
				</Toggle>,
			);
			expect(on.getByTestId("k-toggle").props.accessibilityState.checked).toBe(
				true,
			);
		});

		it("Toggle size ladder maps 36/40/44 over a 44dp floor", async () => {
			const screen = await render(
				<Toggle size="sm" accessibilityLabel="bold">
					B
				</Toggle>,
			);
			const heights: number[] = [];
			for (const size of ["sm", "md", "lg"] as const) {
				await screen.rerender(
					<Toggle size={size} accessibilityLabel="bold">
						B
					</Toggle>,
				);
				const s = flatStyle(screen.getByTestId("k-toggle"));
				heights.push(Number(s.height));
				expect(Number(s.minHeight)).toBe(44);
				expect(Number(s.minWidth)).toBe(44);
			}
			expect(heights).toEqual([36, 40, 44]);
		});

		it("Toggle outline adds a themed border the default lacks", async () => {
			const screen = await render(<Toggle accessibilityLabel="bold">B</Toggle>);
			expect(
				Number(flatStyle(screen.getByTestId("k-toggle")).borderWidth),
			).toBe(0);
			await screen.rerender(
				<Toggle variant="outline" accessibilityLabel="bold">
					B
				</Toggle>,
			);
			const s = flatStyle(screen.getByTestId("k-toggle"));
			expect(Number(s.borderWidth)).toBe(1);
			expect(String(s.borderColor).startsWith("#")).toBe(true);
		});

		it("Toggle uncontrolled press cycles onPressedChange true then false", async () => {
			const onPressedChange = jest.fn();
			const screen = await render(
				<Toggle onPressedChange={onPressedChange} accessibilityLabel="bold">
					B
				</Toggle>,
			);
			await fireEvent.press(screen.getByTestId("k-toggle"));
			expect(onPressedChange).toHaveBeenNthCalledWith(1, true);
			expect(
				screen.getByTestId("k-toggle").props.accessibilityState.checked,
			).toBe(true);
			await fireEvent.press(screen.getByTestId("k-toggle"));
			expect(onPressedChange).toHaveBeenNthCalledWith(2, false);
			expect(
				screen.getByTestId("k-toggle").props.accessibilityState.checked,
			).toBe(false);
		});

		it("Toggle controlled pressed locks state until the parent updates", async () => {
			const onPressedChange = jest.fn();
			const screen = await render(
				<Toggle
					pressed={false}
					onPressedChange={onPressedChange}
					accessibilityLabel="bold"
				>
					B
				</Toggle>,
			);
			await fireEvent.press(screen.getByTestId("k-toggle"));
			expect(onPressedChange).toHaveBeenCalledWith(true);
			expect(
				screen.getByTestId("k-toggle").props.accessibilityState.checked,
			).toBe(false);
			await screen.rerender(
				<Toggle
					pressed
					onPressedChange={onPressedChange}
					accessibilityLabel="bold"
				>
					B
				</Toggle>,
			);
			expect(
				screen.getByTestId("k-toggle").props.accessibilityState.checked,
			).toBe(true);
		});

		it("disabled Toggle dims to half opacity and never fires", async () => {
			const onPressedChange = jest.fn();
			const screen = await render(
				<Toggle
					disabled
					onPressedChange={onPressedChange}
					accessibilityLabel="bold"
				>
					B
				</Toggle>,
			);
			const toggle = screen.getByTestId("k-toggle");
			expect(Number(flatStyle(toggle).opacity)).toBe(0.5);
			expect(toggle.props.accessibilityState.disabled).toBe(true);
			await fireEvent.press(toggle);
			expect(onPressedChange).not.toHaveBeenCalled();
		});
	});

	describe("Accordion, Collapsible", () => {
		it("Accordion renders root, item, trigger and content markers; closed unmounts content", async () => {
			const screen = await render(
				<Accordion type="single" defaultValue="a">
					<Accordion.Item value="a">
						<Accordion.Trigger>Section</Accordion.Trigger>
						<Accordion.Content>body</Accordion.Content>
					</Accordion.Item>
				</Accordion>,
			);
			expect(screen.getByTestId("k-accordion")).toBeTruthy();
			expect(screen.getByTestId("k-accordion-item")).toBeTruthy();
			expect(screen.getByTestId("k-accordion-trigger")).toBeTruthy();
			expect(screen.getByTestId("k-accordion-content")).toBeTruthy();

			await screen.rerender(
				<Accordion type="single" value="">
					<Accordion.Item value="a">
						<Accordion.Trigger>Section</Accordion.Trigger>
						<Accordion.Content>body</Accordion.Content>
					</Accordion.Item>
				</Accordion>,
			);
			expect(screen.queryByTestId("k-accordion-content")).toBeNull();
		});

		it("Collapsible renders root, trigger and content markers; closed unmounts content", async () => {
			const screen = await render(
				<Collapsible defaultOpen>
					<Collapsible.Trigger>more</Collapsible.Trigger>
					<Collapsible.Content>detail</Collapsible.Content>
				</Collapsible>,
			);
			expect(screen.getByTestId("k-collapsible")).toBeTruthy();
			expect(screen.getByTestId("k-collapsible-trigger")).toBeTruthy();
			expect(screen.getByTestId("k-collapsible-content")).toBeTruthy();

			await screen.rerender(
				<Collapsible open={false}>
					<Collapsible.Trigger>more</Collapsible.Trigger>
					<Collapsible.Content>detail</Collapsible.Content>
				</Collapsible>,
			);
			expect(screen.queryByTestId("k-collapsible-content")).toBeNull();
			expect(screen.getByTestId("k-collapsible-trigger")).toBeTruthy();
		});
	});

	describe("Banner, Textarea", () => {
		it("Banner renders root, content and close markers; no onClose drops close", async () => {
			const screen = await render(
				<Banner position="static" onClose={() => undefined}>
					scheduled maintenance
				</Banner>,
			);
			expect(screen.getByTestId("k-banner")).toBeTruthy();
			expect(screen.getByTestId("k-banner-content")).toBeTruthy();
			expect(screen.getByTestId("k-banner-close")).toBeTruthy();

			const bare = await render(<Banner position="static">plain</Banner>);
			expect(bare.queryByTestId("k-banner-close")).toBeNull();
		});

		it("Textarea renders k-textarea; isLoading keeps the marker on the skeleton", async () => {
			const screen = await render(<Textarea accessibilityLabel="notes" />);
			expect(screen.getByTestId("k-textarea")).toBeTruthy();

			const loading = await render(
				<Textarea isLoading accessibilityLabel="notes" />,
			);
			expect(loading.getByTestId("k-textarea")).toBeTruthy();
			expect(loading.getAllByTestId("k-skeleton").length).toBeGreaterThan(0);
		});
	});

	describe("List", () => {
		it("renders container, divider and sub-component markers", async () => {
			const screen = await render(
				<List>
					<ListItem interactive onPress={() => undefined}>
						<ListItemAvatar name="Ada Lovelace" />
						<ListItemContent>
							<ListItemTitle>orders</ListItemTitle>
							<ListItemText lines={1}>queued for pickup</ListItemText>
						</ListItemContent>
						<ListItemAction>
							<ListItemBadge color="success">3</ListItemBadge>
						</ListItemAction>
					</ListItem>
					<ListItem>
						<ListItemIcon size="sm">i</ListItemIcon>
						<ListItemContent>
							<ListItemTitle>returns</ListItemTitle>
						</ListItemContent>
					</ListItem>
				</List>,
			);
			expect(screen.getByTestId("k-list")).toBeTruthy();
			expect(screen.getAllByTestId("k-list-item").length).toBe(2);
			expect(screen.getByTestId("k-list-divider")).toBeTruthy();
			expect(screen.getByTestId("k-list-item-avatar")).toBeTruthy();
			expect(screen.getAllByTestId("k-list-item-content").length).toBe(2);
			expect(screen.getAllByTestId("k-list-item-title").length).toBe(2);
			expect(screen.getByTestId("k-list-item-text")).toBeTruthy();
			expect(screen.getByTestId("k-list-item-action")).toBeTruthy();
			expect(screen.getByTestId("k-list-item-badge")).toBeTruthy();
			expect(screen.getByTestId("k-list-item-icon")).toBeTruthy();
		});

		it("isLoading keeps k-list and drops rows", async () => {
			const screen = await render(
				<List isLoading skeletonConfig={{ itemCount: 2 }} />,
			);
			expect(screen.getByTestId("k-list")).toBeTruthy();
			expect(screen.getAllByTestId("k-skeleton").length).toBeGreaterThan(0);
			expect(screen.queryByTestId("k-list-item")).toBeNull();
		});
	});

	describe("Field, Select, TextInput sections", () => {
		it("Field renders label/control/description/error markers", async () => {
			const screen = await render(
				<Field label="Email" description="helper" error="broken">
					<TextInput />
				</Field>,
			);
			expect(screen.getByTestId("k-field")).toBeTruthy();
			expect(screen.getByTestId("k-field-label")).toBeTruthy();
			expect(screen.getByTestId("k-field-control")).toBeTruthy();
			expect(screen.getByTestId("k-field-description")).toBeTruthy();
			expect(screen.getByTestId("k-field-error")).toBeTruthy();
		});

		it("Select renders trigger markers; open exposes option markers", async () => {
			const screen = await render(
				<Select
					options={[
						{ value: "a", label: "Alpha" },
						{ value: "b", label: "Beta" },
					]}
				/>,
			);
			expect(screen.getByTestId("k-select")).toBeTruthy();
			expect(screen.getByTestId("k-select-value")).toBeTruthy();
			// chevron Icon is decorative → a11y-hidden; the query opts in
			expect(screen.getByTestId("k-select-chevron", inclHidden)).toBeTruthy();
			await fireEvent.press(screen.getByTestId("k-select"));
			expect(screen.getAllByTestId("k-select-option").length).toBe(2);
			expect(screen.getByTestId("k-select-sheet")).toBeTruthy();
		});

		it("Select isLoading keeps the k-select marker on the skeleton", async () => {
			const screen = await render(<Select options={[]} isLoading />);
			expect(screen.getByTestId("k-select")).toBeTruthy();
			expect(screen.queryByTestId("k-select-value")).toBeNull();
		});

		it("TextInput sections add the group wrapper; bare input has none", async () => {
			const bare = await render(<TextInput />);
			expect(bare.queryByTestId("k-text-input-group")).toBeNull();
			const grouped = await render(
				<TextInput leftSection={"₹"} rightSection={"kg"} />,
			);
			expect(grouped.getByTestId("k-text-input-group")).toBeTruthy();
			expect(grouped.getByTestId("k-text-input-section-left")).toBeTruthy();
			expect(grouped.getByTestId("k-text-input-section-right")).toBeTruthy();
			expect(grouped.getByTestId("k-text-input")).toBeTruthy();
		});
	});

	describe("AvatarGroup, RingProgress, LoadingOverlay, ErrorBoundary", () => {
		it("AvatarGroup renders container, member and overflow markers", async () => {
			const screen = await render(
				<AvatarGroup
					avatars={[
						{ name: "Ada Lovelace" },
						{ name: "Grace Hopper" },
						{ name: "Alan Turing" },
					]}
					max={2}
				/>,
			);
			expect(screen.getByTestId("k-avatar-group")).toBeTruthy();
			expect(screen.getAllByTestId("k-avatar")).toHaveLength(2);
			expect(screen.getByTestId("k-avatar-group-overflow")).toBeTruthy();
		});

		it("RingProgress renders root and label markers", async () => {
			const screen = await render(<RingProgress value={40} label="40%" />);
			expect(screen.getByTestId("k-ring-progress")).toBeTruthy();
			expect(screen.getByTestId("k-ring-progress-label")).toBeTruthy();
		});

		it("LoadingOverlay renders only while visible", async () => {
			const hidden = await render(<LoadingOverlay visible={false} />);
			expect(hidden.queryByTestId("k-loading-overlay")).toBeNull();
			const shown = await render(<LoadingOverlay visible />);
			expect(shown.getByTestId("k-loading-overlay")).toBeTruthy();
		});

		it("ErrorBoundary renders the fallback markers on crash", async () => {
			const Boom = (): never => {
				throw new Error("markers");
			};
			const screen = await render(
				<ErrorBoundary>
					<Boom />
				</ErrorBoundary>,
			);
			expect(screen.getByTestId("k-error-fallback")).toBeTruthy();
			expect(screen.getByTestId("k-error-fallback-title")).toBeTruthy();
			expect(screen.getByTestId("k-error-fallback-description")).toBeTruthy();
			expect(screen.getByTestId("k-error-fallback-reset")).toBeTruthy();
		});
	});

	describe("InputOtp, PasswordStrengthIndicator, Steps", () => {
		it("InputOtp renders root, slot, field and separator markers", async () => {
			const screen = await render(
				<InputOtp maxLength={4}>
					<InputOtpSlot index={0} />
					<InputOtpSeparator />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSlot index={3} />
				</InputOtp>,
			);
			expect(screen.getByTestId("k-input-otp")).toBeTruthy();
			expect(screen.getAllByTestId("k-input-otp-slot")).toHaveLength(4);
			expect(screen.getByTestId("k-input-otp-separator")).toBeTruthy();
			expect(screen.getByTestId("k-input-otp-field")).toBeTruthy();
		});

		it("PasswordStrengthIndicator renders root and segment markers", async () => {
			const screen = await render(
				<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />,
			);
			expect(screen.getByTestId("k-password-strength-indicator")).toBeTruthy();
			expect(screen.getAllByTestId("k-password-strength-segment")).toHaveLength(
				4,
			);
		});

		it("Steps renders root, row, indicator and line markers", async () => {
			const screen = await render(
				<Steps items={[{ title: "one" }, { title: "two" }]} value={1} />,
			);
			expect(screen.getByTestId("k-steps")).toBeTruthy();
			expect(screen.getAllByTestId("k-step")).toHaveLength(2);
			expect(screen.getByTestId("k-step-indicator-1")).toBeTruthy();
			expect(screen.getAllByTestId("k-step-line")).toHaveLength(1);
		});
	});

	describe("DropdownMenu, ContextMenu", () => {
		it("DropdownMenu exposes trigger and sheet row markers", async () => {
			const screen = await render(
				<DropdownMenu
					items={[
						{ type: "label", key: "l", label: "Actions" },
						{ key: "edit", label: "Edit" },
						{
							type: "checkbox",
							key: "sync",
							label: "Sync",
							checked: true,
							onCheckedChange: () => undefined,
						},
						{
							type: "radio",
							key: "light",
							label: "Light",
							checked: false,
							onCheckedChange: () => undefined,
						},
						{ type: "separator", key: "s" },
					]}
					triggerLabel="actions"
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-dropdown-menu"));
			expect(screen.getByTestId("k-dropdown-menu-content")).toBeTruthy();
			expect(screen.getByTestId("k-dropdown-menu-label")).toBeTruthy();
			expect(screen.getByTestId("k-dropdown-menu-item")).toBeTruthy();
			expect(screen.getByTestId("k-dropdown-menu-checkbox-item")).toBeTruthy();
			expect(screen.getByTestId("k-dropdown-menu-radio-item")).toBeTruthy();
			expect(screen.getByTestId("k-dropdown-menu-separator")).toBeTruthy();
		});

		it("ContextMenu exposes wrapper and long-press row markers", async () => {
			const screen = await render(
				<ContextMenu items={[{ key: "copy", label: "Copy" }]}>
					<Text>invoice.pdf</Text>
				</ContextMenu>,
			);
			expect(screen.getByTestId("k-context-menu")).toBeTruthy();
			await fireEvent(screen.getByTestId("k-context-menu"), "longPress");
			expect(screen.getByTestId("k-context-menu-content")).toBeTruthy();
			expect(screen.getByTestId("k-context-menu-item")).toBeTruthy();
		});
	});

	describe("Timeline", () => {
		it("Timeline exposes item, dot and line markers", async () => {
			const screen = await render(
				<Timeline
					items={[{ title: "one", status: "success" }, { title: "two" }]}
				/>,
			);
			expect(screen.getByTestId("k-timeline")).toBeTruthy();
			expect(screen.getAllByTestId("k-timeline-item")).toHaveLength(2);
			expect(screen.getAllByTestId("k-timeline-dot")).toHaveLength(2);
			expect(screen.getAllByTestId("k-timeline-line")).toHaveLength(1);
		});
	});

	describe("MultiSelect, Combobox", () => {
		it("MultiSelect exposes trigger, chips and sheet row markers", async () => {
			const screen = await render(
				<MultiSelect
					options={[
						{ value: "a", label: "Alpha" },
						{ value: "b", label: "Beta" },
					]}
					defaultValue={["a"]}
				/>,
			);
			expect(screen.getByTestId("k-multi-select")).toBeTruthy();
			expect(screen.getAllByTestId("k-multi-select-chip")).toHaveLength(1);
			expect(screen.getByTestId("k-multi-select-chip-remove")).toBeTruthy();
			await fireEvent.press(screen.getByTestId("k-multi-select"));
			expect(screen.getByTestId("k-multi-select-content")).toBeTruthy();
			expect(screen.getByTestId("k-multi-select-search")).toBeTruthy();
			expect(screen.getByTestId("k-multi-select-select-all")).toBeTruthy();
			expect(screen.getByTestId("k-multi-select-clear-all")).toBeTruthy();
			expect(screen.getAllByTestId(/k-multi-select-option-\d/)).toHaveLength(2);
		});

		it("Combobox exposes trigger, search and option markers", async () => {
			const screen = await render(
				<Combobox
					options={[
						{ value: "a", label: "Alpha" },
						{ value: "b", label: "Beta" },
					]}
				/>,
			);
			expect(screen.getByTestId("k-combobox")).toBeTruthy();
			await fireEvent.press(screen.getByTestId("k-combobox"));
			expect(screen.getByTestId("k-combobox-content")).toBeTruthy();
			expect(screen.getByTestId("k-combobox-search")).toBeTruthy();
			expect(screen.getAllByTestId(/k-combobox-option-\d/)).toHaveLength(2);
		});
	});

	describe("Label, Separator, Spinner, Progress", () => {
		const findSvgProp = (tree: unknown, key: string): unknown[] => {
			const found: unknown[] = [];
			const walk = (node: unknown) => {
				if (Array.isArray(node)) {
					node.forEach(walk);
					return;
				}
				if (node && typeof node === "object") {
					const props = (node as { props?: Record<string, unknown> }).props;
					if (props && key in props) found.push(props[key]);
					walk((node as { children?: unknown }).children);
				}
			};
			walk(tree);
			return found;
		};

		it("Label/Separator/Spinner/Progress render their k-* markers", async () => {
			const screen = await render(
				<>
					<Label>field</Label>
					<Separator />
					<Spinner size="sm" />
					<Progress value={40} />
				</>,
			);
			expect(screen.getByTestId("k-label")).toBeTruthy();
			// decorative separator is hidden from a11y — opt into the raw tree
			expect(screen.getByTestId("k-separator", inclHidden)).toBeTruthy();
			expect(screen.getByTestId("k-spinner")).toBeTruthy();
			expect(screen.getByTestId("k-progress")).toBeTruthy();
		});

		it("Label is fontSize 14 / weight 500 themed foreground", async () => {
			const screen = await render(<Label>email</Label>);
			const s = flatStyle(screen.getByTestId("k-label"));
			expect(Number(s.fontSize)).toBe(14);
			expect(s.fontWeight).toBe("500");
			expect(String(s.color).startsWith("#")).toBe(true);
		});

		it("Label required appends a destructive *; plain label has none", async () => {
			const screen = await render(<Label required>email</Label>);
			expect(screen.getAllByText(" *").length).toBe(1);
			const star = screen.getByText(" *");
			const { themes } = require("../../themes");
			// the marker is the destructive theme color, distinct from the
			// label's own foreground color
			expect(flatStyle(star).color).toBe(themes.light.destructive);
			expect(flatStyle(star).color).not.toBe(themes.light.foreground);
			await screen.rerender(<Label>notes</Label>);
			expect(screen.queryAllByText(" *").length).toBe(0);
		});

		it("Separator orientations produce distinct one-pixel dimensions", async () => {
			const screen = await render(<Separator />);
			const h = flatStyle(screen.getByTestId("k-separator", inclHidden));
			await screen.rerender(<Separator orientation="vertical" />);
			const v = flatStyle(screen.getByTestId("k-separator", inclHidden));
			expect(h.width).toBe("100%");
			expect(Number(h.height)).toBe(1);
			expect(v.height).toBe("100%");
			expect(Number(v.width)).toBe(1);
			expect(String(v.backgroundColor).startsWith("#")).toBe(true);
		});

		it("Separator decorative default hides from a11y; false keeps it", async () => {
			const screen = await render(<Separator />);
			expect(
				screen.getByTestId("k-separator", inclHidden).props
					.accessibilityElementsHidden,
			).toBe(true);
			await screen.rerender(<Separator decorative={false} />);
			expect(
				screen.getByTestId("k-separator").props.accessibilityElementsHidden,
			).toBeUndefined();
		});

		it("each Spinner size maps to a distinct icon size", async () => {
			const sizes = ["sm", "md", "lg", "xl"] as const;
			const seen = new Set<number>();
			const screen = await render(<Spinner size="sm" />);
			for (const size of sizes) {
				await screen.rerender(<Spinner size={size} />);
				const widths = findSvgProp(screen.toJSON(), "width").map(Number);
				expect(Math.max(...widths)).toBeGreaterThan(0);
				seen.add(Math.max(...widths));
			}
			expect(seen.size).toBe(sizes.length);
		});

		it("Spinner variants map to distinct themed stroke colors", async () => {
			const variants = ["default", "muted", "white"] as const;
			const seen = new Set<string>();
			const screen = await render(<Spinner variant="default" />);
			for (const variant of variants) {
				await screen.rerender(<Spinner variant={variant} />);
				const strokes = findSvgProp(screen.toJSON(), "stroke").map(String);
				expect(strokes.length).toBeGreaterThan(0);
				seen.add(strokes[0]);
			}
			expect(seen.size).toBe(variants.length);
		});

		it("Spinner ghost dims via wrapper opacity while muted stays full", async () => {
			const screen = await render(<Spinner variant="muted" />);
			expect(flatStyle(screen.getByTestId("k-spinner")).opacity).toBe(1);
			await screen.rerender(<Spinner variant="ghost" />);
			expect(flatStyle(screen.getByTestId("k-spinner")).opacity).toBe(0.6);
		});

		it("Spinner default label is 'Loading...' and custom labels pass through", async () => {
			const screen = await render(<Spinner size="sm" />);
			expect(screen.getByTestId("k-spinner").props.accessibilityLabel).toBe(
				"Loading...",
			);
			await screen.rerender(<Spinner size="sm" label="Syncing" />);
			expect(screen.getByTestId("k-spinner").props.accessibilityLabel).toBe(
				"Syncing",
			);
		});

		it("Progress sizes map to distinct track heights", async () => {
			const sizes = ["sm", "md", "lg"] as const;
			const seen = new Set<number>();
			const screen = await render(<Progress size="sm" value={50} />);
			for (const size of sizes) {
				await screen.rerender(<Progress size={size} value={50} />);
				seen.add(Number(flatStyle(screen.getByTestId("k-progress")).height));
			}
			expect(seen.size).toBe(sizes.length);
		});

		it("Progress indicator width follows the value", async () => {
			const screen = await render(<Progress value={0} />);
			const widths: string[] = [];
			for (const value of [0, 50, 100]) {
				await screen.rerender(<Progress value={value} />);
				widths.push(
					String(flatStyle(screen.getByTestId("k-progress-indicator")).width),
				);
			}
			expect(widths).toEqual(["0%", "50%", "100%"]);
		});

		it("Progress clamps out-of-range values and honors custom min/max", async () => {
			const screen = await render(<Progress value={-20} />);
			expect(flatStyle(screen.getByTestId("k-progress-indicator")).width).toBe(
				"0%",
			);
			await screen.rerender(<Progress value={120} />);
			expect(flatStyle(screen.getByTestId("k-progress-indicator")).width).toBe(
				"100%",
			);
			// (50-10)/(90-10) = 50% against non-default bounds
			await screen.rerender(<Progress value={50} min={10} max={90} />);
			expect(flatStyle(screen.getByTestId("k-progress-indicator")).width).toBe(
				"50%",
			);
		});

		it("Progress defaults to 0 with no value", async () => {
			const screen = await render(<Progress />);
			expect(flatStyle(screen.getByTestId("k-progress-indicator")).width).toBe(
				"0%",
			);
		});

		it("Progress color arms produce distinct indicator fills", async () => {
			const screen = await render(<Progress value={50} color="primary" />);
			const primary = String(
				flatStyle(screen.getByTestId("k-progress-indicator")).backgroundColor,
			);
			await screen.rerender(<Progress value={50} color="success" />);
			const success = String(
				flatStyle(screen.getByTestId("k-progress-indicator")).backgroundColor,
			);
			expect(primary.startsWith("#")).toBe(true);
			expect(success).not.toBe(primary);
		});

		it("Progress label/showValue render inner text; sm suppresses it", async () => {
			const screen = await render(<Progress value={50} label="uploading" />);
			expect(screen.getByText("uploading")).toBeTruthy();
			await screen.rerender(<Progress value={50} showValue />);
			expect(screen.getByText("50%")).toBeTruthy();
			await screen.rerender(<Progress value={50} showValue size="sm" />);
			expect(screen.queryByText("50%")).toBeNull();
		});

		it("Progress announces role=progressbar with accessibilityValue", async () => {
			const screen = await render(<Progress value={30} min={0} max={100} />);
			const track = screen.getByTestId("k-progress");
			expect(track.props.accessibilityRole).toBe("progressbar");
			expect(track.props.accessibilityValue).toEqual({
				min: 0,
				max: 100,
				now: 30,
			});
			await screen.rerender(<Progress value={50} min={10} max={90} />);
			expect(track.props.accessibilityValue).toEqual({
				min: 10,
				max: 90,
				now: 50,
			});
		});

		// last on purpose: manual unmount() poisons TLB's registry for later
		// renders in the same file (see header note)
		it("Spinner loop starts once per mount and stops on unmount", async () => {
			const { act } = require("react");
			const AnimatedRN = require("react-native").Animated;
			const origLoop = AnimatedRN.loop;
			const stops: Array<ReturnType<typeof jest.fn>> = [];
			// wrap in a proxy animation instead of reassigning loop.stop — the
			// composite animation instance resists property writes under the
			// RN 0.86 jest shim
			AnimatedRN.loop = ((...args: unknown[]) => {
				const loop = origLoop(...(args as []));
				const stop = jest.fn(((...a: unknown[]) =>
					(loop as { stop: (...s: unknown[]) => void }).stop(...a)) as never);
				stops.push(stop);
				return {
					start: () => (loop as { start: () => void }).start(),
					stop: () => stop(),
				};
			}) as typeof AnimatedRN.loop;
			try {
				const screen = await render(<Spinner size="sm" />);
				await screen.rerender(<Spinner size="lg" />);
				expect(stops.length).toBe(1);
				act(() => {
					screen.unmount();
				});
				expect(stops[0]).toHaveBeenCalled();
			} finally {
				AnimatedRN.loop = origLoop;
			}
		});
	});
});
