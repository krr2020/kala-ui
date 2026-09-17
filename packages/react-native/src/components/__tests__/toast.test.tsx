import { render } from "@testing-library/react-native";
import { Toast } from "../toast";

const inclHidden = { includeHiddenElements: true } as const;

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

describe("Toast", () => {
	it("viewport fills the screen with explicit edges — no inset shorthand", async () => {
		const screen = await render(
			<Toast open onOpenChange={() => {}}>
				<Toast.Title>Saved</Toast.Title>
			</Toast>,
		);
		const flat = flatStyle(screen.getByTestId("k-toast-viewport", inclHidden));
		expect(flat.position).toBe("absolute");
		expect(flat.top).toBe(0);
		expect(flat.right).toBe(0);
		expect(flat.bottom).toBe(0);
		expect(flat.left).toBe(0);
		expect("inset" in flat).toBe(false);
		expect(
			screen.getByTestId("k-toast-viewport", inclHidden).props.pointerEvents,
		).toBe("box-none");
	});

	it("closed renders nothing; duration timer is absent without a duration", async () => {
		const screen = await render(
			<Toast open={false} onOpenChange={() => {}}>
				<Toast.Title>Saved</Toast.Title>
			</Toast>,
		);
		expect(screen.queryByTestId("k-toast-viewport", inclHidden)).toBeNull();
	});
});
