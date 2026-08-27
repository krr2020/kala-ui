import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMounted } from "../use-mounted/use-mounted";

function MountProbe({ log }: { log: boolean[] }) {
	const mounted = useMounted();
	log.push(mounted);
	return null;
}

describe("useMounted", () => {
	it("is false on the first render and true after mount", () => {
		const log: boolean[] = [];
		render(<MountProbe log={log} />);

		expect(log[0]).toBe(false);
		expect(log[log.length - 1]).toBe(true);
		expect(log).toEqual([false, true]);
	});
});
