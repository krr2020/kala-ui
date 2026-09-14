/**
 * Marker convention: every kala-ui native component exposes a stable
 * `k-*` testID root so E2E (Maestro) and app debugging stay deterministic.
 * When adding a component, add its marker here — a missing marker is a
 * contract break, not a style issue.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { motion } from "../../tokens";
import { Avatar } from "../avatar";
import { Badge } from "../badge";
import { BUTTON_SPRING, Button } from "../button";
import { Checkbox } from "../checkbox";
import { Switch } from "../switch";
import { Card } from "../card";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Sheet } from "../sheet";
import { Text } from "../text";
import { TextInput } from "../text-input";

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
		const badgeSig = (node: {
			props: { style?: unknown };
		}) => {
			const s = flatStyle(node);
			return JSON.stringify([s.backgroundColor, s.color, s.borderColor]);
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
			const screen = await render(
				<Badge shape="rounded">new</Badge>,
			);
			const rounded = Number(flatStyle(screen.getByTestId("k-badge")).borderRadius);
			await screen.rerender(<Badge shape="pill">new</Badge>);
			const pill = Number(flatStyle(screen.getByTestId("k-badge")).borderRadius);
			expect(rounded).toBeGreaterThan(0);
			expect(pill).not.toBe(rounded);
			const child = screen.getByTestId("k-badge")
				.children[0] as { props: { style?: unknown } };
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
			const screen = await render(
				<Avatar name="A" shape="circle" />,
			);
			for (const shape of shapes) {
				await screen.rerender(<Avatar name="A" shape={shape} />);
				seen.add(Number(flatStyle(screen.getByTestId("k-avatar")).borderRadius));
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

		it("Avatar without source renders uppercase initials on a themed bg", async () => {
			const screen = await render(<Avatar name="ada lovelace" />);
			expect(screen.getByText("AL")).toBeTruthy();
			const s = flatStyle(screen.getByTestId("k-avatar-fallback"));
			expect(String(s.backgroundColor).startsWith("#")).toBe(true);
			expect(String(s.color).startsWith("#")).toBe(true);
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
			expect(
				screen.getByTestId("k-checkbox-box").children?.length ?? 0,
			).toBe(0);

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

		it("Switch track color and thumb offset differ per state", async () => {
			const screen = await render(<Switch accessibilityLabel="s" value={false} />);
			const offTrack = String(
				flatStyle(screen.getByTestId("k-switch-track")).backgroundColor,
			);
		const offThumb = flatStyle(screen.getByTestId("k-switch-thumb")).transform as unknown as Array<Record<string, number>>;

			await screen.rerender(<Switch accessibilityLabel="s" value />);
			const onTrack = String(
				flatStyle(screen.getByTestId("k-switch-track")).backgroundColor,
			);
		const onThumb = flatStyle(screen.getByTestId("k-switch-thumb")).transform as unknown as Array<Record<string, number>>;

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
});
