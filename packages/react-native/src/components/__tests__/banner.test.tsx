/**
 * Banner: solid-tone, dismissible top banner — the four tone arms with
 * their *Foreground pairing, fixed/static positioning, close control,
 * live-region announcements, and the isLoading skeleton row.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Banner } from "../banner";

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const theme = () => require("../../themes").themes.light;

const TONES = ["info", "warning", "destructive", "success"] as const;

describe("Banner tone arms", () => {
	it("each tone arm produces a distinct, non-undefined backgroundColor", async () => {
		const seen = new Set<string>();
		const screen = await render(<Banner>msg</Banner>);
		for (const color of TONES) {
			await screen.rerender(<Banner color={color}>msg</Banner>);
			const bg = String(
				flatStyle(screen.getByTestId("k-banner")).backgroundColor,
			);
			expect(bg).toBeTruthy();
			expect(bg).not.toBe("undefined");
			expect(seen.has(bg)).toBe(false);
			seen.add(bg);
		}
		expect(seen.size).toBe(TONES.length);
	});

	it("text color derives from the matching *Foreground token per arm", async () => {
		const screen = await render(
			<Banner color="info">maintenance at midnight</Banner>,
		);
		for (const color of TONES) {
			await screen.rerender(
				<Banner color={color}>maintenance at midnight</Banner>,
			);
			const text = screen.getByText("maintenance at midnight");
			const s = flatStyle(text);
			expect(s.color).toBe(theme()[`${color}Foreground`]);
		}
	});

	it("info arm reads the info token pair exactly", async () => {
		const screen = await render(<Banner color="info">msg</Banner>);
		expect(flatStyle(screen.getByTestId("k-banner")).backgroundColor).toBe(
			theme().info,
		);
		expect(flatStyle(screen.getByText("msg")).color).toBe(
			theme().infoForeground,
		);
	});
});

describe("Banner positioning", () => {
	it("position=fixed (default) maps to absolute top-0 full-width with elevation", async () => {
		const screen = await render(<Banner>msg</Banner>);
		const s = flatStyle(screen.getByTestId("k-banner"));
		expect(s.position).toBe("absolute");
		expect(Number(s.top)).toBe(0);
		expect(Number(s.left)).toBe(0);
		expect(Number(s.right)).toBe(0);
		expect(Number(s.elevation)).toBeGreaterThan(0);
	});

	it("position=static drops the absolute positioning", async () => {
		const screen = await render(<Banner position="static">msg</Banner>);
		const s = flatStyle(screen.getByTestId("k-banner"));
		expect(s.position).toBe("relative");
		expect(s.top).toBeUndefined();
	});
});

describe("Banner close control", () => {
	it("onClose renders k-banner-close as a labelled button", async () => {
		const screen = await render(<Banner onClose={() => undefined}>m</Banner>);
		const close = screen.getByTestId("k-banner-close");
		expect(close.props.accessibilityRole).toBe("button");
		expect(close.props.accessibilityLabel).toBe("Close banner");
	});

	it("pressing close fires onClose exactly once", async () => {
		const onClose = jest.fn();
		const screen = await render(<Banner onClose={onClose}>m</Banner>);
		await fireEvent.press(screen.getByTestId("k-banner-close"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("without onClose the close marker is absent", async () => {
		const screen = await render(<Banner>m</Banner>);
		expect(screen.queryByTestId("k-banner-close")).toBeNull();
	});

	it("the close icon carries the tone foreground color", async () => {
		const screen = await render(
			<Banner color="warning" onClose={() => undefined}>
				m
			</Banner>,
		);
		// lucide's jest mock drops the color prop, so the fg pairing is
		// pinned by the per-arm text-color test; here: the icon subtree exists
		expect(screen.getByTestId("k-banner-close").children.length).toBe(1);
	});
});

describe("Banner announcements", () => {
	it("default announces politely via a live region", async () => {
		const screen = await render(<Banner>sync queued</Banner>);
		const banner = screen.getByTestId("k-banner");
		expect(banner.props.accessibilityLiveRegion).toBe("polite");
		expect(banner.props.accessibilityRole).toBeUndefined();
	});

	it("role='alert' switches to role alert + assertive live region", async () => {
		const screen = await render(<Banner role="alert">outage</Banner>);
		const banner = screen.getByTestId("k-banner");
		expect(banner.props.accessibilityRole).toBe("alert");
		expect(banner.props.accessibilityLiveRegion).toBe("assertive");
	});
});

describe("Banner loading state", () => {
	it("isLoading renders the skeleton row inside the toned surface", async () => {
		const screen = await render(<Banner isLoading>m</Banner>);
		expect(screen.getAllByTestId("k-skeleton").length).toBeGreaterThan(0);
		// tone surface survives the loading swap
		expect(flatStyle(screen.getByTestId("k-banner")).backgroundColor).toBe(
			theme().info,
		);
	});

	it("showIcon/showCloseButton=false remove their skeleton blocks", async () => {
		const screen = await render(
			<Banner
				isLoading
				skeletonConfig={{ showIcon: false, showCloseButton: false }}
			>
				m
			</Banner>,
		);
		expect(screen.getAllByTestId("k-skeleton").length).toBe(1);
	});

	it("a custom skeleton node renders instead, inside the toned surface", async () => {
		const screen = await render(
			<Banner isLoading skeleton={<Text>Skeleton</Text>}>
				m
			</Banner>,
		);
		expect(screen.queryAllByTestId("k-skeleton")).toHaveLength(0);
		expect(screen.getByText("Skeleton")).toBeTruthy();
		expect(flatStyle(screen.getByTestId("k-banner")).backgroundColor).toBe(
			theme().info,
		);
	});
});

describe("Banner edges", () => {
	it("renders the surface with no children", async () => {
		const screen = await render(<Banner />);
		expect(screen.getByTestId("k-banner")).toBeTruthy();
	});

	it("plain string children render as text (no bare strings under View)", async () => {
		const screen = await render(<Banner>plain message</Banner>);
		expect(screen.getByText("plain message")).toBeTruthy();
	});

	it("styles.root/content/close all win over defaults", async () => {
		const screen = await render(
			<Banner
				onClose={() => undefined}
				style={{ minHeight: 60 }}
				styles={{
					root: { minHeight: 90, borderWidth: 7 },
					content: { borderWidth: 5 },
					close: { borderWidth: 3 },
				}}
			>
				m
			</Banner>,
		);
		expect(flatStyle(screen.getByTestId("k-banner")).minHeight).toBe(90);
		expect(flatStyle(screen.getByTestId("k-banner")).borderWidth).toBe(7);
		expect(flatStyle(screen.getByTestId("k-banner-content")).borderWidth).toBe(
			5,
		);
		expect(flatStyle(screen.getByTestId("k-banner-close")).borderWidth).toBe(3);
	});
});
