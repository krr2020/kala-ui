import { fireEvent, render } from "@testing-library/react-native";
import { Linking, Text } from "react-native";
import { Badge } from "../badge";
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

type Screen = Awaited<ReturnType<typeof render>>;

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry) {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

function tree(node: unknown): Record<string, unknown> {
	return (node as { props: Record<string, unknown> }).props;
}

function node(screen: Screen, testID: string): never {
	return screen.getByTestId(testID) as never;
}

describe("List container", () => {
	it("renders the k-list marker on a themed card surface", async () => {
		const screen = await render(<List />);
		const el = node(screen, "k-list");
		const s = flatStyle(el);
		expect(s.backgroundColor).toBeTruthy();
		expect(s.borderRadius).toBeGreaterThan(0);
		expect(s.borderWidth).toBe(1);
		expect(tree(el).accessibilityRole).toBe("list");
	});

	it("divided (default) draws N-1 separators; divided=false and single child draw none", async () => {
		const two = await render(
			<List>
				<ListItem>a</ListItem>
				<ListItem>b</ListItem>
			</List>,
		);
		expect(two.getAllByTestId("k-list-divider").length).toBe(1);

		const one = await render(
			<List>
				<ListItem>a</ListItem>
			</List>,
		);
		expect(one.queryByTestId("k-list-divider")).toBeNull();

		const off = await render(
			<List divided={false}>
				<ListItem>a</ListItem>
				<ListItem>b</ListItem>
			</List>,
		);
		expect(off.queryByTestId("k-list-divider")).toBeNull();
	});

	it("divided × dense: separators stay 1px full-bleed while rows halve padding", async () => {
		const screen = await render(
			<List dense>
				<ListItem>a</ListItem>
				<ListItem>b</ListItem>
			</List>,
		);
		const ds = flatStyle(node(screen, "k-list-divider"));
		expect(ds.height).toBe(1);
		expect(ds.alignSelf).toBe("stretch");
		expect(screen.getAllByTestId("k-list-item").length).toBe(2);
	});

	it("dense halves row padding", async () => {
		const regular = await render(<ListItem>a</ListItem>);
		const dense = await render(<ListItem dense>a</ListItem>);
		const r = flatStyle(node(regular, "k-list-item"));
		const d = flatStyle(node(dense, "k-list-item"));
		expect(Number(d.paddingVertical)).toBeLessThan(Number(r.paddingVertical));
	});
});

describe("ListItem interaction arms", () => {
	it("interactive: pressable button that fires onPress", async () => {
		const onPress = jest.fn();
		const screen = await render(
			<ListItem interactive onPress={onPress}>
				row
			</ListItem>,
		);
		const el = node(screen, "k-list-item");
		expect(tree(el).accessibilityRole).toBe("button");
		await fireEvent.press(el);
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("href: link role that opens the url", async () => {
		const openURL = jest.fn();
		jest.spyOn(Linking, "openURL").mockImplementation(openURL);
		const screen = await render(<ListItem href="https://example.com">row</ListItem>);
		const el = node(screen, "k-list-item");
		expect(tree(el).accessibilityRole).toBe("link");
		await fireEvent.press(el);
		expect(openURL).toHaveBeenCalledWith("https://example.com");
	});

	it("static row renders no handler", async () => {
		const screen = await render(<ListItem>row</ListItem>);
		const el = node(screen, "k-list-item");
		expect(tree(el).onPress).toBeUndefined();
		expect(tree(el).accessibilityRole).toBeUndefined();
	});
});

describe("ListItem state arms", () => {
	it("active tints the row background with primary", async () => {
		const screen = await render(<ListItem active>row</ListItem>);
		const s = flatStyle(node(screen, "k-list-item"));
		expect(String(s.backgroundColor)).toMatch(/A$/);
	});

	it("disabled dims to 0.5, blocks press, announces disabled", async () => {
		const onPress = jest.fn();
		const screen = await render(
			<ListItem interactive disabled onPress={onPress}>
				row
			</ListItem>,
		);
		const el = node(screen, "k-list-item");
		const s = flatStyle(el);
		s;
		expect(s.opacity).toBe(0.5);
		expect(
			(tree(el).accessibilityState as { disabled?: boolean }).disabled,
		).toBe(true);
		await fireEvent.press(el);
		expect(onPress).not.toHaveBeenCalled();
	});

	it("active + disabled combines tint and opacity", async () => {
		const screen = await render(
			<ListItem active disabled>
				row
			</ListItem>,
		);
		const s = flatStyle(node(screen, "k-list-item"));
		expect(String(s.backgroundColor)).toMatch(/A$/);
		expect(s.opacity).toBe(0.5);
	});
});

describe("List sub-components", () => {
	it("ListItemIcon maps sm/md/lg sizes", async () => {
		const sizes = [16, 20, 24];
		for (const [i, size] of ["sm", "md", "lg"].entries()) {
			const screen = await render(
				<ListItemIcon size={size as "sm" | "md" | "lg"} />,
			);
			const s = flatStyle(node(screen, "k-list-item-icon"));
			expect(Number(s.width)).toBe(sizes[i]);
		}
	});

	it("ListItemAvatar falls back to initials when the image errors", async () => {
		const screen = await render(
			<ListItemAvatar source={{ uri: "https://x/y.png" }} name="Ada Lovelace" />,
		);
		expect(screen.getByTestId("k-list-item-avatar")).toBeTruthy();
		await fireEvent(node(screen, "k-list-item-avatar-image"), "error");
		expect(screen.getByText("AL")).toBeTruthy();
	});

	it("ListItemContent flexes to fill the row", async () => {
		const screen = await render(<ListItemContent />);
		const s = flatStyle(node(screen, "k-list-item-content"));
		expect(s.flex).toBe(1);
	});

	it("ListItemTitle uses foreground at 14 medium", async () => {
		const screen = await render(<ListItemTitle>title</ListItemTitle>);
		const s = flatStyle(node(screen, "k-list-item-title"));
		expect(s.fontSize).toBe(14);
		expect(s.fontWeight).toBe("500");
		expect(s.color).toBeTruthy();
	});

	it("ListItemText clamps lines and defaults to muted", async () => {
		const screen = await render(<ListItemText lines={2}>body</ListItemText>);
		const el = node(screen, "k-list-item-text");
		expect(tree(el).numberOfLines).toBe(2);
		expect(flatStyle(el).color).toBeTruthy();
		const trunc = await render(<ListItemText truncate>body</ListItemText>);
		expect(tree(node(trunc, "k-list-item-text")).numberOfLines).toBe(1);
	});

	it("ListItemAction and ListItemBadge render their markers (badge delegates to Badge)", async () => {
		const action = await render(
			<ListItemAction>
				<Badge>new</Badge>
			</ListItemAction>,
		);
		expect(action.getByTestId("k-list-item-action")).toBeTruthy();

		const badge = await render(<ListItemBadge color="success">3</ListItemBadge>);
		expect(badge.getByTestId("k-list-item-badge")).toBeTruthy();
		expect(badge.getByText("3")).toBeTruthy();
	});
});

describe("List loading arm", () => {
	it("isLoading renders skeleton rows for each variant with itemCount", async () => {
		const variants = [
			"simple",
			"withAvatar",
			"withIcon",
			"withBadge",
			"multiLine",
		] as const;
		for (const variant of variants) {
			const screen = await render(
				<List isLoading skeletonConfig={{ variant, itemCount: 2 }} />,
			);
			expect(screen.getByTestId("k-list")).toBeTruthy();
			expect(screen.getAllByTestId("k-skeleton").length).toBeGreaterThan(0);
		}
	});

	it("isLoading honors dense and the custom skeleton override keeps k-list", async () => {
		const dense = await render(
			<List isLoading dense skeletonConfig={{ itemCount: 1 }} />,
		);
		expect(dense.getAllByTestId("k-skeleton").length).toBeGreaterThan(0);

		const custom = await render(
			<List isLoading skeleton={<Text>custom</Text>} />,
		);
		expect(custom.getByTestId("k-list")).toBeTruthy();
		expect(custom.getByText("custom")).toBeTruthy();
	});
});

describe("List slot styles", () => {
	it("styles.root wins over style on List and ListItem", async () => {
		const list = await render(
			<List style={{ borderWidth: 1 }} styles={{ root: { borderWidth: 7 } }} />,
		);
		expect(flatStyle(node(list, "k-list")).borderWidth).toBe(7);

		const item = await render(
			<ListItem
				style={{ borderWidth: 1 }}
				styles={{ root: { borderWidth: 7 } }}
			/>,
		);
		expect(flatStyle(node(item, "k-list-item")).borderWidth).toBe(7);
	});
});
