/**
 * Marker convention: every kala-ui native component exposes a stable
 * `k-*` testID root so E2E (Maestro) and app debugging stay deterministic.
 * When adding a component, add its marker here — a missing marker is a
 * contract break, not a style issue.
 */
import { act, fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { motion } from "../../tokens";
import { Alert } from "../alert";
import { Avatar, STATUS_ONLINE_HUE } from "../avatar";
import { Badge } from "../badge";
import { BUTTON_SPRING, Button } from "../button";
import { Checkbox } from "../checkbox";
import { Switch } from "../switch";
import { Card } from "../card";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Label } from "../label";
import { Progress } from "../progress";
import { RadioGroup } from "../radio-group";
import { Separator } from "../separator";
import { Sheet } from "../sheet";
import { Skeleton } from "../skeleton";
import { EmptyState } from "../empty-state";
import { SegmentedControl } from "../segmented-control";
import { Pagination } from "../pagination";
import { Rating } from "../rating";
import { Slider } from "../slider";
import { Tag } from "../tag";
import { Tabs } from "../tabs";
import { Spinner } from "../spinner";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Toast } from "../toast";

const pkg = require("../../../package.json");

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

	describe("behavior contract", () => {
		it("pressed state uses the motion.spring.snappy config", () => {
			expect(BUTTON_SPRING).toEqual(motion.spring.snappy);
		});

		it("enforces the 44dp touch floor on every size", async () => {
			const screen = await render(<Button size="xs">Go</Button>);
			for (const size of ["xs", "sm", "md", "lg", "icon"] as const) {
				await screen.rerender(<Button size={size}>Go</Button>);
				const s = flatStyle(screen.getByTestId("k-button-root"));
				expect(Number(s.minHeight)).toBeGreaterThanOrEqual(44);
				expect(Number(s.minWidth)).toBeGreaterThanOrEqual(44);
			}
		});

		it("each variant arm produces a distinct style", async () => {
			const seen = new Map<string, string>();
			const screen = await render(<Button variant="solid">Go</Button>);
			for (const variant of [
				"solid",
				"outline",
				"ghost",
				"subtle",
				"link",
			] as const) {
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

	describe("wave 2: Text, Heading, TextInput, Card", () => {
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
	});

	describe("wave 3: Badge, Avatar, Checkbox, Switch", () => {
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
				seen.add(
					Number(flatStyle(screen.getByTestId("k-avatar")).borderRadius),
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

		it("online dot uses the fixed transcribed hue (dark themes define no success)", async () => {
			const screen = await render(<Avatar name="A" status="online" />);
			const dot = flatStyle(screen.getByTestId("k-avatar-status"));
			expect(String(dot.backgroundColor)).toBe(STATUS_ONLINE_HUE);
			expect(String(dot.borderColor).startsWith("#")).toBe(true);
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

	// waves 5, 6 and 7 sit before wave 4 in file order on purpose: wave 4's
	// spinner test manually unmounts, which poisons TLB's registry for later
	// renders in the same file.
	describe("wave 6: Tabs, SegmentedControl, EmptyState, Tag", () => {
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

	describe("wave 5: Skeleton, RadioGroup, Alert, Toast", () => {
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

	describe("wave 7: Rating, Pagination", () => {
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

		it("Pagination renders numbered pages with distinct ellipsis markers", async () => {
			const screen = await render(
				<Pagination total={20} page={10} onPageChange={() => undefined} />,
			);
			expect(
				screen
					.getAllByTestId("k-pagination-page")
					.map((n) => n.props.accessibilityLabel),
			).toEqual(["1", "9", "10", "11", "20"]);
			expect(
				screen.getAllByTestId("k-pagination-ellipsis", inclHidden),
			).toHaveLength(2);
			await screen.rerender(<Pagination total={5} page={1} />);
			expect(
				screen
					.getAllByTestId("k-pagination-page")
					.map((n) => n.props.accessibilityLabel),
			).toEqual(["1", "2", "3", "4", "5"]);
			expect(
				screen.queryByTestId("k-pagination-ellipsis", inclHidden),
			).toBeNull();
		});

		it("Pagination total=0 renders no pages; total=1 exactly one", async () => {
			const screen = await render(<Pagination total={0} />);
			expect(screen.queryByTestId("k-pagination-page")).toBeNull();
			await screen.rerender(<Pagination total={1} />);
			expect(screen.getAllByTestId("k-pagination-page")).toHaveLength(1);
		});

		it("out-of-range page clamps into range", async () => {
			const screen = await render(<Pagination total={5} page={99} />);
			const selected = screen
				.getAllByTestId("k-pagination-page")
				.find((n) => n.props.accessibilityState?.selected);
			expect(selected?.props.accessibilityLabel).toBe("5");
		});

		it("next/previous navigate and never leave the bounds", async () => {
			const onPageChange = jest.fn();
			const screen = await render(
				<Pagination total={3} defaultPage={2} onPageChange={onPageChange} />,
			);
			await fireEvent.press(screen.getByTestId("k-pagination-next"));
			expect(onPageChange).toHaveBeenLastCalledWith(3);
			// the next control disabled at the last page blocks further presses
			expect(
				screen.getByTestId("k-pagination-next").props.accessibilityState
					?.disabled,
			).toBe(true);
			await fireEvent.press(screen.getByTestId("k-pagination-next"));
			expect(onPageChange).toHaveBeenCalledTimes(1);
			await fireEvent.press(screen.getByTestId("k-pagination-previous"));
			expect(onPageChange).toHaveBeenLastCalledWith(2);
		});

		it("pressing the current page does not fire onPageChange", async () => {
			const onPageChange = jest.fn();
			const screen = await render(
				<Pagination total={5} page={3} onPageChange={onPageChange} />,
			);
			const current = screen
				.getAllByTestId("k-pagination-page")
				.find((n) => n.props.accessibilityState?.selected);
			await fireEvent.press(current as NonNullable<typeof current>);
			expect(onPageChange).not.toHaveBeenCalled();
		});
	});

	describe("wave 8: Slider", () => {
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

	describe("wave 4: Label, Separator, Spinner, Progress", () => {
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
