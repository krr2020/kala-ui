import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Indicator } from "./indicator";

describe("Indicator", () => {
  it("renders children correctly", () => {
    render(
      <Indicator>
        <div data-testid="target">Target</div>
      </Indicator>
    );
    expect(screen.getByTestId("target")).toBeInTheDocument();
  });

  it("renders label correctly", () => {
    render(
      <Indicator label="New">
        <div>Target</div>
      </Indicator>
    );
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("does not render when disabled", () => {
    render(
      <Indicator disabled label="New">
        <div>Target</div>
      </Indicator>
    );
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("applies inline style when inline prop is true", () => {
    const { container } = render(
      <Indicator inline>
        <div>Target</div>
      </Indicator>
    );
    // The wrapper div is the first child of the container
    expect(container.firstChild).toHaveClass("inline-block");
  });

  it("applies processing animation class", () => {
    const { container } = render(
      <Indicator processing>
        <div>Target</div>
      </Indicator>
    );
    // The indicator element is the first child of the wrapper
    const indicator = container.firstChild?.firstChild;
    expect(indicator).toHaveClass("animate-pulse");
  });
});
