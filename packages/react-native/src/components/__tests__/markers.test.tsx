/**
 * Marker convention: every kala-ui native component exposes a stable
 * `k-*` testID root so E2E (Maestro) and app debugging stay deterministic.
 * When adding a component, add its marker here — a missing marker is a
 * contract break, not a style issue.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { motion } from "../../tokens";
import { BUTTON_SPRING, Button } from "../button/button";
import { Icon } from "../icon/icon";
import { Sheet } from "../sheet/sheet";

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
});
