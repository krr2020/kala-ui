import { fireEvent, render } from "@testing-library/react-native";
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

const theme = () => require("../../themes").themes.light;

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

	it("duration fires onOpenChange(false) once, and only while open", async () => {
		const onOpenChange = jest.fn();
		jest.useFakeTimers();
		try {
			const screen = await render(
				<Toast open onOpenChange={onOpenChange} duration={1000}>
					<Toast.Title>Saved</Toast.Title>
				</Toast>,
			);
			expect(screen.getByTestId("k-toast", inclHidden)).toBeTruthy();
			jest.advanceTimersByTime(1000);
			expect(onOpenChange).toHaveBeenCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(false);
		} finally {
			jest.useRealTimers();
		}
	});

	it("no duration arm keeps the toast mounted indefinitely", async () => {
		const onOpenChange = jest.fn();
		jest.useFakeTimers();
		try {
			await render(
				<Toast open onOpenChange={onOpenChange}>
					<Toast.Title>Saved</Toast.Title>
				</Toast>,
			);
			jest.advanceTimersByTime(60_000);
			expect(onOpenChange).not.toHaveBeenCalled();
		} finally {
			jest.useRealTimers();
		}
	});

	it("pressing the toast region is not required — viewport passes touches through", async () => {
		const screen = await render(
			<Toast open onOpenChange={() => {}}>
				<Toast.Title>Saved</Toast.Title>
			</Toast>,
		);
		const toast = screen.getByTestId("k-toast", inclHidden);
		fireEvent(toast, "layout");
		expect(toast).toBeTruthy();
	});
});

describe("Toast resolved style tables", () => {
	it("viewport carries zIndex 200, padding 16, and justifyContent by position", async () => {
		const bottom = await render(
			<Toast open onOpenChange={() => {}} position="bottom">
				<Toast.Title>Saved</Toast.Title>
			</Toast>,
		);
		const vb = flatStyle(bottom.getByTestId("k-toast-viewport", inclHidden));
		expect(vb.zIndex).toBe(200);
		expect(vb.padding).toBe(16);
		expect(vb.justifyContent).toBe("flex-end");

		const top = await render(
			<Toast open onOpenChange={() => {}} position="top">
				<Toast.Title>Saved</Toast.Title>
			</Toast>,
		);
		const vt = flatStyle(top.getByTestId("k-toast-viewport", inclHidden));
		expect(vt.justifyContent).toBe("flex-start");
	});

	it("root surfaces the card table: bg/border/radius/padding/gap/stretch", async () => {
		const screen = await render(
			<Toast open onOpenChange={() => {}}>
				<Toast.Title>Saved</Toast.Title>
			</Toast>,
		);
		const s = flatStyle(screen.getByTestId("k-toast", inclHidden));
		expect(s.backgroundColor).toBe(theme().card);
		expect(s.borderWidth).toBe(1);
		expect(s.borderColor).toBe(theme().border);
		expect(s.borderRadius).toBe(10);
		expect(s.padding).toBe(14);
		expect(s.gap).toBe(2);
		expect(s.alignSelf).toBe("stretch");
	});

	it("title and description typography match their tables", async () => {
		const screen = await render(
			<Toast open onOpenChange={() => {}}>
				<Toast.Title>Saved</Toast.Title>
				<Toast.Description>Changes are live</Toast.Description>
			</Toast>,
		);
		const title = flatStyle(screen.getByTestId("k-toast-title", inclHidden));
		expect(title.fontSize).toBe(15);
		expect(title.fontWeight).toBe("600");
		expect(title.color).toBe(theme().foreground);
		const desc = flatStyle(
			screen.getByTestId("k-toast-description", inclHidden),
		);
		expect(desc.fontSize).toBe(14);
		expect(desc.color).toBe(theme().mutedForeground);
	});
});
