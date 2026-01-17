import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "./stack";

describe("Stack", () => {
  it("renders children correctly", () => {
    render(
      <Stack data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("applies default classes", () => {
    render(<Stack data-testid="stack">Content</Stack>);
    const stack = screen.getByTestId("stack");
    expect(stack).toHaveClass("flex");
    expect(stack).toHaveClass("flex-col");
    expect(stack).toHaveClass("gap-4");
  });

  it("applies custom direction", () => {
    render(<Stack data-testid="stack" direction="row">Content</Stack>);
    const stack = screen.getByTestId("stack");
    expect(stack).toHaveClass("flex-row");
  });
});
