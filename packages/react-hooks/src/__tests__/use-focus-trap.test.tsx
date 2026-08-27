import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { useEffect, useState } from "react";
import { describe, expect, it } from "vitest";
import { useFocusTrap } from "../use-focus-trap/use-focus-trap";

// Disabled and Hidden sit at the boundaries on purpose: every wrap must skip
// them and land on the real focusables (First/Last).
function Trap() {
	const trapRef = useFocusTrap(true);
	return (
		<div ref={trapRef}>
			<button type="button" disabled>
				Disabled
			</button>
			<button type="button">First</button>
			<button type="button" hidden>
				Hidden
			</button>
			<button type="button">Last</button>
		</div>
	);
}

function tab(shiftKey = false) {
	fireEvent(
		document,
		new KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true }),
	);
}

describe("useFocusTrap", () => {
	it("moves focus into the trap on activation, skipping disabled elements", () => {
		render(<Trap />);
		expect(document.activeElement).toBe(screen.getByText("First"));
	});

	it("wraps Tab from the last focusable to the first", () => {
		render(<Trap />);
		act(() => {
			screen.getByText("Last").focus();
		});

		tab();
		expect(document.activeElement).toBe(screen.getByText("First"));
	});

	it("wraps Shift+Tab from the first to the last, skipping hidden elements", () => {
		render(<Trap />);
		act(() => {
			screen.getByText("First").focus();
		});

		tab(true);
		expect(document.activeElement).toBe(screen.getByText("Last"));
	});

	it("restores focus to the outside element when the trap deactivates", () => {
		function Harness() {
			const [active, setActive] = useState(false);
			return (
				<>
					<button type="button">Outside</button>
					<button type="button" onClick={() => setActive((a) => !a)}>
						Toggle
					</button>
					{active && <Trap />}
				</>
			);
		}
		render(<Harness />);

		act(() => {
			screen.getByText("Outside").focus();
		});
		act(() => {
			screen.getByText("Toggle").click();
		});
		// Activation pulled focus into the trap.
		expect(document.activeElement).toBe(screen.getByText("First"));

		act(() => {
			screen.getByText("Toggle").click();
		});
		// Deactivation restored the pre-trap focus target.
		expect(document.activeElement).toBe(screen.getByText("Outside"));
	});
});

describe("useFocusTrap late-mounting node", () => {
	it("moves focus into a node that attaches after activation (portal pattern)", async () => {
		function LateOverlay() {
			const trapRef = useFocusTrap(true);
			const [mounted, setMounted] = useState(false);
			useEffect(() => {
				const id = setTimeout(() => setMounted(true), 0);
				return () => clearTimeout(id);
			}, []);
			return mounted ? (
				<div ref={trapRef}>
					<button type="button">Inside</button>
				</div>
			) : null;
		}
		render(<LateOverlay />);
		await waitFor(() => {
			expect(document.activeElement).toBe(
				screen.getByRole("button", { name: "Inside" }),
			);
		});
	});
});
