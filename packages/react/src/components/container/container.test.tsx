import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./container";

describe("Container", () => {
  it("renders children correctly", () => {
    render(<Container>Content</Container>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Container data-testid="container">Content</Container>);
    const container = screen.getByTestId("container");
    expect(container).toHaveClass("mx-auto");
    expect(container).toHaveClass("max-w-screen-xl");
  });

  it("applies custom size class", () => {
    render(<Container data-testid="container" size="sm">Content</Container>);
    const container = screen.getByTestId("container");
    expect(container).toHaveClass("max-w-screen-sm");
  });

  it("applies centered class", () => {
    render(<Container data-testid="container" centered>Content</Container>);
    const container = screen.getByTestId("container");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("justify-center");
  });
});
