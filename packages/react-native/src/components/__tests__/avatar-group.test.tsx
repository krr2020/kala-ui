import { render } from "@testing-library/react-native";
import { BOX as AVATAR_BOX } from "../avatar/avatar.styles";
import type { AvatarItem } from "../avatar-group";
import { AvatarGroup } from "../avatar-group";

type Screen = Awaited<ReturnType<typeof render>>;

const AVATARS: AvatarItem[] = [
	{ name: "Ada Lovelace" },
	{ name: "Grace Hopper" },
	{ name: "Alan Turing" },
	{ name: "Katherine Johnson" },
	{ name: "Margaret Hamilton" },
	{ name: "Edsger Dijkstra" },
];

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

describe("AvatarGroup", () => {
	it("renders the container marker with each visible avatar reachable", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS.slice(0, 3)} />,
		);
		expect(screen.getByTestId("k-avatar-group")).toBeTruthy();
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(3);
		expect(screen.queryByTestId("k-avatar-group-overflow")).toBeNull();
	});

	it("slices to max and renders the +N overflow chip", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS} max={4} />,
		);
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(4);
		expect(screen.getByText(`+${AVATARS.length - 4}`)).toBeTruthy();
		expect(screen.getByTestId("k-avatar-group-overflow")).toBeTruthy();
	});

	it("max undefined defaults to 4", async () => {
		const screen: Screen = await render(<AvatarGroup avatars={AVATARS} />);
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(4);
		expect(screen.getByText("+2")).toBeTruthy();
	});

	it("max >= avatars.length renders all with no chip", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS} max={10} />,
		);
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(AVATARS.length);
		expect(screen.queryByTestId("k-avatar-group-overflow")).toBeNull();
	});

	it("max=0 renders only the overflow chip counting the full array", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS} max={0} />,
		);
		expect(screen.queryByTestId("k-avatar")).toBeNull();
		expect(screen.getByText(`+${AVATARS.length}`)).toBeTruthy();
		expect(screen.getByTestId("k-avatar-group-overflow")).toBeTruthy();
	});

	it("overlap: every avatar after the first carries a negative marginLeft", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS.slice(0, 3)} />,
		);
		const group = screen.getByTestId("k-avatar-group");
		const raw = group.props.children;
		const kids = (Array.isArray(raw) ? raw.flat(Infinity) : [raw]).filter(
			Boolean,
		) as Array<{
			props: { children?: unknown; style?: unknown };
		}>;
		expect(kids).toHaveLength(3);
		const margins = kids.map((kid) => flatStyle(kid).marginLeft);
		// the first member carries no margin at all (style dropped entirely)
		expect(margins[0] ?? 0).toBe(0);
		expect(Number(margins[1])).toBeLessThan(0);
		expect(Number(margins[2])).toBeLessThan(0);
		// the card-colored ring lives on the wrapper's inner view
		const ring = kids[1].props.children as { props: { style?: unknown } };
		const ringStyle = flatStyle(ring);
		expect(Number(ringStyle.borderWidth)).toBeGreaterThan(0);
		expect(ringStyle.borderColor).toBeTruthy();
		// the overlap clip belongs to the group's ring wrapper, not to the
		// Avatar root (Avatar's root must stay unclipped so its status dot
		// renders in full)
		expect(ringStyle.overflow).toBe("hidden");
		const memberRoot = screen.getAllByTestId("k-avatar")[1];
		expect(flatStyle(memberRoot).overflow).not.toBe("hidden");
	});

	it("sizes map through the Avatar scale with distinct dimensions", async () => {
		const sm: Screen = await render(
			<AvatarGroup avatars={[{ name: "A" }]} size="sm" />,
		);
		const lg: Screen = await render(
			<AvatarGroup avatars={[{ name: "A" }]} size="lg" />,
		);
		const dSm = flatStyle(sm.getAllByTestId("k-avatar")[0]);
		const dLg = flatStyle(lg.getAllByTestId("k-avatar")[0]);
		expect(Number(dSm.width)).toBeLessThan(Number(dLg.width));
	});

	it("empty avatars renders an empty container without crashing", async () => {
		const screen: Screen = await render(<AvatarGroup avatars={[]} />);
		expect(screen.getByTestId("k-avatar-group")).toBeTruthy();
		expect(screen.queryByTestId("k-avatar")).toBeNull();
		expect(screen.queryByTestId("k-avatar-group-overflow")).toBeNull();
	});

	it("container is a row with the names summarized in its label", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS.slice(0, 2)} />,
		);
		const group = screen.getByTestId("k-avatar-group");
		expect(flatStyle(group).flexDirection).toBe("row");
		expect(group.props.accessibilityLabel).toContain("Ada Lovelace");
		expect(group.props.accessibilityLabel).toContain("Grace Hopper");
	});

	it("slotStyles.root slot wins over the library surface", async () => {
		const screen: Screen = await render(
			<AvatarGroup
				avatars={[{ name: "A" }]}
				slotStyles={{ root: { gap: 9 } }}
			/>,
		);
		expect(flatStyle(screen.getByTestId("k-avatar-group")).gap).toBe(9);
	});

	it("duplicate names render one k-avatar each without key collisions", async () => {
		const screen: Screen = await render(
			<AvatarGroup
				avatars={[
					{ name: "Ada Lovelace" },
					{ name: "Ada Lovelace" },
					{ name: "Grace Hopper" },
				]}
			/>,
		);
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(3);
		expect(screen.getAllByText("AL")).toHaveLength(2);
	});

	it("fractional max below length floors to a whole count and integer chip", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS} max={2.5} />,
		);
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(2);
		expect(screen.getByText("+4")).toBeTruthy();
	});

	it("fractional max above length renders all with no chip", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS} max={7.5} />,
		);
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(AVATARS.length);
		expect(screen.queryByTestId("k-avatar-group-overflow")).toBeNull();
	});

	it("max equal to length renders all with no '+0' chip", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={AVATARS} max={AVATARS.length} />,
		);
		expect(screen.getAllByTestId("k-avatar")).toHaveLength(AVATARS.length);
		expect(screen.queryByText("+0")).toBeNull();
		expect(screen.queryByTestId("k-avatar-group-overflow")).toBeNull();
	});

	it("member ring outer size tracks the Avatar BOX scale", async () => {
		const screen: Screen = await render(
			<AvatarGroup avatars={[{ name: "A" }, { name: "B" }]} size="lg" />,
		);
		const group = screen.getByTestId("k-avatar-group");
		const raw = group.props.children;
		const kids = (Array.isArray(raw) ? raw.flat(Infinity) : [raw]).filter(
			Boolean,
		) as Array<{ props: { children?: unknown; style?: unknown } }>;
		const ring = kids[0].props.children as { props: { style?: unknown } };
		expect(flatStyle(ring).width).toBe(AVATAR_BOX.lg + 4);
		expect(flatStyle(screen.getAllByTestId("k-avatar")[0]).width).toBe(
			AVATAR_BOX.lg,
		);
	});
});
