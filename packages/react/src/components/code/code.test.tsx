import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Code } from "./code";

describe("Code", () => {
	it("renders inline code by default", () => {
		render(<Code>const a = 1;</Code>);
		const code = screen.getByText("const a = 1;");
		expect(code.tagName).toBe("CODE");
	});

	it("renders block code when block prop is true", () => {
		render(<Code block>const a = 1;</Code>);
		const code = screen.getByText("const a = 1;");
		expect(code.tagName).toBe("PRE");
	});
});
